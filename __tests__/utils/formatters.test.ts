import {
  daysBetween,
  formatProductCount,
  formatProgressLabel,
  formatScore,
  formatStepLabel,
  progressPercent,
  progressRatio,
  toDateKey,
} from '../../src/utils/formatters';

describe('formatters', () => {
  it('renders 1-based step labels', () => {
    expect(formatStepLabel(0, 3)).toBe('1 of 3');
    expect(formatStepLabel(2, 3)).toBe('3 of 3');
  });

  it('pluralises the product count', () => {
    expect(formatProductCount(2, 1)).toBe('2 products · 1 done');
    expect(formatProductCount(1, 0)).toBe('1 product · 0 done');
  });

  it('formats the overall progress label', () => {
    expect(formatProgressLabel(3, 10)).toBe('3 / 10 products');
  });

  it('formats a score', () => {
    expect(formatScore(2, 3)).toBe('2/3');
  });

  describe('progressRatio', () => {
    it('computes the completion share', () => {
      expect(progressRatio(3, 10)).toBeCloseTo(0.3);
    });

    it('returns 0 rather than NaN for an empty total', () => {
      expect(progressRatio(0, 0)).toBe(0);
    });

    it('clamps out-of-range input', () => {
      expect(progressRatio(15, 10)).toBe(1);
      expect(progressRatio(-2, 10)).toBe(0);
    });
  });

  it('rounds percentages', () => {
    expect(progressPercent(1, 3)).toBe(33);
    expect(progressPercent(10, 10)).toBe(100);
  });

  describe('toDateKey', () => {
    it('zero-pads month and day', () => {
      expect(toDateKey(new Date(2026, 6, 5))).toBe('2026-07-05');
    });

    it('uses local time, not UTC', () => {
      // 23:30 local on the 25th must not roll forward to the 26th.
      expect(toDateKey(new Date(2026, 6, 25, 23, 30))).toBe('2026-07-25');
    });
  });

  describe('daysBetween', () => {
    it('counts consecutive days', () => {
      expect(daysBetween('2026-07-25', '2026-07-26')).toBe(1);
    });

    it('spans month boundaries', () => {
      expect(daysBetween('2026-07-31', '2026-08-01')).toBe(1);
    });

    it('is negative when the dates are reversed', () => {
      expect(daysBetween('2026-07-26', '2026-07-25')).toBe(-1);
    });

    it('returns NaN for an unparsable key', () => {
      expect(daysBetween('nonsense', '2026-07-25')).toBeNaN();
    });
  });
});
