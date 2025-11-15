"use client";

import { useQuery } from "@tanstack/react-query";
import type { GetWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/pages/route";
import { WikiEmptyState } from "./wiki-empty-state";

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

  return children;
}
