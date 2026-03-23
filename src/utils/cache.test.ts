import { describe, it, expect, beforeEach } from 'vitest';
import { getCache, setCache, getCacheKey } from './cache';
import { getTodayDateString } from './dateUtils';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('cache', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getCacheKey', () => {
    it('returns a key with the anime_cache_ prefix', () => {
      const key = getCacheKey();
      expect(key.startsWith('anime_cache_')).toBe(true);
    });

    it('returns a key containing today date', () => {
      const key = getCacheKey();
      const today = getTodayDateString();
      expect(key).toContain(today);
    });
  });

  describe('getCache', () => {
    it('returns null for non-existent key', () => {
      const result = getCache('non_existent_key');
      expect(result).toBeNull();
    });

    it('returns null for empty string key', () => {
      const result = getCache('');
      expect(result).toBeNull();
    });
  });

  describe('setCache and getCache roundtrip', () => {
    it('stores and retrieves data correctly', () => {
      const key = 'test_key';
      const data = { name: 'Cowboy Bebop', score: 8.75 };
      
      setCache(key, data);
      const retrieved = getCache<typeof data>(key);
      
      expect(retrieved).toEqual(data);
    });

    it('handles array data', () => {
      const key = 'anime_list';
      const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
      
      setCache(key, data);
      const retrieved = getCache<typeof data>(key);
      
      expect(retrieved).toEqual(data);
    });

    it('overwrites existing cache with same key', () => {
      const key = 'test_key';
      setCache(key, { value: 'first' });
      setCache(key, { value: 'second' });
      
      const retrieved = getCache<{ value: string }>(key);
      expect(retrieved?.value).toBe('second');
    });
  });

  describe('cache expiration', () => {
    it('returns null when cache is older than 24 hours', () => {
      const key = 'expired_cache';
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
      const today = getTodayDateString();
      
      localStorage.setItem(key, JSON.stringify({
        data: { name: 'Test' },
        timestamp: oldTimestamp,
        date: today
      }));
      
      const result = getCache<{ name: string }>(key);
      expect(result).toBeNull();
    });

    it('returns data when cache is within 24 hours and from today', () => {
      const key = 'valid_cache';
      const recentTimestamp = Date.now() - (12 * 60 * 60 * 1000);
      const data = { name: 'Fresh Data' };
      const today = getTodayDateString();
      
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: recentTimestamp,
        date: today
      }));
      
      const result = getCache<typeof data>(key);
      expect(result).toEqual(data);
    });

    it('returns null when cache is from different day', () => {
      const key = 'different_day_cache';
      const recentTimestamp = Date.now();
      const data = { name: 'Yesterday Data' };
      
      // Set a different date (yesterday)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: recentTimestamp,
        date: yesterdayStr
      }));
      
      const result = getCache<typeof data>(key);
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('returns null when localStorage throws on get', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: {
          getItem: () => { throw new Error('Storage error'); },
          setItem: () => {},
        },
        configurable: true,
      });
      
      const result = getCache('any_key');
      expect(result).toBeNull();
      
      Object.defineProperty(globalThis, 'localStorage', { 
        value: localStorageMock,
        configurable: true 
      });
    });
  });
});
