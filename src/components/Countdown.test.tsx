import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import Countdown from './Countdown';

describe('Countdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('renders hours, minutes, seconds', () => {
    it('displays all time units', () => {
      render(<Countdown />);
      
      expect(screen.getByText(/Hours?/)).toBeInTheDocument();
      expect(screen.getByText(/Minutes?/)).toBeInTheDocument();
      expect(screen.getByText(/Seconds?/)).toBeInTheDocument();
    });

    it('displays label text', () => {
      render(<Countdown />);
      expect(screen.getByText('Next Recommendation In')).toBeInTheDocument();
    });

    it('displays colon separators', () => {
      render(<Countdown />);
      const separators = document.querySelectorAll('.countdown-separator');
      expect(separators.length).toBe(2);
    });
  });

  describe('updates every second', () => {
    it('updates time after 1 second', () => {
      render(<Countdown />);
      
      const getSeconds = () => document.querySelectorAll('.countdown-value')[2]?.textContent;
      const initialSeconds = getSeconds();
      
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      
      const updatedSeconds = getSeconds();
      expect(updatedSeconds).not.toBe(initialSeconds);
    });

    it('updates time after multiple seconds', () => {
      render(<Countdown />);
      
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      
      const seconds = document.querySelectorAll('.countdown-value')[2]?.textContent;
      const minutes = document.querySelectorAll('.countdown-value')[1]?.textContent;
      
      expect(seconds).toBeDefined();
      expect(minutes).toBeDefined();
    });

    it('has countdown container class', () => {
      render(<Countdown />);
      expect(document.querySelector('.countdown')).toBeInTheDocument();
    });
  });

  describe('shows correct values until midnight', () => {
    it('pads single digit values with zero', () => {
      render(<Countdown />);
      
      const values = document.querySelectorAll('.countdown-value');
      values.forEach(value => {
        expect(value.textContent).toMatch(/^\d{2}$/);
      });
    });

    it('calculates time until midnight correctly', () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const expectedDiff = midnight.getTime() - now.getTime();
      const expectedHours = Math.floor(expectedDiff / (1000 * 60 * 60));
      
      render(<Countdown />);
      
      const hoursElement = document.querySelector('.countdown-value');
      const hours = parseInt(hoursElement?.textContent || '0', 10);
      
      expect(hours).toBe(expectedHours);
    });

    it('minutes are less than 60', () => {
      render(<Countdown />);
      
      const minutesElement = document.querySelectorAll('.countdown-value')[1];
      const minutes = parseInt(minutesElement?.textContent || '0', 10);
      
      expect(minutes).toBeLessThan(60);
    });

    it('seconds are less than 60', () => {
      render(<Countdown />);
      
      const secondsElement = document.querySelectorAll('.countdown-value')[2];
      const seconds = parseInt(secondsElement?.textContent || '0', 10);
      
      expect(seconds).toBeLessThan(60);
    });
  });

  describe('cleanup', () => {
    it('clears interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
      const { unmount } = render(<Countdown />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
