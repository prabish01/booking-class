import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      // Replace spaces with hyphens
      .replace(/\s+/g, "-")
      // Remove special characters except hyphens
      .replace(/[^a-z0-9-]/g, "")
      // Remove multiple consecutive hyphens
      .replace(/-+/g, "-")
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, "")
  );
}

/**
 * Check if a string looks like a slug (URL-friendly format)
 * A slug should have at least one hyphen to distinguish from documentIds
 */
export function isSlug(str: string): boolean {
  return /^[a-z0-9]+-[a-z0-9-]+$/.test(str);
}
