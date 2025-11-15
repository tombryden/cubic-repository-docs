import { Wiki } from "../../entities/wiki";

export interface WikiRepositoryPort {
  /**
   * Check if a wiki exists by its slug (repository name)
   * @param slug The repository name in format: owner/repo
   */
  existsBySlug(slug: string): Promise<boolean>;
}
