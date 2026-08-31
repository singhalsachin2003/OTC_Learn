import { MASTERY_COMPLETE } from './mastery';

/**
 * Where someone is along a path.
 *
 * Pure, and takes mastery as a lookup rather than reading the store, for the
 * same reason the review and mastery rules do: this decides what the app tells
 * someone to do next, and a wrong answer is invisible — it just quietly sends
 * a beginner to the hardest product in the book.
 */

export type StepState = 'done' | 'current' | 'upcoming';

export interface PathStep {
  productId: string;
  /** 1-based, as shown to the reader. */
  position: number;
  mastery: number;
  state: StepState;
}

export type MasteryLookup = (productId: string) => number;

/**
 * Done means mastered, wherever it sits.
 *
 * Position does not gate anything — nothing here locks a product, and someone
 * who jumps to the last one has genuinely done it. `current` is simply the
 * first thing not yet mastered, which is the honest answer to "what now"
 * whether or not they took the route in order.
 */
export function pathSteps(
  productIds: readonly string[],
  masteryFor: MasteryLookup,
): PathStep[] {
  let seenCurrent = false;

  return productIds.map((productId, index) => {
    const mastery = masteryFor(productId);
    const done = mastery >= MASTERY_COMPLETE;

    let state: StepState = 'upcoming';
    if (done) {
      state = 'done';
    } else if (!seenCurrent) {
      state = 'current';
      seenCurrent = true;
    }

    return { productId, position: index + 1, mastery, state };
  });
}

/** The product to study next, or null once the path is finished. */
export function nextOnPath(
  productIds: readonly string[],
  masteryFor: MasteryLookup,
): string | null {
  return (
    pathSteps(productIds, masteryFor).find((step) => step.state === 'current')
      ?.productId ?? null
  );
}

export interface PathProgress {
  completed: number;
  total: number;
  /** Whole per cent, so a bar and a label cannot disagree. */
  percent: number;
}

export function pathProgress(
  productIds: readonly string[],
  masteryFor: MasteryLookup,
): PathProgress {
  const total = productIds.length;
  const completed = productIds.filter(
    (id) => masteryFor(id) >= MASTERY_COMPLETE,
  ).length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
