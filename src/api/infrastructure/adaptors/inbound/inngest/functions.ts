import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { Octokit } from "@octokit/rest";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const octokit = new Octokit();

export const repositoryAnalyser = inngest.createFunction(
  { id: "repository-analyser" },
  { event: "reposcribe/repository-analysis" },
  async ({ event, step }) => {
    const { owner, repo } = event.data;

    // Step 1: Pull repository file tree
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

    // Step 2: Pull the README file
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

    // Step 3: Analyse the tree into user features with their corresponding files using AI.
    const analysis = await step.run("analyse-tree", async () => {
      const tidiedTree = tree.data.tree
        .map((item) => ({
          type: item.type,
          path: item.path,
        }))
        .join("\n");

      const { object } = await generateObject({
        model: openai("gpt-5-mini"),
        schema: z.object({
          title: z.string().describe("The title of the overall wiki"),
          description: z
            .string()
            .describe("The description of the overall wiki"),
          pages: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
              files: z
                .array(z.string())
                .describe(
                  "The file paths that are relevant to the page, you should include ALL files that are relevant as these will be used to generate the content of the page."
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

              I want to create a wiki for this repository. Determine the most logical structure for a wiki based on the repository's content.
              `,
          },
        ],
      });

      return object;
    });

    return analysis;
  }
);
