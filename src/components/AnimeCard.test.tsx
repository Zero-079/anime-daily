import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimeCard from './AnimeCard';
import { mockAnime, mockAnimeMinimal } from '../test/mocks';

describe('AnimeCard', () => {
  describe('renders anime title', () => {
    it('displays english title when available', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Cowboy Bebop')).toBeInTheDocument();
    });

    it('displays original title when english title is null', () => {
      const animeWithoutEnglish = { ...mockAnime, title_english: null };
      render(<AnimeCard anime={animeWithoutEnglish} />);
      expect(screen.getByText('Cowboy Bebop')).toBeInTheDocument();
    });

    it('displays japanese title when available', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('カウボーイビバップ')).toBeInTheDocument();
    });
  });

  describe('renders score', () => {
    it('displays formatted score with 2 decimal places', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('8.75')).toBeInTheDocument();
    });

    it('displays N/A when score is null', () => {
      const animeWithoutScore = { ...mockAnime, score: null };
      render(<AnimeCard anime={animeWithoutScore} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays score label', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Score')).toBeInTheDocument();
    });

    it('displays rank when available', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('#35')).toBeInTheDocument();
    });

    it('does not display rank when null', () => {
      const animeWithoutRank = { ...mockAnime, rank: null };
      render(<AnimeCard anime={animeWithoutRank} />);
      expect(screen.queryByText(/#\d+/)).not.toBeInTheDocument();
    });
  });

  describe('renders genres as badges', () => {
    it('displays genre badges', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
    });

    it('displays themes as badges', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Space')).toBeInTheDocument();
    });

    it('does not render genres section when empty', () => {
      const animeWithoutGenres = { ...mockAnime, genres: [], themes: [] };
      render(<AnimeCard anime={animeWithoutGenres} />);
      const genreBadges = document.querySelectorAll('.genre-badge');
      expect(genreBadges.length).toBe(0);
    });

    it('limits genres to 6 items', () => {
      const animeWithManyGenres = {
        ...mockAnime,
        genres: [
          { name: 'Action' },
          { name: 'Adventure' },
          { name: 'Comedy' },
          { name: 'Drama' },
          { name: 'Sci-Fi' },
          { name: 'Fantasy' },
          { name: 'Horror' },
          { name: 'Romance' },
        ],
        themes: []
      };
      render(<AnimeCard anime={animeWithManyGenres} />);
      const genreBadges = document.querySelectorAll('.genre-badge');
      expect(genreBadges.length).toBe(6);
    });
  });

  describe('renders MAL and Crunchyroll links', () => {
    it('renders MyAnimeList link with correct href', () => {
      render(<AnimeCard anime={mockAnime} />);
      const malLink = screen.getByText('View on MyAnimeList');
      expect(malLink).toHaveAttribute('href', mockAnime.url);
      expect(malLink).toHaveAttribute('target', '_blank');
    });

    it('renders Crunchyroll link with encoded title', () => {
      render(<AnimeCard anime={mockAnime} />);
      const crunchyrollLink = screen.getByText('Watch on Crunchyroll');
      expect(crunchyrollLink).toHaveAttribute('href');
      expect(crunchyrollLink.getAttribute('href')).toContain('Cowboy');
      expect(crunchyrollLink.getAttribute('href')).toContain('Bebop');
    });

    it('links have rel="noopener noreferrer"', () => {
      render(<AnimeCard anime={mockAnime} />);
      const malLink = screen.getByText('View on MyAnimeList');
      const crunchyrollLink = screen.getByText('Watch on Crunchyroll');
      expect(malLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(crunchyrollLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('expandable synopsis', () => {
    it('shows truncated synopsis by default for long text', () => {
      const animeWithLongSynopsis = {
        ...mockAnime,
        synopsis: 'A'.repeat(300)
      };
      render(<AnimeCard anime={animeWithLongSynopsis} />);
      const synopsisElement = document.querySelector('.anime-synopsis p');
      expect(synopsisElement?.textContent).toContain('...');
      expect(synopsisElement?.textContent?.length).toBeLessThanOrEqual(283);
    });

    it('shows Read more button for long synopsis', () => {
      const animeWithLongSynopsis = {
        ...mockAnime,
        synopsis: 'A'.repeat(300)
      };
      render(<AnimeCard anime={animeWithLongSynopsis} />);
      expect(screen.getByText('Read more')).toBeInTheDocument();
    });

    it('expands synopsis when Read more is clicked', () => {
      const animeWithLongSynopsis = {
        ...mockAnime,
        synopsis: 'A'.repeat(300)
      };
      render(<AnimeCard anime={animeWithLongSynopsis} />);
      
      const readMoreBtn = screen.getByText('Read more');
      fireEvent.click(readMoreBtn);
      
      const synopsisElement = document.querySelector('.anime-synopsis p');
      expect(synopsisElement?.textContent).toBe('A'.repeat(300));
      expect(screen.getByText('Show less')).toBeInTheDocument();
    });

    it('collapses synopsis when Show less is clicked', () => {
      const animeWithLongSynopsis = {
        ...mockAnime,
        synopsis: 'A'.repeat(300)
      };
      render(<AnimeCard anime={animeWithLongSynopsis} />);
      
      const readMoreBtn = screen.getByText('Read more');
      fireEvent.click(readMoreBtn);
      fireEvent.click(screen.getByText('Show less'));
      
      const synopsisElement = document.querySelector('.anime-synopsis p');
      expect(synopsisElement?.textContent).toContain('...');
    });

    it('does not show Read more for short synopsis', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.queryByText('Read more')).not.toBeInTheDocument();
    });
  });

  describe('handles missing data gracefully', () => {
    it('handles null title_english', () => {
      render(<AnimeCard anime={mockAnimeMinimal} />);
      expect(screen.getByText('Test Anime')).toBeInTheDocument();
    });

    it('handles null score', () => {
      render(<AnimeCard anime={mockAnimeMinimal} />);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('handles null synopsis', () => {
      render(<AnimeCard anime={mockAnimeMinimal} />);
      expect(screen.getByText('No synopsis available.')).toBeInTheDocument();
    });

    it('handles null episodes', () => {
      render(<AnimeCard anime={mockAnimeMinimal} />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('handles null year', () => {
      const animeNoYear = { ...mockAnimeMinimal, studios: [{ name: 'Test Studio' }] };
      render(<AnimeCard anime={animeNoYear} />);
      const yearElement = document.querySelector('.meta-item:nth-child(4) .meta-value');
      expect(yearElement?.textContent).toBe('Unknown');
    });

    it('handles empty studios array', () => {
      const animeNoStudio = { ...mockAnimeMinimal, year: 2024 };
      render(<AnimeCard anime={animeNoStudio} />);
      const studioElement = document.querySelector('.meta-item:nth-child(3) .meta-value');
      expect(studioElement?.textContent).toBe('Unknown');
    });

    it('handles missing image URL', () => {
      render(<AnimeCard anime={mockAnimeMinimal} />);
      const img = document.querySelector('img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('renders meta information', () => {
    it('displays episodes count', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('26')).toBeInTheDocument();
    });

    it('displays status', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Finished Airing')).toBeInTheDocument();
    });

    it('displays studio name', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('Sunrise')).toBeInTheDocument();
    });

    it('displays year', () => {
      render(<AnimeCard anime={mockAnime} />);
      expect(screen.getByText('1998')).toBeInTheDocument();
    });
  });
});
