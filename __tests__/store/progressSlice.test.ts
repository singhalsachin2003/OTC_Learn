import reducer, {
  initialProgressState,
  recordQuestionResult,
  recordSession,
  resetProgress,
  setAchievements,
  setBookmarks,
  setProgress,
  setProgressLoading,
  setQuestionHistory,
  toggleBookmark,
  unlockAchievements,
} from '../../src/store/slices/progressSlice';
import { LEARNING_RATE, type ProductProgress } from '../../src/utils/mastery';

const TODAY = '2026-08-12';

describe('progressSlice mastery', () => {
  it('starts with nothing attempted, bookmarked or unlocked', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialProgressState);
  });

  it('folds a first session part of the way toward the score', () => {
    const state = reducer(
      initialProgressState,
      recordSession({ productId: 'irs', scorePct: 80, today: TODAY }),
    );

    expect(state.byProduct.irs).toEqual({
      mastery: Math.round(80 * LEARNING_RATE),
      attempts: 1,
      bestScorePct: 80,
      lastStudiedOn: TODAY,
    });
  });

  it('moves mastery toward each later score rather than replacing it', () => {
    let state = reducer(
      initialProgressState,
      recordSession({ productId: 'irs', scorePct: 80, today: TODAY }),
    );
    const first = state.byProduct.irs.mastery;

    state = reducer(
      state,
      recordSession({ productId: 'irs', scorePct: 100, today: '2026-08-13' }),
    );

    expect(state.byProduct.irs.mastery).toBe(
      Math.round(first + (100 - first) * LEARNING_RATE),
    );
    expect(state.byProduct.irs.mastery).toBeLessThan(100);
    expect(state.byProduct.irs.attempts).toBe(2);
    expect(state.byProduct.irs.lastStudiedOn).toBe('2026-08-13');
  });

  it('never revises the best score down after a poor run', () => {
    let state = reducer(
      initialProgressState,
      recordSession({ productId: 'cds', scorePct: 83, today: TODAY }),
    );
    state = reducer(
      state,
      recordSession({ productId: 'cds', scorePct: 17, today: TODAY }),
    );

    expect(state.byProduct.cds.bestScorePct).toBe(83);
  });

  it('keeps each product mastery separate', () => {
    let state = reducer(
      initialProgressState,
      recordSession({ productId: 'irs', scorePct: 100, today: TODAY }),
    );
    state = reducer(
      state,
      recordSession({ productId: 'fxfwd', scorePct: 50, today: TODAY }),
    );

    expect(state.byProduct.irs.mastery).toBeGreaterThan(
      state.byProduct.fxfwd.mastery,
    );
    expect(Object.keys(state.byProduct)).toEqual(['irs', 'fxfwd']);
  });
});

describe('progressSlice question history', () => {
  it('opens a tally on the first answer to a question', () => {
    const state = reducer(
      initialProgressState,
      recordQuestionResult({ questionId: 'irs-q1', correct: true }),
    );

    expect(state.questionHistory['irs-q1']).toEqual({ right: 1, wrong: 0 });
  });

  it('accumulates right and wrong across repeated attempts', () => {
    let state = reducer(
      initialProgressState,
      recordQuestionResult({ questionId: 'irs-q1', correct: false }),
    );
    state = reducer(
      state,
      recordQuestionResult({ questionId: 'irs-q1', correct: false }),
    );
    state = reducer(
      state,
      recordQuestionResult({ questionId: 'irs-q1', correct: true }),
    );

    expect(state.questionHistory['irs-q1']).toEqual({ right: 1, wrong: 2 });
  });

  it('tallies each question independently', () => {
    let state = reducer(
      initialProgressState,
      recordQuestionResult({ questionId: 'irs-q1', correct: true }),
    );
    state = reducer(
      state,
      recordQuestionResult({ questionId: 'irs-q2', correct: false }),
    );

    expect(state.questionHistory).toEqual({
      'irs-q1': { right: 1, wrong: 0 },
      'irs-q2': { right: 0, wrong: 1 },
    });
  });
});

describe('progressSlice bookmarks', () => {
  it('adds a product on the first toggle', () => {
    const state = reducer(initialProgressState, toggleBookmark('irs'));

    expect(state.bookmarkedProductIds).toEqual(['irs']);
  });

  it('removes the same product on a second toggle', () => {
    const added = reducer(initialProgressState, toggleBookmark('irs'));
    const removed = reducer(added, toggleBookmark('irs'));

    expect(removed.bookmarkedProductIds).toEqual([]);
  });

  it('removes only the toggled product, keeping the rest in order', () => {
    let state = reducer(initialProgressState, toggleBookmark('irs'));
    state = reducer(state, toggleBookmark('cds'));
    state = reducer(state, toggleBookmark('fxfwd'));

    state = reducer(state, toggleBookmark('cds'));

    expect(state.bookmarkedProductIds).toEqual(['irs', 'fxfwd']);
  });

  it('de-duplicates when hydrating the whole list', () => {
    const state = reducer(
      initialProgressState,
      setBookmarks(['irs', 'irs', 'cds']),
    );

    expect(state.bookmarkedProductIds).toEqual(['irs', 'cds']);
  });
});

describe('progressSlice achievements', () => {
  it('unlocks several achievements at once', () => {
    const state = reducer(
      initialProgressState,
      unlockAchievements(['first-quiz', 'week-one']),
    );

    expect(state.unlockedAchievementIds).toEqual(['first-quiz', 'week-one']);
  });

  // Unlocks are recomputed after every session, so the same ids arrive again
  // and again; re-awarding them would inflate the profile count.
  it('ignores achievements that are already unlocked', () => {
    const once = reducer(
      initialProgressState,
      unlockAchievements(['first-quiz', 'week-one']),
    );
    const twice = reducer(once, unlockAchievements(['first-quiz', 'week-one']));

    expect(twice.unlockedAchievementIds).toEqual(['first-quiz', 'week-one']);
  });

  it('appends only the genuinely new ids from a mixed batch', () => {
    const once = reducer(initialProgressState, unlockAchievements(['first-quiz']));
    const twice = reducer(once, unlockAchievements(['first-quiz', 'ten-quizzes']));

    expect(twice.unlockedAchievementIds).toEqual(['first-quiz', 'ten-quizzes']);
  });

  it('de-duplicates when hydrating the whole list', () => {
    const state = reducer(
      initialProgressState,
      setAchievements(['week-one', 'week-one']),
    );

    expect(state.unlockedAchievementIds).toEqual(['week-one']);
  });
});

describe('progressSlice hydration', () => {
  const stored: Record<string, ProductProgress> = {
    irs: { mastery: 62, attempts: 4, bestScorePct: 83, lastStudiedOn: TODAY },
  };

  it('replaces mastery and question history wholesale', () => {
    let state = reducer(initialProgressState, setProgress(stored));
    state = reducer(
      state,
      setQuestionHistory({ 'irs-q1': { right: 2, wrong: 1 } }),
    );

    expect(state.byProduct).toEqual(stored);
    expect(state.questionHistory).toEqual({ 'irs-q1': { right: 2, wrong: 1 } });
  });

  it('tracks the hydration flag', () => {
    const loading = reducer(initialProgressState, setProgressLoading(true));

    expect(loading.loading).toBe(true);
    expect(reducer(loading, setProgressLoading(false)).loading).toBe(false);
  });

  it('wipes everything it owns on reset', () => {
    let state = reducer(initialProgressState, setProgress(stored));
    state = reducer(state, toggleBookmark('irs'));
    state = reducer(state, unlockAchievements(['first-quiz']));

    expect(reducer(state, resetProgress())).toEqual(initialProgressState);
  });
});
