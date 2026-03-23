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
 * Get cached data if exists AND matches today's date
 * This ensures we don't use stale cache from previous days
 */
export function getCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const { data, timestamp, date } = JSON.parse(cached);
      const today = getTodayDateString();
      
      // Verify cache is from TODAY (not just within 24 hours)
      if (date === today) {
        const now = Date.now();
        if (now - timestamp < 24 * 60 * 60 * 1000) {
          console.log("Using cached data from:", new Date(timestamp).toLocaleString());
          return data as T;
        }
      } else {
        console.log("Cache is from different day (", date, "), will refetch");
      }
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Set cache with timestamp AND date
 */
export function setCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      date: getTodayDateString()
    }));
    console.log("Data cached successfully");
  } catch (e) {
    console.error("Cache error:", e);
    // Ignore quota errors
  }
}

/**
 * Get yesterday anime - ONLY returns if saved TODAY (meaning it was yesterday's selection)
 * Returns null if the saved date doesn't match yesterday's date
 */
export function getYesterdayAnime(): Anime | null {
  try {
    const stored = localStorage.getItem(YESTERDAY_ANIME_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const savedDate = parsed.date;
      
      // Calculate yesterday's date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      // Only return if saved on yesterday's date
      if (savedDate === yesterdayStr) {
        return parsed.anime as Anime;
      }
      
      // If dates don't match, clear stale data
      console.log("Yesterday anime is stale (saved:", savedDate, ", expected:", yesterdayStr, ")");
      localStorage.removeItem(YESTERDAY_ANIME_KEY);
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Set yesterday anime with current date
 */
export function setYesterdayAnime(anime: Anime): void {
  try {
    localStorage.setItem(YESTERDAY_ANIME_KEY, JSON.stringify({
      anime,
      date: getTodayDateString()
    }));
  } catch (e) {
    console.error("Error saving yesterday anime:", e);
  }
}
