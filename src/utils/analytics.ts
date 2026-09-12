/**
 * Analytics facade.
 *
 * v1.0 ships fully offline with no analytics provider wired up, so this is a
 * no-op sink with a stable call surface. To enable a provider later, implement
 * `sink` — every call site already routes through `track`.
 */

import type { OfferPeriod } from './purchases';

/** Where someone met the paywall, which is the only thing worth knowing. */
export type PaywallSource = 'home' | 'category' | 'product' | 'profile';

/** Which screen a share was sent from. What was shared is not recorded. */
export type ShareSurface = 'product' | 'results';

/** Why a promotional code was turned down. Mirrors `RedeemOutcome`'s failures. */
export type PromoRejection =
  'empty' | 'unknown' | 'campaign-ended' | 'already-longer';

export type AnalyticsEvent =
  | { name: 'category_opened'; categoryId: string }
  | { name: 'product_opened'; productId: string }
  | { name: 'lesson_started'; productId: string }
  | { name: 'lesson_completed'; productId: string }
  | { name: 'quiz_started'; productId: string }
  | {
      name: 'quiz_answered';
      productId: string;
      questionId: string;
      correct: boolean;
    }
  | { name: 'quiz_completed'; productId: string; score: number; total: number }
  | { name: 'review_started'; dueCount: number }
  // `scopeId` is a category id or `EXAM_SCOPE_ALL`, and `questionCount` is the
  // paper actually drawn rather than the length requested — a scope with a
  // thin bank yields a shorter exam, and the shorter figure is the true one.
  | { name: 'exam_started'; scopeId: string; questionCount: number }
  | { name: 'exam_completed'; scopeId: string; score: number; total: number }
  | { name: 'achievement_unlocked'; achievementId: string }
  | { name: 'bookmark_toggled'; productId: string; bookmarked: boolean }
  | { name: 'reminder_toggled'; enabled: boolean }
  | { name: 'progress_reset' }
  // Only that the store was asked. Play never reports what came of a prompt,
  // so there is no completion event to pair this with.
  | { name: 'review_prompted' }
  | { name: 'content_shared'; surface: ShareSurface }
  // Sync events carry no identifier of any kind. Whose account it is has no
  // bearing on whether sync works, and the sink is a crash reporter.
  | { name: 'account_created' }
  | { name: 'signed_in' }
  | { name: 'signed_out' }
  | { name: 'sync_completed' }
  // Purchase events carry the term and nothing else. What someone bought is a
  // product question; who they are is not one this sink should be able to ask.
  | { name: 'paywall_shown'; source: PaywallSource }
  | { name: 'purchase_started'; period: OfferPeriod }
  | { name: 'purchase_completed'; period: OfferPeriod }
  | { name: 'purchase_restored' }
  | { name: 'purchase_failed' }
  // A promotional code carries its campaign, never the code itself: the code is
  // the thing worth knowing whether to keep running, and a sink holding live
  // codes is a list of ways to get the paid content for nothing. A rejection
  // carries why, because a campaign generating nothing but `unknown` is usually
  // a code printed wrong rather than readers guessing.
  | { name: 'promo_redeemed'; campaign: string }
  | { name: 'promo_rejected'; reason: PromoRejection }
  | {
      /** A render error caught by `ErrorBoundary`. */
      name: 'app_error';
      error: Error;
      componentStack: string | null;
    };

type Sink = (event: AnalyticsEvent) => void;

let sink: Sink | null = null;

/** Installs a delivery function (e.g. a Sentry or Firebase adapter). */
export function setAnalyticsSink(next: Sink | null): void {
  sink = next;
}

export function track(event: AnalyticsEvent): void {
  sink?.(event);
}
