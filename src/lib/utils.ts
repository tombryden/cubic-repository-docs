import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the GitHub URL for a given owner and repository.
 */
export function getGithubUrl(
  owner: string,
  repo: string,
  withRepository: boolean = true
) {
  if (withRepository) {
    return `https://github.com/${owner}/${repo}`;
  }
  return `https://github.com/${owner}`;
}

export function getSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}
