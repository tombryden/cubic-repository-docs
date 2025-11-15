import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-4xl font-bold mb-6 mt-8 pb-3 border-b border-border first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mb-4 mt-12 pb-2 border-b border-border first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mb-3 mt-8">{children}</h3>
        ),
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
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
