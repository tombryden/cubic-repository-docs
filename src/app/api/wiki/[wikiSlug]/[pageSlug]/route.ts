import "@/api/infrastructure/di";

import { GetWikiPageBySlugUseCase } from "@/api/core/use-cases/get-wiki-page-by-slug-use-case";
import { NextResponse } from "next/server";
import { container } from "tsyringe";

export interface GetWikiPageResponseDto {
  content: string;
}

export interface GetWikiPageErrorResponseDto {
  error: string;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ wikiSlug: string; pageSlug: string }> }
) {
  const { wikiSlug, pageSlug } = await params;

  const getWikiPageBySlugUseCase = container.resolve(GetWikiPageBySlugUseCase);

  const markdown = await getWikiPageBySlugUseCase.execute(wikiSlug, pageSlug);

  if (markdown === null) {
    return NextResponse.json<GetWikiPageErrorResponseDto>(
      { error: "Wiki page not found" },
      { status: 404 }
    );
  }

  return NextResponse.json<GetWikiPageResponseDto>({ content: markdown });
}
