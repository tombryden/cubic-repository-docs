import { WikiPage } from "../../entities/wiki-page";

export interface WikiPageRepositoryPort {
  /**
   * Find a wiki page by repository owner, name, and page slug
   * @param owner The repository owner
   * @param repo The repository name
   * @param pageSlug The slug of the wiki page
   */
  findOneByRepository(
    owner: string,
    repo: string,
    pageSlug: string
  ): Promise<WikiPage | null>;

  /**
   * Find all pages by repository owner and name
   * @param owner The repository owner
   * @param repo The repository name
   */
  findByRepository(owner: string, repo: string): Promise<WikiPage[]>;
}
