import { inject, injectable } from "tsyringe";
import { type WikiPageRepositoryPort } from "../ports/outbound/wiki-page-repository-port";
import { DI } from "@/api/infrastructure/di-tokens";
import { WikiPage } from "../entities/wiki-page";
import { type WikiRepositoryPort } from "../ports/outbound/wiki-repository-port";

interface GetWikiPagesResponse {
  pages: WikiPage[];
  exists: boolean;
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
    const wikiExists = await this.wikiRepository.existsByRepository(
      owner,
      repo
    );

    if (!wikiExists) {
      return {
        pages: [],
        exists: false,
      };
    }

    const pages = await this.wikiPageRepository.findByRepository(owner, repo);

    return {
      pages,
      exists: true,
    };
  }
}
