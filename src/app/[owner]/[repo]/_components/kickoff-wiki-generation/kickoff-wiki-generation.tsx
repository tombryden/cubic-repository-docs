"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import type { GetWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/pages/route";
import type { GenerateWikiResponseDto } from "@/app/api/wiki/[owner]/[repo]/generate/route";
import type { ApiResponse } from "@/api/infrastructure/adaptors/inbound/http/dtos/api-response";
import { WikiEmptyState } from "./wiki-empty-state";
import { WikiGeneratingState } from "./wiki-generating-state";
import { WikiErrorState } from "./wiki-error-state";
import { Header } from "../header";
import { getGithubUrl } from "@/lib/utils";
import { LeftSidebar } from "../left-sidebar";
import { WikiStatus } from "@/api/core/entities/wiki";
import { Spinner } from "@/components/ui/spinner";

export function KickoffWikiGeneration({
  owner,
  repo,
  children,
}: {
  owner: string;
  repo: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useQuery<GetWikiResponseDto>({
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

  const generateWikiMutation = useMutation<
    GenerateWikiResponseDto,
    Error,
    void
  >({
    mutationFn: async () => {
      const response = await fetch(`/api/wiki/${owner}/${repo}/generate`, {
        method: "POST",
      });

      const data =
        (await response.json()) as ApiResponse<GenerateWikiResponseDto>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.success === false
            ? data.error
            : "Failed to start wiki generation"
        );
      }

      return data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the wiki pages query to show the generating state
      queryClient.invalidateQueries({
        queryKey: [`wiki/${owner}/${repo}/pages`],
      });
    },
  });

  // Redirect to the first page if wiki is generated and we're on the root page
  useEffect(() => {
    if (
      data?.wiki?.status === WikiStatus.GENERATED &&
      data.pages.length > 0 &&
      pathname === `/${owner}/${repo}`
    ) {
      router.replace(`/${owner}/${repo}/${data.pages[0].slug}`);
    }
  }, [data, owner, repo, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!data?.wiki) {
    return (
      <WikiEmptyState
        owner={owner}
        repo={repo}
        generateMutation={generateWikiMutation}
      />
    );
  }

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
      <WikiErrorState
        owner={owner}
        repo={repo}
        onRetry={() => generateWikiMutation.mutate()}
        isRetrying={generateWikiMutation.isPending}
      />
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
