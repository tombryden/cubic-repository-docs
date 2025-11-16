"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/pages/route";
import { WikiEmptyState } from "./wiki-empty-state";
import { Header } from "../header";
import { getGithubUrl } from "@/lib/utils";
import { LeftSidebar } from "../left-sidebar";

export function KickoffWikiGeneration({
  owner,
  repo,
  children,
}: {
  owner: string;
  repo: string;
  children: React.ReactNode;
}) {
  const { data, isLoading } = useQuery<GetWikiResponseDto>({
    queryKey: [`wiki/${owner}/${repo}/pages`],
  });

  if (isLoading) return <div>Loading...</div>;

  if (!data?.exists) return <WikiEmptyState owner={owner} repo={repo} />;

  // Render the skeleton + left sidenav
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
