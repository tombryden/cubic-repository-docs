import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { Octokit } from "@octokit/rest";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { ENV } from "@/lib/vars";
import { container } from "tsyringe";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiRepositoryPort } from "@/api/core/ports/outbound/wiki-repository-port";
import { Wiki, WikiStatus } from "@/api/core/entities/wiki";
import { WikiPageRepositoryPort } from "@/api/core/ports/outbound/wiki-page-repository-port";
import { WikiPage } from "@/api/core/entities/wiki-page";
import { getSlug } from "@/api/infrastructure/utils";

// Repositories
const wikiRepository = container.resolve<WikiRepositoryPort>(
  DI.WIKI_REPOSITORY
);
const wikiPageRepository = container.resolve<WikiPageRepositoryPort>(
  DI.WIKI_PAGE_REPOSITORY
);

const octokit = new Octokit({
  auth: ENV.GITHUB_TOKEN,
});

// Event data schemas
const repositoryAnalysisEventSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository name is required"),
});

const wikiPageGenerationEventSchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repository name is required"),
  filePaths: z.array(z.string()).min(1, "At least one file path is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().min(0, "Order must be a non-negative number"),
});

export const repositoryAnalyser = inngest.createFunction(
  { id: "repository-analyser" },
  { event: "reposcribe/repository-analysis" },
  async ({ event, step }) => {
    // Validate event data
    const validationResult = repositoryAnalysisEventSchema.safeParse(
      event.data
    );
    if (!validationResult.success) {
      throw new NonRetriableError(
        `Invalid event data: ${validationResult.error.message}`
      );
    }
    const { owner, repo } = validationResult.data;

    // Step 1: Store wiki in db with 'generating' status
    const wiki = await step.run("store-wiki", async () => {
      // Check if it is currently generating, error if it is
      const existingWiki = await wikiRepository.findOneByRepository(
        owner,
        repo
      );
      if (existingWiki && existingWiki.status === WikiStatus.GENERATING) {
        throw new NonRetriableError("Wiki is currently generating");
      }

      // Create or update wiki with 'generating' status
      return await wikiRepository.upsert(
        new Wiki({
          repository: Wiki.getRepositoryString(owner, repo),
          status: WikiStatus.GENERATING,
        })
      );
    });

    // Step 2: Pull repository file tree
    const tree = await step.run("pull-repository-tree", async () => {
      try {
        // Check the github url exists
        const repoResponse = await octokit.git.getTree({
          owner,
          repo,
          tree_sha: "main",
          recursive: "true",
        });

        if (repoResponse.data.truncated) {
          throw new NonRetriableError(
            "Repository is too large to process (>100,000 files)"
          );
        }

        return repoResponse;
      } catch (error) {
        if (error instanceof NonRetriableError) {
          throw error;
        }

        if (error instanceof Error && "status" in error) {
          if (error.status === 404) {
            throw new NonRetriableError("Repository not found");
          }
        }

        // Allow inngest to retry if unexpected error
        throw error;
      }
    });

    // Step 3: Pull the README file
    const readme = await step.run("pull-readme", async () => {
      try {
        const readmeResponse = await octokit.repos.getReadme({
          owner,
          repo,
        });
        return Buffer.from(readmeResponse.data.content, "base64").toString(
          "utf-8"
        );
      } catch (error) {
        if (error instanceof NonRetriableError) {
          throw error;
        }

        if (error instanceof Error && "status" in error) {
          if (error.status === 404) {
            // No README file exists, continue with empty string
            return "";
          }
        }

        // Allow inngest to retry if unexpected error
        throw error;
      }
    });

    // Step 4: Analyse the tree into user features with their corresponding files using AI.
    const analysis = await step.run("analyse-tree", async () => {
      const tidiedTree = tree.data.tree
        .map((item) => ({
          type: item.type,
          path: item.path,
        }))
        .join("\n");

      const { object } = await generateObject({
        model: openai("gpt-5-mini"),
        providerOptions: {
          openai: {
            reasoningEffort: "high", // to try and prevent hallucinations
          },
        },
        schema: z.object({
          title: z.string().describe("The title of the overall wiki"),
          description: z
            .string()
            .describe("The description of the overall wiki"),
          pages: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              filePaths: z.array(z.string()).describe(
                `
                The file paths FROM THE <file_tree> xml tag sent by the user that are relevant to the page - these will be used to get the information to build the page.

                IMPORTANT:
                Be generous when selecting file paths, the more file paths you select the more information you will have to build the page - select any files you think might be relevant. Pick maximum of 10 file paths.

                You MUST choose at least 3 file paths.

                Good examples of file paths:
                \`src/components/Button.tsx\`
                \`src/pages/Home.tsx\`
                \`src/utils/helpers.ts\`
                \`README.md\`
                
                Rules:
                DO NOT pick more than 10 file paths.
                DO NOT make up file paths that are not in the <file_tree> xml tag.
                Do not select images
                Do not select directories without the actual file (e.g. \`src/components\`, \`src/pages\`, \`src/utils\`, etc.)
                  `
              ),
            })
          ).describe(`
            The pages of the wiki.
            
            IMPORTANT! These should be what the software does for users, not just how they are technically organised.

            Good structure: User onboarding flow, authentication, feature X, feature Y, feature Z

            Bad structure: Frontend, API, backend, utils
            `),
        }),
        messages: [
          {
            role: "user",
            content: `
              Analyse this GitHub repository ${owner}/${repo} and create a wiki structure for it.

              1. The complete file tree of the project:
              <file_tree>
              ${tidiedTree}
              </file_tree>

              2. The README file of the project:
              <readme>
              ${readme}
              </readme>

              I want to create a 4-12 page wiki for this repository. Determine the most logical structure for a wiki based on the repository's content.
              `,
          },
        ],
      });

      // Throw errors if AI generated invalid data, Inngest will retry
      if (object.pages.length === 0) {
        throw new Error("No pages found");
      }

      const hasEmptyFilePaths = object.pages.some(
        (page) => page.filePaths.length === 0
      );
      if (hasEmptyFilePaths) {
        throw new Error("At least one page has no file paths");
      }

      return object;
    });

    // Step 5: fan out the wiki generation for each page and wait for completion
    await Promise.all(
      analysis.pages.map((page, index) =>
        step.invoke(`generate-page-${index}`, {
          function: wikiGenerator,
          data: {
            owner,
            repo,
            filePaths: page.filePaths,
            title: page.name,
            description: page.description,
            order: index,
          } satisfies z.infer<typeof wikiPageGenerationEventSchema>,
        })
      )
    );

    // Step 6: All pages generated, update wiki status
    await step.run("update-wiki-status", async () => {
      return await wikiRepository.updateStatus(wiki.id, WikiStatus.GENERATED);
    });

    return analysis;
  }
);

export const wikiGenerator = inngest.createFunction(
  {
    id: "wiki-page-generator",
    concurrency: [
      {
        limit: 10, // So there's less risk of hitting GitHub's 100 req/s limit
      },
    ],
  },
  { event: "reposcribe/wiki-page-generation" },
  async ({ event, step }) => {
    // Validate event data
    const validationResult = wikiPageGenerationEventSchema.safeParse(
      event.data
    );
    if (!validationResult.success) {
      throw new NonRetriableError(
        `Invalid event data: ${validationResult.error.message}`
      );
    }
    const { owner, repo, filePaths, title, description, order } =
      validationResult.data;

    // because TS isn't picking up the type
    interface FileContent {
      path: string;
      content: string;
    }
    type File = FileContent | null;

    // Step 1: Fetch file contents
    const fileContents = await step.run("fetch-files", async () => {
      // Fetch all file contents from GitHub
      const files: File[] = await Promise.all(
        filePaths.map(async (filePath: string): Promise<File | null> => {
          try {
            const response = await octokit.repos.getContent({
              owner,
              repo,
              path: filePath,
            });

            // Handle single file response
            if (
              !Array.isArray(response.data) &&
              response.data.type === "file"
            ) {
              const decodedContent = Buffer.from(
                response.data.content,
                "base64"
              ).toString("utf-8");

              // Add line numbers to each line
              const contentWithLineNumbers = decodedContent
                .split("\n")
                .map((line, index) => `${index + 1}|${line}`)
                .join("\n");

              return {
                path: response.data.path,
                content: contentWithLineNumbers,
              };
            }
          } catch (error) {
            if (
              error instanceof Error &&
              "status" in error &&
              error.status === 404
            ) {
              console.error(`File ${filePath} not found in ${owner}/${repo}`);
              return null;
            }
            throw error;
          }

          return null;
        })
      );

      // Filter out nulls (directories for example AI accidently passed in)
      const allFiles = files
        .flat()
        .filter((file): file is FileContent => file !== null);

      // Format in an AI-readable structure
      const formattedContent = allFiles
        .map((file) => {
          return `<file path="${file.path}">
${file.content}
</file>`;
        })
        .join("\n\n");

      return formattedContent;
    });

    // Step 2: Generate content with AI
    const content = await step.run("generate-content", async () => {
      const { text } = await generateText({
        model: openai("gpt-5-mini"),
        providerOptions: {
          openai: {
            reasoningEffort: "high", // to try and prevent hallucinations
          },
        },
        messages: [
          {
            role: "user",
            content: `
You are a technical documentation expert. Generate comprehensive wiki page content in GitHub-flavored Markdown for the ${owner}/${repo} repository.

IMPORTANT: Use inline citations when referencing specific files or code sections throughout your documentation. Citations should be in the format [filepath:startLine-endLine] directly inline with the text. For example: "The authentication logic[src/auth/login.ts:15-30] handles user credentials." Do NOT use numbered references like [1], [2] - always use the full filepath inline. For multiple citations use the format: [filepath:startLine-endLine;filepath2:startLine-endLine]

IMPORTANT:
Ensure you use proper markdown formatting for styling. This is incredibly important. For example:
# Heading 1
## Heading 2
### Heading 3
- List item 1
- List item 2
- List item 3

\`\`\`javascript
const example = "example";
\`\`\`

Table:
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |


1. Wiki Page Title:
<title>
${title}
</title>

2. Wiki Page Description:
<description>
${description}
</description>

3. The relevant source files for this wiki page:
<source_files>
${fileContents}
</source_files>

Please create detailed, well-structured documentation that:
1. Starts with a concise 1-2 sentence description of what this feature/functionality does
2. Documents the public interfaces or entry points (APIs, functions, components, classes, etc.) that developers would use
3. Explains what this feature/functionality does for users
4. Includes code examples from the provided files where relevant
5. Describes how the different files work together
6. Uses proper GitHub-flavored Markdown formatting (headings, code blocks, lists, etc.)
7. Is organized in a logical, easy-to-follow structure
8. Includes helpful context and explanations for developers

Generate ONLY the markdown content for the wiki page body.
            `,
          },
        ],
      });

      return text;
    });

    // Step 3: Save page to database
    await step.run("save-page", async () => {
      // Get the wiki to retrieve the wikiId
      const wiki = await wikiRepository.findOneByRepository(owner, repo);
      if (!wiki) {
        throw new NonRetriableError(
          `Wiki not found for repository ${owner}/${repo}`
        );
      }

      // Create slug from title
      const slug = getSlug(title);

      // Create and insert the new wiki page
      const wikiPage = new WikiPage({
        wikiId: wiki.id,
        title,
        slug,
        markdownContent: content,
        order,
      });

      return await wikiPageRepository.insert(wikiPage);
    });

    return { content, fileContents };
  }
);
