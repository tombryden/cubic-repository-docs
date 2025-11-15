export type EntityId = string;

export abstract class BaseEntity {
  protected constructor(id?: EntityId) {
    this.id = id ?? crypto.randomUUID();
  }

  readonly id: EntityId;
}
