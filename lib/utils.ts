import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const CLOUDFLARE_IMAGE_DOMAIN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DOMAIN || "https://images.shopmarkline.in";

/**
 * Automatically swaps raw GitHub URLs and GitHub Pages URLs to the Cloudflare Image CDN domain.
 * Example:
 *   "https://raw.githubusercontent.com/Ayandev1/image/main/images/heels/sample.png"
 *   -> "https://images.shopmarkline.in/images/heels/sample.png"
 */
export function getCloudflareImageUrl(dbUrl?: string | null): string {
  if (!dbUrl || typeof dbUrl !== "string") return "";

  const trimmed = dbUrl.trim();
  const cdnBase = CLOUDFLARE_IMAGE_DOMAIN.replace(/\/+$/, "");

  // Automatically swap raw GitHub URLs and GitHub Pages URLs to your Cloudflare domain
  let swapped = trimmed
    .replace(/^https?:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/(?:main|master)\/?/i, `${cdnBase}/`)
    .replace(/^https?:\/\/[^/]+\.github\.io\/[^/]+\/?/i, `${cdnBase}/`);

  // Clean up any double slashes in path (e.g. "https://domain//images/..." -> "https://domain/images/...")
  swapped = swapped.replace(/(https?:\/\/)|(\/)+/g, (match, protocol) => (protocol ? protocol : "/"));

  return swapped;
}

/**
 * Normalizes image objects or arrays so that image_url fields point to the Cloudflare CDN.
 */
export function normalizeImageFields<T = any>(val: T): T {
  if (!val) return val;
  if (Array.isArray(val)) {
    return val.map((item) => normalizeImageFields(item)) as unknown as T;
  }
  if (typeof val === "object") {
    const obj: any = { ...val };
    if (typeof obj.image_url === "string") {
      obj.image_url = getCloudflareImageUrl(obj.image_url);
    }
    if (
      typeof obj.url === "string" &&
      obj.url.startsWith("http") &&
      (obj.url.includes("raw.githubusercontent.com") ||
        obj.url.includes("github.io") ||
        obj.url.includes("images.shopmarkline.in"))
    ) {
      obj.url = getCloudflareImageUrl(obj.url);
    }
    return obj as T;
  }
  return val;
}

export function safeJsonParse<T = any>(data: any, fallback: T | null = null): T | null {
  if (data === null || data === undefined || data === "") return fallback;
  if (typeof data === "object") return normalizeImageFields(data) as T;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (parsed !== null && parsed !== undefined) {
        return normalizeImageFields(parsed) as T;
      }
      return fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function safeJsonParseArray<T = any>(dataArray: any, fallback: T[] = []): T[] {
  if (!dataArray) return fallback;
  if (!Array.isArray(dataArray)) {
    const single = safeJsonParse<T>(dataArray);
    return single ? [single] : fallback;
  }
  return dataArray
    .map((item) => safeJsonParse<T>(item))
    .filter((item): item is T => item !== null && item !== undefined);
}


