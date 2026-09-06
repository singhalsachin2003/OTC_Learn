import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';

/**
 * The in-app review prompt, funnelled through one module.
 *
 * Play's review API is deliberately unhelpful: it never reports whether the
 * sheet appeared, and it silently does nothing once a device-level quota is
 * exhausted. So the only thing this module can honestly promise is that the app
 * asks at a good moment and rarely — it can neither confirm a review was left
 * nor retry a prompt that was swallowed.
 *
 * The moment is a product crossing the mastery threshold on the results screen:
 * the one point in the app where someone has just been told they have finished
 * something. Never on launch, and never after a wrong answer — mastery moves
 * only 35% of the way toward a score, so a sitting that carries a product over
 * 70 was a good one by construction.
 */

/** Web has no store review API; calling through would throw. */
const supported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Ask at most this often. Play's own quota is stricter than this and unknowable
 * from here, so the interval is about not badgering someone who has already
 * been asked, not about staying inside the quota.
 */
export const REVIEW_PROMPT_INTERVAL_DAYS = 120;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReviewPromptInput {
  /**
   * Whether the sitting just recorded carried a product over the mastery
   * threshold. Decided in `progressSlice.recordSession`, which is the only
   * place that still holds the mastery the sitting replaced.
   */
  crossedThreshold: boolean;
  /** When the prompt was last shown, in epoch milliseconds, or null. */
  lastPromptedAt: number | null;
  now: number;
}

/**
 * Whether this sitting has earned the right to ask. Pure, and takes `now`, for
 * the same reason the scheduling rules do — a prompt that fires on the wrong
 * day is not something a user would ever report.
 */
export function shouldAskForReview(input: ReviewPromptInput): boolean {
  const { crossedThreshold, lastPromptedAt, now } = input;

  if (!crossedThreshold) {
    return false;
  }

  if (lastPromptedAt === null) {
    return true;
  }

  // A clock that has gone backwards (a device whose date was corrected) would
  // otherwise make the last prompt look like it is in the future and lock the
  // prompt out for months. Treat any negative gap as long enough.
  const elapsed = now - lastPromptedAt;
  return elapsed < 0 || elapsed >= REVIEW_PROMPT_INTERVAL_DAYS * DAY_MS;
}

/**
 * Asks the store for a review, if the store is in a position to be asked.
 *
 * Resolves with whether the request was made, so the caller only spends the
 * 120-day window on a prompt that actually reached the OS. Swallows its own
 * failures: a store that refuses is not a problem the user can act on, and an
 * unhandled rejection on the results screen would be.
 */
export async function requestReview(): Promise<boolean> {
  if (!supported) {
    return false;
  }
  try {
    if (!(await StoreReview.isAvailableAsync())) {
      return false;
    }
    if (!(await StoreReview.hasAction())) {
      return false;
    }
    await StoreReview.requestReview();
    return true;
  } catch {
    return false;
  }
}
