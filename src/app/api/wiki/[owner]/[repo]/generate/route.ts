import "@/api/infrastructure/di";

import { inngest } from "@/api/infrastructure/adaptors/inbound/inngest/client";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/api/infrastructure/adaptors/inbound/http/dtos/api-response";

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

    // Send event to Inngest to trigger repository analysis
    // The repositoryAnalyser function will handle:
    // 1. Setting wiki status to GENERATING
    // 2. Analyzing the repository
    // 3. Generating all wiki pages
    // 4. Setting wiki status to GENERATED when complete
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
