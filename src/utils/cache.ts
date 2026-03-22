import { getTodayDateString } from './dateUtils';
import type { Anime } from '../hooks/useDailyAnime';

const CACHE_PREFIX = "anime_cache_";
const YESTERDAY_ANIME_KEY = "yesterday_anime";

/**
 * Get cache key for today's date (local timezone)
 */
export function getCacheKey(): string {
  const today = getTodayDateString();
  return `${CACHE_PREFIX}${today}`;
}

/**
 * Get cached data if exists
 */
export function getCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      // Cache valid for 24 hours
      if (now - timestamp < 24 * 60 * 60 * 1000) {
        console.log("Using cached data from:", new Date(timestamp).toLocaleString());
        return data as T;
      } else {
        console.log("Cache expired, will refetch");
      }
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Set cache with timestamp
 */
export function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    console.log("Data cached successfully");
  } catch (e) {
    console.error("Cache error:", e);
    // Ignore quota errors
  }
}

export function getYesterdayAnime(): Anime | null {
  try {
    const stored = localStorage.getItem(YESTERDAY_ANIME_KEY);
    if (stored) {
      return JSON.parse(stored) as Anime;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

export function setYesterdayAnime(anime: Anime): void {
  try {
    localStorage.setItem(YESTERDAY_ANIME_KEY, JSON.stringify(anime));
  } catch (e) {
    console.error("Error saving yesterday anime:", e);
  }
}
