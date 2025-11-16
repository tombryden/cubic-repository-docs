import { getSlug } from "@/lib/utils";
import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Get the text content of the markdown children
 */
function getTextContent(children: React.ReactNode): string {
  if (typeof children !== "string") {
    throw new Error("Children must be a string");
  }
  return children;
}

/**
 * Parse inline citations and convert them to GitHub links
 * Format: [filepath:startLine-endLine;anotherfile:startLine-endLine]
 * Example: [README.md:1-2;README.md:4-9]
 */
function processCitations(
  content: string,
  owner: string,
  repo: string,
  branch: string = "main"
): string {
  // Match citations in the format [filepath:startLine-endLine;...]
  // Use .+? (non-greedy) to allow brackets in filepath
  const citationRegex = /\[(.+?:[0-9]+-[0-9]+(?:;.+?:[0-9]+-[0-9]+)*)\]/g;

  return content.replace(citationRegex, (match, citationsGroup) => {
    // Split multiple citations by semicolon
    const citations = citationsGroup.split(";");

    // Convert each citation to a markdown link
    const links = citations.map((citation: string) => {
      const parts = citation.trim().match(/^(.+):([0-9]+)-([0-9]+)$/);
      if (!parts) return citation; // Return as-is if format is invalid

      const [, filepath, startLine, endLine] = parts;
      const githubUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${filepath}#L${startLine}-L${endLine}`;

      // Create a descriptive link text
      const linkText = `${filepath}:${startLine}-${endLine}`;
      return `[${linkText}](${githubUrl})`;
    });

    // Join multiple citations with a comma and space
    return links.join(", ");
  });
}

export function MarkdownRenderer({
  children,
  owner,
  repo,
  branch = "main",
}: {
  children: string;
  owner: string;
  repo: string;
  branch?: string;
}) {
  // Process citations before rendering
  const processedContent = processCitations(children, owner, repo, branch);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          const text = getTextContent(children);
          const id = getSlug(text);
          return (
            <h1
              id={id}
              className="text-4xl font-bold mb-6 mt-8 pb-3 border-b border-border first:mt-0 scroll-mt-20"
            >
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          const text = getTextContent(children);
          const id = getSlug(text);
          return (
            <h2
              id={id}
              className="text-2xl font-semibold mb-4 mt-12 pb-2 border-b border-border first:mt-0 scroll-mt-20"
            >
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          const text = getTextContent(children);
          const id = getSlug(text);
          return (
            <h3
              id={id}
              className="text-xl font-semibold mb-3 mt-8 scroll-mt-20"
            >
              {children}
            </h3>
          );
        },
        p: ({ children }) => (
          <p className="text-muted-foreground leading-relaxed mb-4">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-2 mb-6 ml-4">{children}</ul>
        ),
        li: ({ children }) => (
          <li className="text-muted-foreground leading-relaxed">{children}</li>
        ),
        code: ({ className, children, ...props }) => {
          const isInline = !className;
          return isInline ? (
            <code
              className="px-1.5 py-0.5 rounded bg-muted/50 text-sm font-mono text-foreground"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="rounded-lg border border-border bg-muted/50 p-6 my-6 overflow-x-auto">
            <code className="text-sm text-muted-foreground font-mono">
              {children}
            </code>
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-border">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-border/50 hover:bg-muted/30 transition-colors">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="text-left py-3 px-4 font-semibold">{children}</th>
        ),
        td: ({ children }) => (
          <td className="py-3 px-4 text-sm text-muted-foreground">
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mt-6 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm [&>p]:mb-0">{children}</div>
            </div>
          </blockquote>
        ),
        a: ({ href, children }) => {
          // Check if this is a GitHub file reference link (citation)
          const isCitation =
            href?.includes("github.com") && href?.includes("#L");

          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isCitation
                  ? "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 transition-colors no-underline"
                  : "text-blue-600 dark:text-blue-400 hover:underline"
              }
            >
              {children}
            </a>
          );
        },
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
}
