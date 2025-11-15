import { WikiPage } from "../../entities/wiki-page";

export interface WikiPageRepositoryPort {
  /**
   * Find a wiki page by its wiki slug and page slug
   * @param wikiSlug The slug of the wiki
   * @param pageSlug The slug of the wiki page
   */
  findOneByWikiSlugAndPageSlug(
    wikiSlug: string,
    pageSlug: string
  ): Promise<WikiPage | null>;

  /**
   * Find all pages by a wiki slug
   * @param wikiSlug The slug of the wiki
   */
  findByWikiSlug(wikiSlug: string): Promise<WikiPage[]>;
}
