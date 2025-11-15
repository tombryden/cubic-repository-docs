import { BaseEntity } from "./base-entity";

export class Wiki extends BaseEntity {
  constructor(data: { id?: string; repository: string }) {
    super(data.id);
    this.repository = data.repository;
  }

  /**
   * The repository name expected format: owner/repo
   */
  repository: string;
}
