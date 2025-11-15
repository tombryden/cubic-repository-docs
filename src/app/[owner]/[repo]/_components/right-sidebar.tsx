import { Github, Edit, MessageSquare } from "lucide-react";
import slugify from "slugify";

interface Heading {
  id: string;
  level: number;
  text: string;
  children: Heading[];
}

interface RightSidebarProps {
  markdown: string;
}

// Parse markdown and extract headings
function parseHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  const stack: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/); // find the first 1-6 # and the text after it (skipping whitespace)
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text, { lower: true, strict: true });

      const heading: Heading = {
        id,
        level,
        text,
        children: [],
      };

      // Find the correct parent in the stack
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // Top level heading
        headings.push(heading);
      } else {
        // Nested heading
        stack[stack.length - 1].children.push(heading);
      }

      stack.push(heading);
    }
  }

  return headings;
}

// Render nested headings
function renderHeadings(headings: Heading[], depth = 0) {
  return (
    <ul className={`space-y-2 text-sm ${depth > 0 ? "mt-2 ml-4" : ""}`}>
      {headings.map((heading) => (
        <li key={heading.id}>
          <a
            href={`#${heading.id}`}
            className="block py-1 text-muted-foreground hover:text-foreground transition-colors border-l-2 border-transparent hover:border-primary pl-3"
          >
            {heading.text}
          </a>
          {heading.children.length > 0 &&
            renderHeadings(heading.children, depth + 1)}
        </li>
      ))}
    </ul>
  );
}

export function RightSidebar({ markdown }: RightSidebarProps) {
  const headings = parseHeadings(markdown);

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-20 py-8 pl-4">
        <h4 className="mb-4 text-sm font-semibold">On this page</h4>
        <nav>{renderHeadings(headings)}</nav>

        <div className="mt-8 pt-8 border-t border-border">
          <h4 className="mb-4 text-sm font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit this page</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Feedback</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
