import "@/api/infrastructure/di";

import { inngest } from "@/api/infrastructure/adaptors/inbound/inngest/client";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/api/infrastructure/adaptors/inbound/http/dtos/api-response";
import { container } from "tsyringe";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiRepositoryPort } from "@/api/core/ports/outbound/wiki-repository-port";
import { Wiki, WikiStatus } from "@/api/core/entities/wiki";

export interface GenerateWikiResponseDto {
  message: string;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;

    // Validate parameters
    if (!owner || !repo) {
      return createErrorResponse("Owner and repo are required", 400);
    }

    // Set wiki status to STARTED immediately (shows generating UI on frontend)
    const wikiRepository = container.resolve<WikiRepositoryPort>(
      DI.WIKI_REPOSITORY
    );

    // Check if it is currently started or generating, error if it is
    const existingWiki = await wikiRepository.findOneByRepository(owner, repo);
    if (
      existingWiki &&
      (existingWiki.status === WikiStatus.STARTED ||
        existingWiki.status === WikiStatus.GENERATING)
    ) {
      return createErrorResponse("Wiki generation is already in progress", 409);
    }

    // Create or update wiki with 'started' status
    await wikiRepository.upsert(
      new Wiki({
        repository: Wiki.getRepositoryString(owner, repo),
        status: WikiStatus.STARTED,
        branch: null, // Branch will be determined during Inngest processing
      })
    );

    // Send event to Inngest to trigger repository analysis
    // The repositoryAnalyser function will:
    // 1. Update status from STARTED to GENERATING (prevents duplicate runs)
    // 2. Analyze the repository structure
    // 3. Generate all wiki pages
    // 4. Set wiki status to GENERATED when complete
    await inngest.send({
      name: "reposcribe/repository-analysis",
      data: {
        owner,
        repo,
      },
    });

    return createSuccessResponse<GenerateWikiResponseDto>({
      message: "Wiki generation started successfully",
    });
  } catch (error) {
    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "Failed to start wiki generation",
      500
    );
  }
}
