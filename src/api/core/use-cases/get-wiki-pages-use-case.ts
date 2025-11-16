import { inject, injectable } from "tsyringe";
import { type WikiPageRepositoryPort } from "../ports/outbound/wiki-page-repository-port";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiPage } from "../entities/wiki-page";
import { type WikiRepositoryPort } from "../ports/outbound/wiki-repository-port";
import { Wiki } from "../entities/wiki";

interface GetWikiPagesResponse {
  wiki?: Wiki;
  pages: WikiPage[];
}

/**
 * Get all pages in a wiki
 */
@injectable()
export class GetWikiPagesUseCase {
  constructor(
    @inject(DI.WIKI_PAGE_REPOSITORY)
    private readonly wikiPageRepository: WikiPageRepositoryPort,
    @inject(DI.WIKI_REPOSITORY)
    private readonly wikiRepository: WikiRepositoryPort
  ) {}

  async execute(owner: string, repo: string): Promise<GetWikiPagesResponse> {
    const wiki = await this.wikiRepository.findOneByRepository(owner, repo);

    if (!wiki) {
      return {
        pages: [],
      };
    }

    const pages = await this.wikiPageRepository.findByRepository(owner, repo);

    return {
      pages,
      wiki,
    };
  }
}
