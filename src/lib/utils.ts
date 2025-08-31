export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// Utility to generate page URLs for navigation
// Accepts a base path and optional query string
export function createPageUrl(path: string): string {
  if (typeof path !== "string") return "/";
  // If path already contains a '?', do not add another
  if (path.includes("?")) {
    return `/${path}`;
  }
  return `/${path}`;
}