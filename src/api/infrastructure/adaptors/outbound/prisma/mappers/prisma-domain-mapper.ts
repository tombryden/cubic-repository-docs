import { Wiki, WikiStatus } from "@/api/core/entities/wiki";
import { WikiPage } from "@/api/core/entities/wiki-page";
import {
  WikiPage as PrismaWikiPage,
  Wiki as PrismaWiki,
  WikiStatus as PrismaWikiStatus,
} from "@prisma/client";

export class PrismaDomainMapper {
  static wiki = {
    toDomain: (prismaWiki: PrismaWiki): Wiki => {
      return new Wiki({
        id: prismaWiki.id,
        repository: prismaWiki.repository,
        status: prismaWiki.status as WikiStatus,
      });
    },

    fromDomain: (wiki: Wiki): PrismaWiki => {
      return {
        id: wiki.id,
        repository: wiki.repository,
        status: wiki.status as PrismaWikiStatus,
      };
    },
  };

  static wikiPage = {
    toDomain: (prismaWikiPage: PrismaWikiPage): WikiPage => {
      return new WikiPage({
        id: prismaWikiPage.id,
        wikiId: prismaWikiPage.wikiId,
        title: prismaWikiPage.title,
        slug: prismaWikiPage.slug,
        markdownContent: prismaWikiPage.markdownContent,
        order: prismaWikiPage.order,
      });
    },

    fromDomain: (wikiPage: WikiPage): PrismaWikiPage => {
      return {
        id: wikiPage.id,
        wikiId: wikiPage.wikiId,
        title: wikiPage.title,
        slug: wikiPage.slug,
        markdownContent: wikiPage.markdownContent,
        order: wikiPage.order,
      };
    },
  };
}
