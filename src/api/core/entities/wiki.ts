import { BaseEntity } from "./base-entity";

export enum WikiStatus {
  STARTED = "STARTED",
  GENERATING = "GENERATING",
  GENERATED = "GENERATED",
  FAILED = "FAILED",
}

export class Wiki extends BaseEntity {
  constructor(data: Omit<Wiki, "id"> & { id?: string }) {
    super(data.id);
    this.repository = data.repository.toLowerCase();
    this.status = data.status;
    this.branch = data.branch;
  }

  /**
   * The repository name expected format: owner/repo
   */
  repository: string;

  status: WikiStatus;

  /**
   * The git branch name used for this wiki (may be null if not yet determined)
   */
  branch: string | null;

  /**
   * Get the repository string in the format: owner/repo
   * @param owner The repository owner
   * @param repo The repository name
   * @returns The repository string
   */
  static getRepositoryString(owner: string, repo: string): string {
    return `${owner}/${repo}`.toLowerCase();
  }
}
