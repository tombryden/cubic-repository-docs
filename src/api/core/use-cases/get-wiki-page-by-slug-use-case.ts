import { inject, injectable } from "tsyringe";
import { type WikiPageRepositoryPort } from "../ports/outbound/wiki-page-repository-port";
import { type WikiRepositoryPort } from "../ports/outbound/wiki-repository-port";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiPage } from "../entities/wiki-page";
import { Wiki } from "../entities/wiki";

export interface GetWikiPageBySlugResult {
  wiki: Wiki;
  page: WikiPage;
}

/**
 * Use case to get the markdown content of a wiki page by repository and page slug
 */
@injectable()
export class GetWikiPageBySlugUseCase {
  constructor(
    @inject(DI.WIKI_PAGE_REPOSITORY)
    private readonly wikiPageRepository: WikiPageRepositoryPort,
    @inject(DI.WIKI_REPOSITORY)
    private readonly wikiRepository: WikiRepositoryPort
  ) {}

  async execute(
    owner: string,
    repo: string,
    pageSlug: string
  ): Promise<GetWikiPageBySlugResult | null> {
    const [wiki, page] = await Promise.all([
      this.wikiRepository.findOneByRepository(owner, repo),
      this.wikiPageRepository.findOneByRepository(owner, repo, pageSlug),
    ]);

    if (!wiki || !page) {
      return null;
    }

    return { wiki, page };
  }
}
