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
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    const wikiSlug = `${owner}/${repo}`;
    
    // Get the page slug from the query string (defaulting to 'home')
    const url = new URL(_req.url);
    const pageSlug = url.searchParams.get('page') || 'home';

    const getWikiPageBySlugUseCase = container.resolve(GetWikiPageBySlugUseCase);
    const res = await getWikiPageBySlugUseCase.execute(wikiSlug, pageSlug);

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
