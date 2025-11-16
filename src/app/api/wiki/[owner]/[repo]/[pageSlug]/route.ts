import "@/api/infrastructure/di";

import { GetWikiPageBySlugUseCase } from "@/api/core/use-cases/get-wiki-page-by-slug-use-case";
import { container } from "tsyringe";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/api/infrastructure/adaptors/inbound/http/dtos/api-response";

export interface GetWikiPageResponseDto {
  content: string;
  title: string;
  slug: string;
}

export async function GET(
  _req: Request,
  {
    params,
  }: { params: Promise<{ owner: string; repo: string; pageSlug: string }> }
) {
  try {
    const { owner, repo, pageSlug } = await params;

    const getWikiPageBySlugUseCase = container.resolve(
      GetWikiPageBySlugUseCase
    );
    const res = await getWikiPageBySlugUseCase.execute(owner, repo, pageSlug);

    if (res === null) {
      return createErrorResponse("Wiki page not found", 404);
    }

    return createSuccessResponse<GetWikiPageResponseDto>({
      content: res.markdownContent,
      title: res.title,
      slug: res.slug,
    });
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch wiki page",
      500
    );
  }
}
