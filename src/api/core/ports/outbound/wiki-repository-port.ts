import { Wiki, WikiStatus } from "../../entities/wiki";

export interface WikiRepositoryPort {
  /**
   * Check if a wiki exists by repository owner and name
   * @param owner The repository owner
   * @param repo The repository name
   */
  existsByRepository(owner: string, repo: string): Promise<boolean>;

  /**
   * Find a wiki by repository owner and name
   * @param owner The repository owner
   * @param repo The repository name
   * @returns The wiki if found, null otherwise
   */
  findOneByRepository(owner: string, repo: string): Promise<Wiki | null>;

  /**
   * Upsert a wiki (insert or update if exists)
   * @param wiki The wiki to upsert
   */
  upsert(wiki: Wiki): Promise<Wiki>;

  /**
   * Update the status of a wiki
   * @param wikiId The wiki ID
   * @param status The new status
   */
  updateStatus(wikiId: string, status: WikiStatus): Promise<Wiki>;
}
