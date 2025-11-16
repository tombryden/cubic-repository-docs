"use client";

import { getGithubUrl } from "@/lib/utils";
import { MarkdownRenderer } from "./_components/markdown-renderer";
import { RightSidebar } from "./_components/right-sidebar";
import { WikiPageSkeleton } from "./_components/wiki-page-skeleton";
import { useQuery } from "@tanstack/react-query";
import type { GetWikiPageResponseDto } from "@/app/api/wiki/[owner]/[repo]/[pageSlug]/route";
import { use, useEffect } from "react";

export default function WikiPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; wikiPageSlug: string }>;
}) {
  const { owner, repo, wikiPageSlug } = use(params);

  // Scroll to top when the page slug changes
  useEffect(() => {
    window.scrollTo({ behavior: "instant", top: 0, left: 0 });
  }, [wikiPageSlug]);

  const { data: pageData, isLoading } = useQuery<GetWikiPageResponseDto>({
    queryKey: [`wiki/${owner}/${repo}/${wikiPageSlug}`],
  });

  if (isLoading) {
    return <WikiPageSkeleton />;
  }

  if (!pageData) {
    return <div>Page not found!</div>;
  }

  if (pageData) {
    return (
      <>
        {/* Main Content */}
        <main className="flex-1 min-w-0 py-8">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
              <a
                href={getGithubUrl(owner, repo, false)}
                className="hover:text-foreground transition-colors"
                target="_blank"
              >
                {owner}
              </a>
              <span>/</span>
              <a
                href={getGithubUrl(owner, repo)}
                className="hover:text-foreground transition-colors"
                target="_blank"
              >
                {repo}
              </a>
            </div>

            {/* Content Sections */}
            <div className="markdown-content">
              <MarkdownRenderer owner={owner} repo={repo}>
                {pageData.content}
              </MarkdownRenderer>
            </div>
          </div>
        </main>

        <RightSidebar
          markdown={pageData.content}
          githubUrl={getGithubUrl(owner, repo)}
        />
      </>
    );
  }
}
