/**
 * Swipe interpretation for the lesson card.
 *
 * Extracted from the component because this is the part that can be wrong.
 * `PanResponder` itself is well-tested library code; what is bespoke here is
 * the arithmetic deciding whether a finger movement is a page turn, a scroll,
 * or nothing — and that is unreachable through a rendered component without
 * fabricating touch histories, which tests the fabrication more than the rule.
 */

/** Horizontal travel before a drag counts as a step change. */
export const SWIPE_THRESHOLD = 60;

/**
 * Movement before the gesture is claimed at all. Below this the touch belongs
 * to the card's ScrollView, so long lesson text still scrolls.
 */
export const SWIPE_CLAIM_DISTANCE = 12;

/** Beyond this vertical travel the gesture is a scroll, not a swipe. */
export const SWIPE_MAX_VERTICAL = 40;

/** How far the card follows the finger — damped so it never leaves the screen. */
export const SWIPE_FOLLOW_RATIO = 0.4;

export interface Gesture {
  dx: number;
  dy: number;
}

/**
 * Should the pan responder take over this gesture?
 *
 * Both conditions matter: a mostly-vertical drag is someone reading, and
 * claiming it would make long lesson text impossible to scroll.
 */
export function shouldClaimSwipe({ dx, dy }: Gesture): boolean {
  return Math.abs(dx) > SWIPE_CLAIM_DISTANCE && Math.abs(dy) < SWIPE_MAX_VERTICAL;
}

export type SwipeIntent = 'next' | 'previous' | 'none';

/**
 * What a released gesture meant.
 *
 * Dragging left (negative dx) moves forward, matching the direction the content
 * appears to travel under the finger.
 */
export function swipeIntent({ dx }: Gesture): SwipeIntent {
  if (dx <= -SWIPE_THRESHOLD) {
    return 'next';
  }
  return dx >= SWIPE_THRESHOLD ? 'previous' : 'none';
}

/** The step a release should land on, clamped to the available steps. */
export function stepAfterSwipe(
  intent: SwipeIntent,
  current: number,
  total: number,
): number {
  const target =
    intent === 'next' ? current + 1 : intent === 'previous' ? current - 1 : current;
  return Math.max(0, Math.min(total - 1, target));
}
