import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeJsonParse<T = any>(data: any, fallback: T | null = null): T | null {
  if (data === null || data === undefined || data === "") return fallback;
  if (typeof data === "object") return data as T;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
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

