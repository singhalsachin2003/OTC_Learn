import { promoCodes } from '../../src/data/promoCodes';
import { normalisePromoCode, redeemPromoCode } from '../../src/utils/promoCode';

/**
 * Structural guards on the shipped code table, in the spirit of
 * `catalogue.test.ts`: the table is data, so what protects it is a test rather
 * than a type.
 *
 * The one that matters most is the last: **no code may grant permanent access.**
 * Every code here is public the moment it ships — extractable from the bundle —
 * so expiry is the only thing limiting what a leak costs, and a code with an
 * absurd `days` would quietly give the paid catalogue away for years.
 */
describe('the promotional code table', () => {
  it('is not empty, because the paywall offers the field', () => {
    expect(promoCodes.length).toBeGreaterThan(0);
  });

  it('holds no duplicate codes', () => {
    const codes = promoCodes.map((code) => normalisePromoCode(code.code));
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('writes every code in the form it is matched in', () => {
    for (const { code } of promoCodes) {
      expect(code).toBe(normalisePromoCode(code));
    }
  });

  it('names a campaign for every code, so analytics can report one', () => {
    for (const { campaign } of promoCodes) {
      expect(campaign.trim()).not.toBe('');
    }
  });

  it('gives every code a window that parses', () => {
    for (const { redeemableUntil } of promoCodes) {
      expect(redeemableUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(redeemableUntil))).toBe(false);
    }
  });

  /**
   * A year is the ceiling, and it is deliberately generous rather than tight:
   * the point is to catch a `days` that was meant to be 30 and was typed as
   * 3000, which is a permanent grant wearing a number.
   */
  it('grants a bounded number of days, never permanent access', () => {
    for (const { days } of promoCodes) {
      expect(Number.isInteger(days)).toBe(true);
      expect(days).toBeGreaterThan(0);
      expect(days).toBeLessThanOrEqual(365);
    }
  });

  /** Every shipped code has to actually work against the real redeemer. */
  it('redeems every code it ships', () => {
    for (const { code, redeemableUntil } of promoCodes) {
      // Judged a day inside the window, so the test says nothing about what
      // today's date happens to be and cannot start failing on its own.
      const inWindow = Date.parse(`${redeemableUntil}T00:00:00Z`) - 1000;
      expect(redeemPromoCode(code, inWindow).result).toBe('granted');
    }
  });
});
