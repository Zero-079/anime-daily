import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDailyAnime } from './useDailyAnime';
import * as cacheModule from '../utils/cache';
import * as dateModule from '../utils/dateUtils';

vi.setConfig({ testTimeout: 60000 });

const mockAnime = {
  mal_id: 1,
  title: "Cowboy Bebop",
  title_english: "Cowboy Bebop",
  title_japanese: "カウボーイビバップ",
  images: {
    jpg: {
      image_url: "https://example.com/image.jpg",
      large_image_url: "https://example.com/large.jpg"
    }
  },
  score: 8.75,
  rank: 35,
  genres: [{ name: "Action" }, { name: "Sci-Fi" }],
  themes: [{ name: "Space" }],
  synopsis: "A great anime about space cowboys...",
  episodes: 26,
  status: "Finished Airing",
  studios: [{ name: "Sunrise" }],
  year: 1998,
  url: "https://myanimelist.net/anime/1/Cowboy_Bebop"
};

const createMockResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data)
});

const createMockApiResponse = (page: number) => ({
  data: [mockAnime, { ...mockAnime, mal_id: page * 2, title: `Anime Page ${page}` }],
  pagination: {
    last_visible_page: 1,
    has_next_page: false,
    current_page: page
  }
});

describe('useDailyAnime', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  let getCacheSpy: ReturnType<typeof vi.spyOn>;
  let setCacheSpy: ReturnType<typeof vi.spyOn>;
  let getYesterdayAnimeSpy: ReturnType<typeof vi.spyOn>;
  let setYesterdayAnimeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.restoreAllMocks();
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockReset();
    getCacheSpy = vi.spyOn(cacheModule, 'getCache').mockReset();
    setCacheSpy = vi.spyOn(cacheModule, 'setCache').mockReset();
    getYesterdayAnimeSpy = vi.spyOn(cacheModule, 'getYesterdayAnime').mockReset().mockReturnValue(null);
    setYesterdayAnimeSpy = vi.spyOn(cacheModule, 'setYesterdayAnime').mockReset();
    vi.spyOn(dateModule, 'getDailyIndex').mockReset().mockReturnValue(0);
    vi.spyOn(cacheModule, 'getCacheKey').mockReset().mockReturnValue('anime_cache_2024-01-01');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('returns loading true initially', async () => {
      let resolveFetch: (value: Response) => void;
      fetchSpy.mockImplementation(() => new Promise(resolve => { resolveFetch = resolve; }));
      
      const { result } = renderHook(() => useDailyAnime());
      
      expect(result.current.loading).toBe(true);
      expect(result.current.anime).toBeNull();
      expect(result.current.error).toBeNull();
      
      resolveFetch!({ ok: true, json: () => Promise.resolve({ data: [mockAnime], pagination: {} }) } as Response);
    });

    it('has retry function', async () => {
      let resolveFetch: (value: Response) => void;
      fetchSpy.mockImplementation(() => new Promise(resolve => { resolveFetch = resolve; }));
      
      const { result } = renderHook(() => useDailyAnime());
      
      expect(result.current.retry).toBeDefined();
      expect(typeof result.current.retry).toBe('function');
      
      resolveFetch!({ ok: true, json: () => Promise.resolve({ data: [mockAnime], pagination: {} }) } as Response);
    });
  });

  describe('returns anime data on success', () => {
    it('returns anime after successful fetch', async () => {
      fetchSpy.mockImplementation((url: string) => {
        const page = parseInt(url.toString().match(/page=(\d+)/)?.[1] || '1');
        return Promise.resolve(createMockResponse(createMockApiResponse(page)) as Response);
      });

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 30000 });

      expect(result.current.anime).toEqual(mockAnime);
    });

    it('sets loading to false after success', async () => {
      fetchSpy.mockImplementation((url: string) => {
        const page = parseInt(url.toString().match(/page=(\d+)/)?.[1] || '1');
        return Promise.resolve(createMockResponse(createMockApiResponse(page)) as Response);
      });

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 30000 });

      expect(result.current.loading).toBe(false);
    });
  });

  describe('returns error on failure', () => {
    it('sets error on network failure', async () => {
      fetchSpy.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      }, { timeout: 30000 });

      expect(result.current.error).toBe('Network error');
    });

    it('sets error on HTTP error', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Server error' })
      } as Response);

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      }, { timeout: 30000 });

      expect(result.current.error).toBe('Server error');
    });

    it('sets loading to false after error', async () => {
      fetchSpy.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 30000 });
    });
  });

  describe('uses cache when available', () => {
    it('returns cached data without fetching', async () => {
      getCacheSpy.mockReturnValue([mockAnime]);

      const { result } = renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      }, { timeout: 10000 });

      expect(result.current.anime).toEqual(mockAnime);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('does not call API when cache exists', async () => {
      getCacheSpy.mockReturnValue([mockAnime]);

      renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(fetchSpy).not.toHaveBeenCalled();
      }, { timeout: 10000 });
    });
  });

  describe('caching behavior', () => {
    it('caches fetched data after API call', async () => {
      fetchSpy.mockImplementation((url: string) => {
        const page = parseInt(url.toString().match(/page=(\d+)/)?.[1] || '1');
        return Promise.resolve(createMockResponse(createMockApiResponse(page)) as Response);
      });

      renderHook(() => useDailyAnime());

      await waitFor(() => {
        expect(setCacheSpy).toHaveBeenCalled();
      }, { timeout: 30000 });
    });
  });
});
