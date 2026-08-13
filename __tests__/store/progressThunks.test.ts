import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore, type AppStore } from '../../src/store';
import { setSettings } from '../../src/store/slices/settingsSlice';
import {
  completeReviewSession,
  completeSession,
  toggleProductBookmark,
} from '../../src/store/thunks/progressThunks';
import { toDateKey } from '../../src/utils/formatters';
import { LEARNING_RATE } from '../../src/utils/mastery';
import { defaultSettings, STORAGE_KEYS } from '../../src/utils/storage';

/**
 * Real catalogue ids throughout: the review queue resolves a question back to
 * its product through the catalogue index, so an invented id would exercise a
 * path the app never takes.
 */
const PRODUCT = 'irs';

async function stored(key: string): Promise<unknown> {
  const raw = await AsyncStorage.getItem(key);
  return raw === null ? null : JSON.parse(raw);
}

function withSpacedRepetition(store: AppStore, enabled: boolean): void {
  store.dispatch(setSettings({ ...defaultSettings, spacedRepetition: enabled }));
}

describe('progress thunks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  describe('completeSession', () => {
    it('moves mastery toward the session score rather than to it', async () => {
      const store = createStore();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 100,
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      expect(store.getState().progress.byProduct[PRODUCT]).toEqual({
        mastery: Math.round(100 * LEARNING_RATE),
        attempts: 1,
        bestScorePct: 100,
        lastStudiedOn: toDateKey(),
      });
    });

    it('accumulates the per-question tally that weights future papers', async () => {
      const store = createStore();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 50,
          answers: [
            { questionId: 'irs-q1', correct: true },
            { questionId: 'irs-q2', correct: false },
          ],
        }),
      );
      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 50,
          answers: [{ questionId: 'irs-q1', correct: false }],
        }),
      );

      expect(store.getState().progress.questionHistory).toEqual({
        'irs-q1': { right: 1, wrong: 1 },
        'irs-q2': { right: 0, wrong: 1 },
      });
    });

    it('queues the missed questions and leaves the answered ones out', async () => {
      const store = createStore();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 50,
          answers: [
            { questionId: 'irs-q1', correct: true },
            { questionId: 'irs-q2', correct: false },
          ],
        }),
      );

      const { queue } = store.getState().review;
      expect(queue).toHaveLength(1);
      expect(queue[0]).toMatchObject({
        id: 'irs-q2',
        productId: PRODUCT,
        step: 0,
        lapses: 1,
      });
    });

    it('leaves the review queue empty when spaced repetition is off', async () => {
      const store = createStore();
      withSpacedRepetition(store, false);

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 0,
          answers: [{ questionId: 'irs-q1', correct: false }],
        }),
      );

      expect(store.getState().review.queue).toEqual([]);
      // The tally is kept either way: it drives question selection, which is
      // not what the spaced-repetition setting turns off.
      expect(store.getState().progress.questionHistory['irs-q1']).toEqual({
        right: 0,
        wrong: 1,
      });
    });

    it('persists mastery, history and the queue together', async () => {
      const store = createStore();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 80,
          answers: [{ questionId: 'irs-q1', correct: false }],
        }),
      );

      await expect(stored(STORAGE_KEYS.progress)).resolves.toEqual(
        store.getState().progress.byProduct,
      );
      await expect(stored(STORAGE_KEYS.questionHistory)).resolves.toEqual({
        'irs-q1': { right: 0, wrong: 1 },
      });
      await expect(stored(STORAGE_KEYS.reviewQueue)).resolves.toEqual(
        store.getState().review.queue,
      );
    });

    it('resolves with the achievements the sitting earned', async () => {
      const store = createStore();

      const earned = await store
        .dispatch(
          completeSession({
            productId: PRODUCT,
            scorePct: 100,
            answers: [{ questionId: 'irs-q1', correct: true }],
          }),
        )
        .unwrap();

      expect(earned).toEqual(['first-quiz', 'perfect-score']);
      expect(store.getState().progress.unlockedAchievementIds).toEqual([
        'first-quiz',
        'perfect-score',
      ]);
    });

    // The results screen announces what it is handed, so an achievement earned
    // three sittings ago must not be announced a fourth time.
    it('resolves with only the achievements that are new', async () => {
      const store = createStore();
      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 50,
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      const earned = await store
        .dispatch(
          completeSession({
            productId: PRODUCT,
            scorePct: 100,
            answers: [{ questionId: 'irs-q2', correct: true }],
          }),
        )
        .unwrap();

      expect(earned).toEqual(['perfect-score']);
      expect(store.getState().progress.unlockedAchievementIds).toEqual([
        'first-quiz',
        'perfect-score',
      ]);
    });

    it('persists the unlocked achievements when something is earned', async () => {
      const store = createStore();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 100,
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      await expect(stored(STORAGE_KEYS.achievements)).resolves.toEqual([
        'first-quiz',
        'perfect-score',
      ]);
    });

    it('skips the achievement write when nothing new was earned', async () => {
      const store = createStore();
      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 100,
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      const setItem = jest.spyOn(AsyncStorage, 'setItem');
      setItem.mockClear();

      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 100,
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      const keysWritten = setItem.mock.calls.map(([key]) => key);
      expect(keysWritten).not.toContain(STORAGE_KEYS.achievements);
      expect(keysWritten).toContain(STORAGE_KEYS.progress);
    });

    it('carries an empty sitting through without recording answers', async () => {
      const store = createStore();

      const earned = await store
        .dispatch(completeSession({ productId: PRODUCT, scorePct: 0, answers: [] }))
        .unwrap();

      expect(earned).toEqual(['first-quiz']);
      expect(store.getState().progress.questionHistory).toEqual({});
      expect(store.getState().progress.byProduct[PRODUCT].attempts).toBe(1);
    });
  });

  describe('completeReviewSession', () => {
    /** Puts `irs-q1` in the queue the way a missed quiz question would. */
    async function queueOneMiss(store: AppStore): Promise<void> {
      await store.dispatch(
        completeSession({
          productId: PRODUCT,
          scorePct: 0,
          answers: [{ questionId: 'irs-q1', correct: false }],
        }),
      );
    }

    it('promotes a queued question that is answered correctly', async () => {
      const store = createStore();
      await queueOneMiss(store);

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      expect(store.getState().review.queue[0]).toMatchObject({
        id: 'irs-q1',
        step: 1,
      });
    });

    it('records the answer in the question history', async () => {
      const store = createStore();
      await queueOneMiss(store);

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      expect(store.getState().progress.questionHistory['irs-q1']).toEqual({
        right: 1,
        wrong: 1,
      });
    });

    // Mastery measures a full paper on one product; scattered review questions
    // are not that measurement, so the record must come back untouched.
    it('leaves product mastery exactly as it was', async () => {
      const store = createStore();
      await queueOneMiss(store);
      const before = store.getState().progress.byProduct[PRODUCT];

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      expect(store.getState().progress.byProduct[PRODUCT]).toEqual(before);
    });

    it('resets a queued question that is missed again and counts the lapse', async () => {
      const store = createStore();
      await queueOneMiss(store);

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'irs-q1', correct: false }],
        }),
      );

      expect(store.getState().review.queue[0]).toMatchObject({
        id: 'irs-q1',
        step: 0,
        lapses: 2,
      });
    });

    it('persists the history and the queue', async () => {
      const store = createStore();
      await queueOneMiss(store);

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'irs-q1', correct: true }],
        }),
      );

      await expect(stored(STORAGE_KEYS.questionHistory)).resolves.toEqual({
        'irs-q1': { right: 1, wrong: 1 },
      });
      await expect(stored(STORAGE_KEYS.reviewQueue)).resolves.toEqual(
        store.getState().review.queue,
      );
    });

    // A queue restored from an older build can name a question the current
    // catalogue no longer has; it must not schedule against an unknown product.
    it('ignores a question the catalogue no longer knows', async () => {
      const store = createStore();

      await store.dispatch(
        completeReviewSession({
          answers: [{ questionId: 'retired-q99', correct: false }],
        }),
      );

      expect(store.getState().review.queue).toEqual([]);
    });
  });

  describe('toggleProductBookmark', () => {
    it('adds a bookmark and persists the list', async () => {
      const store = createStore();

      const updated = await store.dispatch(toggleProductBookmark(PRODUCT)).unwrap();

      expect(updated).toEqual([PRODUCT]);
      expect(store.getState().progress.bookmarkedProductIds).toEqual([PRODUCT]);
      await expect(stored(STORAGE_KEYS.bookmarks)).resolves.toEqual([PRODUCT]);
    });

    it('removes a bookmark on the second toggle and persists the removal', async () => {
      const store = createStore();
      await store.dispatch(toggleProductBookmark(PRODUCT));

      const updated = await store.dispatch(toggleProductBookmark(PRODUCT)).unwrap();

      expect(updated).toEqual([]);
      await expect(stored(STORAGE_KEYS.bookmarks)).resolves.toEqual([]);
    });

    it('keeps the other bookmarks when one is removed', async () => {
      const store = createStore();
      await store.dispatch(toggleProductBookmark(PRODUCT));
      await store.dispatch(toggleProductBookmark('swaption'));

      await store.dispatch(toggleProductBookmark(PRODUCT));

      await expect(stored(STORAGE_KEYS.bookmarks)).resolves.toEqual(['swaption']);
    });
  });
});
