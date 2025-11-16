"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/pages/route";
import { WikiEmptyState } from "./wiki-empty-state";
import { WikiGeneratingState } from "./wiki-generating-state";
import { WikiErrorState } from "./wiki-error-state";
import { Header } from "../header";
import { getGithubUrl } from "@/lib/utils";
import { LeftSidebar } from "../left-sidebar";
import { WikiStatus } from "@/api/core/entities/wiki";

export function KickoffWikiGeneration({
  owner,
  repo,
  children,
}: {
  owner: string;
  repo: string;
  children: React.ReactNode;
}) {
  const { data, isLoading, refetch } = useQuery<GetWikiResponseDto>({
    queryKey: [`wiki/${owner}/${repo}/pages`],
    refetchInterval: (query) => {
      // Poll every 5 seconds if wiki is started or generating
      const wiki = query.state.data?.wiki;
      return wiki?.status === WikiStatus.STARTED ||
        wiki?.status === WikiStatus.GENERATING
        ? 5000
        : false;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data?.wiki) return <WikiEmptyState owner={owner} repo={repo} />;

  // Handle generating state (both STARTED and GENERATING)
  if (
    data.wiki.status === WikiStatus.STARTED ||
    data.wiki.status === WikiStatus.GENERATING
  ) {
    return <WikiGeneratingState />;
  }

  // Handle failed state
  if (data.wiki.status === WikiStatus.FAILED) {
    return (
      <WikiErrorState owner={owner} repo={repo} onRetry={() => refetch()} />
    );
  }

  // Render the skeleton + left sidenav (GENERATED state)
  return (
    <div>
      <Header githubUrl={getGithubUrl(owner, repo)} />

      <div className="px-4 container mx-auto">
        <div className="flex gap-6 lg:gap-10">
          <LeftSidebar pages={data.pages} owner={owner} repo={repo} />

          {/* Wiki page renders the main content + right sidenav */}
          {children}
        </div>
      </div>
    </div>
  );
}
