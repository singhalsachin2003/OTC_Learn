/**
 * Mastery — how well a product is known, as a number from 0 to 100.
 *
 * A single quiz score is a noisy measure: someone can guess their way to 5/6
 * once, or misread two questions on a product they know well. So mastery moves
 * *toward* each new score rather than being replaced by it, which means one
 * good run cannot mark a product mastered and one bad run cannot undo weeks of
 * work. It also means mastery is earned — every product starts at zero.
 */

/** How far mastery travels toward a new score. 0.35 ≈ three runs to converge. */
export const LEARNING_RATE = 0.35;

/** At or above this, a product counts as complete for headline progress. */
export const MASTERY_COMPLETE = 70;

export interface ProductProgress {
  /** 0–100. */
  mastery: number;
  attempts: number;
  /** Best single-session percentage, which is never revised down. */
  bestScorePct: number;
  /** Local date key of the last completed session, or null. */
  lastStudiedOn: string | null;
  /**
   * Epoch milliseconds of the last change, for sync to merge by.
   *
   * `lastStudiedOn` cannot do this job: it is a date key, so it cannot order
   * two sessions on the same day — which is exactly when two devices are most
   * likely to disagree. Zero means "never stamped", which is what a record
   * written before schema v3 carries.
   */
  updatedAt: number;
}

export const emptyProgress: ProductProgress = {
  mastery: 0,
  attempts: 0,
  bestScorePct: 0,
  lastStudiedOn: null,
  updatedAt: 0,
};

/** Applies one session's score to a product's running mastery. */
export function nextMastery(current: number, scorePct: number): number {
  const clamped = Math.max(0, Math.min(100, scorePct));
  return Math.round(current + (clamped - current) * LEARNING_RATE);
}

/** The whole record after a finished session. */
export function applySession(
  previous: ProductProgress = emptyProgress,
  scorePct: number,
  today: string,
  now: Date = new Date(),
): ProductProgress {
  // Clamped on the same terms as mastery. Best score is never revised down, so
  // an out-of-range value written once would be permanent.
  const clamped = Math.max(0, Math.min(100, Math.round(scorePct)));
  return {
    mastery: nextMastery(previous.mastery, scorePct),
    attempts: previous.attempts + 1,
    bestScorePct: Math.max(previous.bestScorePct, clamped),
    lastStudiedOn: today,
    updatedAt: now.getTime(),
  };
}

export type MasteryBand = 'not started' | 'shaky' | 'building' | 'strong';

export function masteryBand(mastery: number): MasteryBand {
  if (mastery >= MASTERY_COMPLETE) {
    return 'strong';
  }
  if (mastery >= 35) {
    return 'building';
  }
  return mastery > 0 ? 'shaky' : 'not started';
}

/**
 * Headline progress across a set of products: the mean of their mastery, not
 * the share that are "done". A user halfway through everything and a user
 * finished with half of it are not in the same place, and the average says so.
 */
export function averageMastery(
  productIds: readonly string[],
  progress: Readonly<Record<string, ProductProgress | undefined>>,
): number {
  if (productIds.length === 0) {
    return 0;
  }
  const total = productIds.reduce(
    (sum, id) => sum + (progress[id]?.mastery ?? 0),
    0,
  );
  return Math.round(total / productIds.length);
}

/** Products whose mastery has reached the completion threshold. */
export function countMastered(
  productIds: readonly string[],
  progress: Readonly<Record<string, ProductProgress | undefined>>,
): number {
  return productIds.filter((id) => (progress[id]?.mastery ?? 0) >= MASTERY_COMPLETE)
    .length;
}
