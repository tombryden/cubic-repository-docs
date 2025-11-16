import slugify from "slugify";

export function getSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}
