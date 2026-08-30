import {
  daysBetween,
  formatScore,
  formatStepLabel,
  toDateKey,
} from '../../src/utils/formatters';

describe('formatters', () => {
  it('renders 1-based step labels', () => {
    expect(formatStepLabel(0, 3)).toBe('1 of 3');
    expect(formatStepLabel(2, 3)).toBe('3 of 3');
  });

  it('formats a score', () => {
    expect(formatScore(2, 3)).toBe('2/3');
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
