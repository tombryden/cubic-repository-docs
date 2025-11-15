import { inject, injectable } from "tsyringe";
import { EntityId } from "../entities/base-entity";
import { type WikiPageRepositoryPort } from "../ports/outbound/wiki-page-repository-port";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiPage } from "../entities/wiki-page";

/**
 * Use case to get the markdown content of a wiki page by its wiki ID and slug
 */
@injectable()
export class GetWikiPageBySlugUseCase {
  constructor(
    @inject(DI.WIKI_PAGE_REPOSITORY)
    private readonly wikiPageRepository: WikiPageRepositoryPort
  ) {}

  async execute(wikiId: EntityId, pageSlug: string): Promise<WikiPage | null> {
    return this.wikiPageRepository.findOneByWikiSlugAndPageSlug(
      wikiId,
      pageSlug
    );
  }
}
