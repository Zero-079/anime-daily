import { useState, useEffect } from "react";
import type { Anime } from "../hooks/useDailyAnime";
import GenreBadge from "./GenreBadge";

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);
  const [highResLoaded, setHighResLoaded] = useState(false);
  
  const displayTitle = anime.title_english || anime.title;
  const japaneseTitle = anime.title_japanese;
  const score = anime.score ? anime.score.toFixed(2) : "N/A";
  const studio = anime.studios?.[0]?.name || "Unknown";
  const year = anime.year || "Unknown";
  const synopsis = anime.synopsis || "No synopsis available.";
  const shouldTruncate = synopsis.length > 280;
  const displaySynopsis = shouldTruncate && !showFullSynopsis 
    ? synopsis.slice(0, 280) + "..." 
    : synopsis;
  
  const allGenres = [...anime.genres, ...anime.themes].map(g => g.name);

  const lowResSrc = anime.images.jpg.image_url;
  const highResSrc = anime.images.jpg.large_image_url || anime.images.jpg.image_url;

  return (
    <article className="anime-card">
      <div className="anime-image-container">
        <div className={`anime-image-wrapper ${highResLoaded ? 'loaded' : ''}`}>
          {/* Always show low-res first for immediate display */}
          <img 
            src={lowResSrc} 
            alt={displayTitle}
            className="anime-image low-res"
          />
          {/* High-res loads on top */}
          <img 
            src={highResSrc} 
            alt={displayTitle}
            className={`anime-image high-res ${highResLoaded ? 'loaded' : ''}`}
            onLoad={() => setHighResLoaded(true)}
          />
          <div className="anime-glow"></div>
        </div>
      </div>
      
      <div className="anime-content">
        <header className="anime-header">
          <div className="anime-titles">
            <h2 className="anime-title">{displayTitle}</h2>
            {japaneseTitle && (
              <p className="anime-title-jp">{japaneseTitle}</p>
            )}
          </div>
          
          <div className="anime-score-container">
            <span className="score-label">Score</span>
            <span className="anime-score">{score}</span>
            {anime.rank && (
              <span className="anime-rank">#{anime.rank}</span>
            )}
          </div>
        </header>
        
        <div className="anime-meta">
          <div className="meta-item">
            <span className="meta-label">Episodes</span>
            <span className="meta-value">{anime.episodes || "?"}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Status</span>
            <span className="meta-value">{anime.status}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Studio</span>
            <span className="meta-value">{studio}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Year</span>
            <span className="meta-value">{year}</span>
          </div>
        </div>
        
        {allGenres.length > 0 && (
          <div className="anime-genres">
            {allGenres.slice(0, 6).map((genre, idx) => (
              <GenreBadge key={genre} name={genre} index={idx} />
            ))}
          </div>
        )}
        
        <div className="anime-synopsis">
          <h3>Synopsis</h3>
          <p>{displaySynopsis}</p>
          {shouldTruncate && (
            <button 
              className="read-more-btn"
              onClick={() => setShowFullSynopsis(!showFullSynopsis)}
            >
              {showFullSynopsis ? "Show less" : "Read more"}
            </button>
          )}
        </div>
        
        <div className="links-container">
          <a 
            href={anime.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mal-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            View on MyAnimeList
          </a>
          
          <a 
            href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(displayTitle)}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="mal-link crunchyroll-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.79 7.13A5.13 5.13 0 0 1 21 10.67c0 .27-.02.53-.06.79H21V6.13A5.13 5.13 0 0 0 19.79 7.13zM12 3.21a8.79 8.79 0 1 0 0 17.58 8.79 8.79 0 0 0 0-17.58zM8.79 9.71A4.29 4.29 0 1 1 13.08 14a4.29 4.29 0 0 1-4.29-4.29zM3 21h18v-2H3v2z"/>
            </svg>
            Watch on Crunchyroll
          </a>
        </div>
      </div>
    </article>
  );
}
