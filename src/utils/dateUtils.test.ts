import { describe, it, expect } from 'vitest';
import { getDailyIndex, getDayOfYear, getTodayDateString, getTimeUntilMidnight } from './dateUtils';

describe('dateUtils', () => {
  describe('getDailyIndex', () => {
    it('returns same index for same date', () => {
      const date = '2024-03-15';
      const index1 = getDailyIndex(date);
      const index2 = getDailyIndex(date);
      expect(index1).toBe(index2);
    });

    it('returns a number between 0 and 99', () => {
      const index = getDailyIndex('2024-03-15');
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(100);
    });

    it('returns different indices for different dates', () => {
      const index1 = getDailyIndex('2024-01-01');
      const index2 = getDailyIndex('2024-12-31');
      expect(index1).not.toBe(index2);
    });

    it('uses today date when no argument provided', () => {
      const index = getDailyIndex();
      expect(typeof index).toBe('number');
    });
  });

  describe('getDayOfYear', () => {
    it('returns a number between 1 and 366', () => {
      const dayOfYear = getDayOfYear();
      expect(dayOfYear).toBeGreaterThanOrEqual(1);
      expect(dayOfYear).toBeLessThanOrEqual(366);
    });

    it('returns a value between 1 and 366', () => {
      expect(getDayOfYear()).toBeGreaterThanOrEqual(1);
      expect(getDayOfYear()).toBeLessThanOrEqual(366);
    });
  });

  describe('getTodayDateString', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const dateStr = getTodayDateString();
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns a valid date string', () => {
      const dateStr = getTodayDateString();
      const parsed = new Date(dateStr);
      expect(parsed.getFullYear()).toBeGreaterThanOrEqual(2024);
    });
  });

  describe('getTimeUntilMidnight', () => {
    it('returns hours, minutes, and seconds', () => {
      const time = getTimeUntilMidnight();
      expect(time).toHaveProperty('hours');
      expect(time).toHaveProperty('minutes');
      expect(time).toHaveProperty('seconds');
    });

    it('hours is between 0 and 23', () => {
      const time = getTimeUntilMidnight();
      expect(time.hours).toBeGreaterThanOrEqual(0);
      expect(time.hours).toBeLessThan(24);
    });

    it('minutes is between 0 and 59', () => {
      const time = getTimeUntilMidnight();
      expect(time.minutes).toBeGreaterThanOrEqual(0);
      expect(time.minutes).toBeLessThan(60);
    });

    it('seconds is between 0 and 59', () => {
      const time = getTimeUntilMidnight();
      expect(time.seconds).toBeGreaterThanOrEqual(0);
      expect(time.seconds).toBeLessThan(60);
    });

    it('hours + minutes + seconds adds up to seconds until midnight', () => {
      const time = getTimeUntilMidnight();
      const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const expectedSeconds = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      
      expect(totalSeconds).toBeGreaterThanOrEqual(expectedSeconds - 1);
      expect(totalSeconds).toBeLessThanOrEqual(expectedSeconds + 1);
    });
  });
});
