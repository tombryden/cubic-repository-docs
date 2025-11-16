"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface LeftSidebarProps {
  pages: {
    title: string;
    slug: string;
  }[];
  owner: string;
  repo: string;
}

export function LeftSidebar({ pages, owner, repo }: LeftSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-8 pr-4">
        <nav className="space-y-1">
          {pages.map((page) => {
            const pageUrl = `/${owner}/${repo}/${page.slug}`;
            const isActive = pathname === pageUrl;

            return (
              <Link
                key={page.slug}
                href={pageUrl}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {page.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
