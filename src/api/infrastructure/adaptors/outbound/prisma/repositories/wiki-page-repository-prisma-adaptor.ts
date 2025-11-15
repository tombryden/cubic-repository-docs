import { WikiPageRepositoryPort } from "@/api/core/ports/outbound/wiki-page-repository-port";
import { PrismaClient } from "@prisma/client";

export class WikiPageRepositoryPrismaAdaptor implements WikiPageRepositoryPort {
  private readonly prisma = new PrismaClient();

  async findMarkdownByWikiSlugAndSlug(
    wikiSlug: string,
    pageSlug: string
  ): Promise<string | null> {
    const page = await this.prisma.wikiPage.findFirst({
      where: { wiki: { repository: wikiSlug }, slug: pageSlug },
      select: {
        markdownContent: true,
      },
    });

    return page?.markdownContent ?? null;
  }
}
