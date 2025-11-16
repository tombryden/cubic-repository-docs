import { WikiPage } from "@/api/core/entities/wiki-page";
import { WikiPageRepositoryPort } from "@/api/core/ports/outbound/wiki-page-repository-port";
import { PrismaClient } from "@prisma/client";
import { PrismaDomainMapper } from "../mappers/prisma-domain-mapper";
import { Wiki } from "@/api/core/entities/wiki";

export class WikiPageRepositoryPrismaAdaptor implements WikiPageRepositoryPort {
  private readonly prisma = new PrismaClient();

  async findOneByRepository(
    owner: string,
    repo: string,
    pageSlug: string
  ): Promise<WikiPage | null> {
    const repository = Wiki.getRepositoryString(owner, repo);

    const page = await this.prisma.wikiPage.findFirst({
      where: { wiki: { repository }, slug: pageSlug },
    });

    if (!page) return null;

    return PrismaDomainMapper.wikiPage.toDomain(page);
  }

  async findByRepository(owner: string, repo: string): Promise<WikiPage[]> {
    const repository = Wiki.getRepositoryString(owner, repo);

    const pages = await this.prisma.wikiPage.findMany({
      where: { wiki: { repository } },
    });

    return pages.map(PrismaDomainMapper.wikiPage.toDomain);
  }
}
