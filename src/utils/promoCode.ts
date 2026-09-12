import { promoCodes } from '../data/promoCodes';

/**
 * Promotional access, granted by a code rather than bought.
 *
 * **Why this can exist at all, given Google Play's billing policy.** Play
 * requires that digital content *sold* inside an app is sold through Play
 * billing. A code here never takes a payment: it gives the paid asset classes
 * away for a fixed number of days and renews into nothing. Giving content away
 * is not a transaction, so no Play product, price or offer is involved.
 *
 * **What this deliberately cannot do, and it is the thing everyone asks for
 * first: a discount.** A reduced *price* is still a sale, and prices belong to
 * Play — a percentage off has to be a Play subscription offer, and Play's own
 * promo codes only grant free trials (3–90 days, new subscribers only, and
 * redeemed inside Google's payment sheet rather than anywhere this app can
 * reach). So a code either opens everything for a while, free, or it is not
 * something this module can honour. Half-price is not on the menu.
 *
 * Pure, and takes `now` as an argument for the same reason `utils/review.ts`
 * does: expiry is invisible when it goes wrong. A grant that quietly outlives
 * its window gives content away for free and a grant that expires early takes
 * it back from someone mid-lesson, and neither throws.
 */
export interface PromoCode {
  /**
   * Compared case-insensitively and ignoring spaces and dashes, so `otc launch`
   * and `OTC-LAUNCH` both reach `OTCLAUNCH`. Readers type these off a slide.
   */
  code: string;
  /** Which promotion this belongs to. Reported in analytics; never shown. */
  campaign: string;
  /** Days of access a redemption grants, counted from the moment it happens. */
  days: number;
  /** The last day this code may be redeemed, `YYYY-MM-DD`, inclusive. */
  redeemableUntil: string;
}

/** A grant held by this install. Persisted, and the only record of one. */
export interface PromoUnlock {
  /** The code as matched, normalised. */
  code: string;
  campaign: string;
  /** Epoch milliseconds. */
  grantedAt: number;
  /** Epoch milliseconds. Access ends here; there is no renewal. */
  expiresAt: number;
}

/**
 * What came of a redemption.
 *
 * Every failure is a distinct outcome rather than a boolean, because the screen
 * has something different and true to say for each — "we do not know that code"
 * and "that promotion has ended" are not the same message to someone typing a
 * code off a conference slide, and "you already have longer than that" is not a
 * failure at all.
 */
export type RedeemOutcome =
  | { result: 'granted'; unlock: PromoUnlock }
  | { result: 'empty' }
  | { result: 'unknown' }
  | { result: 'campaign-ended'; redeemableUntil: string }
  | { result: 'already-longer'; unlock: PromoUnlock };

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Codes are matched on letters and digits alone.
 *
 * Anything a reader might reasonably add while copying a code off a slide or
 * out of a chat message — case, spaces, dashes — should not be the reason it
 * fails, because the failure would look like the code being wrong.
 */
export function normalisePromoCode(input: string): string {
  return input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * The end of `redeemableUntil`, in epoch milliseconds.
 *
 * Inclusive of the whole named day: a code good "until 31 December" should work
 * on 31 December, which is what anyone reading the table would assume. Parsed
 * as UTC, so the answer does not depend on the device's timezone — a code is a
 * campaign, not a local event, and a reader in Auckland and one in São Paulo
 * should get the same answer about whether it has ended.
 */
function redeemableUntilMs(day: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
  if (match === null) {
    return null;
  }
  const ms = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(ms) ? null : ms + MS_PER_DAY - 1;
}

/**
 * Redeems `input` against the code table.
 *
 * `existing` is the grant this install already holds, and the rule around it is
 * that **a redemption never shortens access**. Someone holding 50 days who
 * types a 7-day code has not asked to give up 43, and a code that silently did
 * that would be indistinguishable from a bug. So a shorter grant is reported
 * back as `already-longer` and nothing is written.
 *
 * A malformed `redeemableUntil` retires the code rather than granting it: a
 * typo in the table should cost a promotion, not the price of the content.
 */
export function redeemPromoCode(
  input: string,
  now: number,
  existing: PromoUnlock | null = null,
  codes: readonly PromoCode[] = promoCodes,
): RedeemOutcome {
  const normalised = normalisePromoCode(input);
  if (normalised === '') {
    return { result: 'empty' };
  }

  const match = codes.find((code) => normalisePromoCode(code.code) === normalised);
  if (match === undefined) {
    return { result: 'unknown' };
  }

  const closesAt = redeemableUntilMs(match.redeemableUntil);
  if (closesAt === null || now > closesAt) {
    return { result: 'campaign-ended', redeemableUntil: match.redeemableUntil };
  }

  const unlock: PromoUnlock = {
    code: normalised,
    campaign: match.campaign,
    grantedAt: now,
    expiresAt: now + match.days * MS_PER_DAY,
  };

  if (existing !== null && existing.expiresAt >= unlock.expiresAt) {
    return { result: 'already-longer', unlock: existing };
  }

  return { result: 'granted', unlock };
}

/** Whether a grant is still running at `now`. A missing grant is not one. */
export function promoUnlockActive(
  unlock: PromoUnlock | null,
  now: number,
): boolean {
  return unlock !== null && unlock.expiresAt > now;
}

/**
 * Whole days left, rounded up, so the last partial day still reads as "1 day
 * left" rather than "0" while access plainly still works.
 */
export function promoDaysRemaining(
  unlock: PromoUnlock | null,
  now: number,
): number {
  if (!promoUnlockActive(unlock, now)) {
    return 0;
  }
  return Math.ceil(((unlock as PromoUnlock).expiresAt - now) / MS_PER_DAY);
}

/**
 * Whether a stored value is a grant this app wrote.
 *
 * Storage reads never throw here — a corrupt grant is treated as no grant,
 * which puts the paywall back rather than blocking the app. Falling the other
 * way would let a truncated write open the catalogue forever.
 */
export function parsePromoUnlock(value: unknown): PromoUnlock | null {
  if (value === null || typeof value !== 'object') {
    return null;
  }
  const { code, campaign, grantedAt, expiresAt } = value as Record<string, unknown>;
  if (
    typeof code !== 'string' ||
    typeof campaign !== 'string' ||
    typeof grantedAt !== 'number' ||
    typeof expiresAt !== 'number' ||
    !Number.isFinite(grantedAt) ||
    !Number.isFinite(expiresAt)
  ) {
    return null;
  }
  return { code, campaign, grantedAt, expiresAt };
}
