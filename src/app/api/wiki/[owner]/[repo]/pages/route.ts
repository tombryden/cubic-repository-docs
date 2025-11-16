import "@/api/infrastructure/di";

import { container } from "tsyringe";
import { GetWikiPagesUseCase } from "@/api/core/use-cases/get-wiki-pages-use-case";
import {
  createSuccessResponse,
  createErrorResponse,
} from "@/api/infrastructure/adaptors/inbound/http/dtos/api-response";
import { Wiki } from "@/api/core/entities/wiki";

export interface GetWikiResponseDto {
  wiki?: Wiki;
  pages: {
    title: string;
    slug: string;
  }[];
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;

    const useCase = container.resolve(GetWikiPagesUseCase);
    const res = await useCase.execute(owner, repo);

    return createSuccessResponse<GetWikiResponseDto>({
      pages: res.pages.map((pg) => ({ title: pg.title, slug: pg.slug })),
      wiki: res.wiki,
    });
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : "Failed to fetch wiki pages",
      500
    );
  }
}
