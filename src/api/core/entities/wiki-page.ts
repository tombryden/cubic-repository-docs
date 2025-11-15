import { BaseEntity } from "./base-entity";

export class WikiPage extends BaseEntity {
  constructor(data: Omit<WikiPage, "id"> & { id?: string }) {
    super(data.id);
    this.wikiId = data.wikiId;
    this.title = data.title;
    this.slug = data.slug;
    this.order = data.order;
    this.markdownContent = data.markdownContent;
  }

  wikiId: string;
  title: string;
  slug: string;
  markdownContent: string;
  order: number;
}
