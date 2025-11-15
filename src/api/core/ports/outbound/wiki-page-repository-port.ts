export interface WikiPageRepositoryPort {
  /**
   * Find a wiki page by its wiki ID and slug
   * @param wikiSlug The slug of the wiki
   * @param pageSlug The slug of the wiki page
   */
  findMarkdownByWikiSlugAndSlug(
    wikiSlug: string,
    pageSlug: string
  ): Promise<string | null>;
}
