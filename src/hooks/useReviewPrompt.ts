import { useEffect, useRef } from 'react';

import { track } from '../utils/analytics';
import { loadReviewPromptedAt, saveReviewPromptedAt } from '../utils/storage';
import { requestReview, shouldAskForReview } from '../utils/storeReview';

/** How long the results screen is left to itself before the sheet is asked for. */
const SETTLE_MS = 1200;

/**
 * Asks for a store review, once, when a sitting has just carried a product over
 * the mastery threshold.
 *
 * The delay is not decoration: the store sheet covers the screen, and appearing
 * on the same frame as the score would hide the thing the user came to read and
 * make the prompt feel like the app's reward for finishing rather than a
 * question. Leaving the screen before it fires cancels it, so someone who taps
 * straight through is never interrupted.
 */
export function useReviewPrompt(crossedThreshold: boolean): void {
  // Guards against a re-render asking twice within one sitting; the persisted
  // stamp is what guards across sittings.
  const asked = useRef(false);

  useEffect(() => {
    if (!crossedThreshold || asked.current) {
      return;
    }
    asked.current = true;

    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        const lastPromptedAt = await loadReviewPromptedAt();
        if (
          cancelled ||
          !shouldAskForReview({
            crossedThreshold: true,
            lastPromptedAt,
            now: Date.now(),
          })
        ) {
          return;
        }
        if (await requestReview()) {
          track({ name: 'review_prompted' });
          // Stamped only after the request reached the OS, so a device that
          // cannot show the sheet does not spend the next four months unable
          // to ask.
          await saveReviewPromptedAt(Date.now());
        }
      })();
    }, SETTLE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [crossedThreshold]);
}
