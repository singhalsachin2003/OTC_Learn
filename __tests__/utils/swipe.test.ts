import {
  shouldClaimSwipe,
  stepAfterSwipe,
  swipeIntent,
  SWIPE_CLAIM_DISTANCE,
  SWIPE_MAX_VERTICAL,
  SWIPE_THRESHOLD,
} from '../../src/utils/swipe';

/**
 * The lesson card's gesture rules.
 *
 * These matter more than their size suggests: the failure mode is not a crash
 * but a lesson that cannot be scrolled, or one that skips a step on a stray
 * finger movement — both of which are only noticeable on a device, by someone
 * who will not report it.
 */
describe('shouldClaimSwipe', () => {
  it('claims a clearly horizontal drag', () => {
    expect(shouldClaimSwipe({ dx: 40, dy: 5 })).toBe(true);
    expect(shouldClaimSwipe({ dx: -40, dy: 5 })).toBe(true);
  });

  // If this ever returns true for a vertical drag, long lesson text becomes
  // unscrollable — the card would steal every touch from its own ScrollView.
  it('leaves a vertical drag to the scroll view', () => {
    expect(shouldClaimSwipe({ dx: 20, dy: 80 })).toBe(false);
  });

  it('ignores a movement too small to be a deliberate swipe', () => {
    expect(shouldClaimSwipe({ dx: 5, dy: 0 })).toBe(false);
  });

  it('does not claim exactly at the distance boundary', () => {
    expect(shouldClaimSwipe({ dx: SWIPE_CLAIM_DISTANCE, dy: 0 })).toBe(false);
    expect(shouldClaimSwipe({ dx: SWIPE_CLAIM_DISTANCE + 1, dy: 0 })).toBe(true);
  });

  it('rejects a diagonal drag once it is vertical enough to be a scroll', () => {
    expect(shouldClaimSwipe({ dx: 50, dy: SWIPE_MAX_VERTICAL - 1 })).toBe(true);
    expect(shouldClaimSwipe({ dx: 50, dy: SWIPE_MAX_VERTICAL })).toBe(false);
  });
});

describe('swipeIntent', () => {
  // Dragging left pulls the next step into view, so a negative dx is "next".
  it('reads a leftward drag as moving forward', () => {
    expect(swipeIntent({ dx: -120, dy: 0 })).toBe('next');
  });

  it('reads a rightward drag as moving back', () => {
    expect(swipeIntent({ dx: 120, dy: 0 })).toBe('previous');
  });

  it('ignores a drag that did not travel far enough', () => {
    expect(swipeIntent({ dx: -(SWIPE_THRESHOLD - 1), dy: 0 })).toBe('none');
    expect(swipeIntent({ dx: SWIPE_THRESHOLD - 1, dy: 0 })).toBe('none');
    expect(swipeIntent({ dx: 0, dy: 0 })).toBe('none');
  });

  it('acts exactly at the threshold', () => {
    expect(swipeIntent({ dx: -SWIPE_THRESHOLD, dy: 0 })).toBe('next');
    expect(swipeIntent({ dx: SWIPE_THRESHOLD, dy: 0 })).toBe('previous');
  });
});

describe('stepAfterSwipe', () => {
  it('advances and retreats by one step', () => {
    expect(stepAfterSwipe('next', 1, 5)).toBe(2);
    expect(stepAfterSwipe('previous', 1, 5)).toBe(0);
  });

  it('stays put when the gesture meant nothing', () => {
    expect(stepAfterSwipe('none', 3, 5)).toBe(3);
  });

  // Swiping past either end must settle rather than run off the lesson: the
  // screen renders `lessons[stepIndex]`, so an out-of-range index blanks it.
  it('clamps at the last step', () => {
    expect(stepAfterSwipe('next', 4, 5)).toBe(4);
  });

  it('clamps at the first step', () => {
    expect(stepAfterSwipe('previous', 0, 5)).toBe(0);
  });

  it('never returns a negative index for an empty lesson', () => {
    expect(stepAfterSwipe('previous', 0, 0)).toBe(0);
    expect(stepAfterSwipe('next', 0, 0)).toBe(0);
  });
});
