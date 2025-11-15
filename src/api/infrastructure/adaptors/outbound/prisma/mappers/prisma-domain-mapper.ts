import { WikiPage } from "@/api/core/entities/wiki-page";
import { WikiPage as PrismaWikiPage } from "@prisma/client";

export class PrismaDomainMapper {
  static toDomain(prismaWikiPage: PrismaWikiPage): WikiPage {
    return new WikiPage({
      id: prismaWikiPage.id,
      wikiId: prismaWikiPage.wikiId,
      title: prismaWikiPage.title,
      slug: prismaWikiPage.slug,
      markdownContent: prismaWikiPage.markdownContent,
      order: prismaWikiPage.order,
    });
  }

  static fromDomain(wikiPage: WikiPage): PrismaWikiPage {
    return {
      id: wikiPage.id,
      wikiId: wikiPage.wikiId,
      title: wikiPage.title,
      slug: wikiPage.slug,
      markdownContent: wikiPage.markdownContent,
      order: wikiPage.order,
    };
  }
}
