import { Wiki } from "../../entities/wiki";

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
   * Insert a wiki into the database
   * @param wiki The wiki to insert
   */
  insert(wiki: Wiki): Promise<Wiki>;
}
