import { useState, useEffect, useCallback } from "react";
import { getTodayDateString, getDailyIndex, getDayOfYear } from "../utils/dateUtils";
import { getCache, setCache, getCacheKey } from "../utils/cache";

export interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url: string;
    };
  };
  score: number | null;
  rank: number | null;
  genres: Array<{ name: string }>;
  themes: Array<{ name: string }>;
  synopsis: string | null;
  episodes: number | null;
  status: string;
  studios: Array<{ name: string }>;
  year: number | null;
  url: string;
}

interface JikanResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

const API_URL = "https://api.jikan.moe/v4/top/anime";
const PAGE_LIMIT = 25;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export function useDailyAnime() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayOfYear] = useState(getDayOfYear());

  const fetchWithRetry = async (page: number, retries = MAX_RETRIES): Promise<JikanResponse> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Fetching anime page ${page} from Jikan API... (attempt ${attempt}/${retries})`);
        
        const response = await fetch(`${API_URL}?page=${page}&limit=${PAGE_LIMIT}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`HTTP ${response.status}:`, errorData);
          
          if (response.status === 429 && attempt < retries) {
            console.log(`Rate limited. Waiting ${RETRY_DELAY * attempt}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
            continue;
          }
          
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid response format");
        }
        
        if (!Array.isArray(data.data)) {
          console.error("data.data is not an array:", data.data);
          throw new Error("Invalid data structure: data.data is not an array");
        }
        
        console.log(`Page ${page}: received ${data.data.length} anime`);
        return data as JikanResponse;
        
      } catch (err) {
        if (attempt === retries) throw err;
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
    throw new Error("Max retries exceeded");
  };

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = getCacheKey();
      const cached = getCache<Anime[]>(cacheKey);

      if (cached && cached.length > 0) {
        console.log("Using cached data, anime count:", cached.length);
        const index = getDailyIndex() % cached.length;
        setAnime(cached[index]);
        setLoading(false);
        return;
      }

      // Fetch 4 pages (25 each = 100 anime) with delays between requests
      const allAnime: Anime[] = [];
      
      for (let page = 1; page <= 4; page++) {
        const data = await fetchWithRetry(page);
        allAnime.push(...data.data);
        
        // Add delay between requests to avoid rate limiting
        if (page < 4) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (allAnime.length === 0) {
        throw new Error("No anime data received from API");
      }
      
      console.log(`Total anime fetched: ${allAnime.length}`);
      
      // Cache the combined response
      setCache(cacheKey, allAnime);
      
      // Select anime based on today's date
      const index = getDailyIndex() % allAnime.length;
      console.log("Daily index:", index, "from date:", getTodayDateString());
      
      setAnime(allAnime[index]);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch anime. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  return { anime, loading, error, retry: fetchAnime, dayOfYear };
}
