import { WikiPage } from "@/api/core/entities/wiki-page";
import { WikiPageRepositoryPort } from "@/api/core/ports/outbound/wiki-page-repository-port";
import { PrismaClient } from "@prisma/client";
import { PrismaDomainMapper } from "../mappers/prisma-domain-mapper";

export class WikiPageRepositoryPrismaAdaptor implements WikiPageRepositoryPort {
  private readonly prisma = new PrismaClient();

  async findOneByWikiSlugAndPageSlug(
    wikiSlug: string,
    pageSlug: string
  ): Promise<WikiPage | null> {
    const page = await this.prisma.wikiPage.findFirst({
      where: { wiki: { repository: wikiSlug }, slug: pageSlug },
    });

    if (!page) return null;

    return PrismaDomainMapper.toDomain(page);
  }

  async findByWikiSlug(wikiSlug: string): Promise<WikiPage[]> {
    const pages = await this.prisma.wikiPage.findMany({
      where: { wiki: { repository: wikiSlug } },
    });

    return pages.map(PrismaDomainMapper.toDomain);
  }
}
