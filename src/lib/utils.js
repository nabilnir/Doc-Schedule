import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  // Next.js relative images must start with /
  if (url.startsWith("/")) return true;
  // Absolute URLs
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
