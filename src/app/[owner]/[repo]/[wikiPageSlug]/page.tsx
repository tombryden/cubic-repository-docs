import { getGithubUrl } from "@/lib/utils";
import { MarkdownRenderer } from "./_components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RightSidebar } from "./_components/right-sidebar";
import { ENV } from "@/lib/vars";
import { GetWikiPageResponseDto } from "@/app/api/wiki/[owner]/[repo]/[pageSlug]/route";

export default async function WikiPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string; wikiPageSlug: string }>;
}) {
  const { owner, repo, wikiPageSlug } = await params;

  const resp = await fetch(
    `${ENV.API_URL}/wiki/${owner}/${repo}/${wikiPageSlug}`
  );
  const data = await resp.json();
  if (!data.success) {
    return <div>Page not found!</div>;
  }

  if (data.success) {
    const pageData: GetWikiPageResponseDto = data.data;

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

            {/* Navigation Footer */}
            <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button className="gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
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
