import type { PromoCode } from '../utils/promoCode';

/**
 * Promotional codes, and the single most important thing to understand about
 * them: **every code here is public.**
 *
 * They are compiled into the JavaScript bundle, so anyone can read them out of
 * an installed app with `strings` on the Hermes binary — the same check this
 * repo already runs before an OTA. Nothing stops a redeemed code being posted
 * publicly either. So a code is a *marketing* secret at best, and the table
 * below is designed around that rather than pretending otherwise:
 *
 * - **Every grant is time-limited.** `days` is what contains the damage when a
 *   code leaks: the worst case is a batch of readers getting the paid asset
 *   classes for a few weeks, which is the promotion working, not a breach.
 *   There is deliberately no way to express a permanent grant here.
 * - **`redeemableUntil` retires a code on its own.** A campaign that ends does
 *   not need a code deleted to stop working, which matters because the app is
 *   offline-first and a device can be weeks behind.
 * - **This file is JavaScript, so it ships in an OTA.** Adding, changing or
 *   killing a code is `eas update` and minutes, not a store build. What an OTA
 *   cannot do is take back a grant already made on a device — expiry is what
 *   does that, which is the other reason grants are never permanent.
 *
 * A code grants exactly what a subscription grants, for `days` days. It does
 * not create a Play subscription, it takes no payment, and it renews into
 * nothing — see `utils/promoCode.ts` for why that keeps it outside Play's
 * billing policy entirely.
 */
export const promoCodes: readonly PromoCode[] = [
  {
    code: 'OTCLAUNCH',
    campaign: 'launch',
    days: 60,
    redeemableUntil: '2026-12-31',
  },
];
