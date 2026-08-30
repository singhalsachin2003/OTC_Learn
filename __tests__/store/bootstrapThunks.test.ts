import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore } from '../../src/store';
import { toggleBookmark } from '../../src/store/slices/progressSlice';
import {
  hydrateApp,
  resetEverything,
} from '../../src/store/thunks/bootstrapThunks';
import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import { defaultSettings, STORAGE_KEYS } from '../../src/utils/storage';

/**
 * The app's start-up path.
 *
 * Every individual loader is tested in `storage.test.ts`; what is tested here
 * is the orchestration — that migrations finish before anything reads the v2
 * keys, that all seven stores end up populated, and that a failure part-way
 * through still clears the loading flags. This is the one code path every
 * single launch runs, and the only one where getting the *order* wrong shows
 * up as silently empty state rather than as an error.
 */

async function write(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

const record = {
  mastery: 55,
  attempts: 2,
  bestScorePct: 80,
  lastStudiedOn: '2026-08-01',
  updatedAt: Date.parse('2026-08-01T20:00:00'),
};

const queued = {
  id: 'irs-q1',
  productId: 'irs',
  step: 0,
  dueOn: '2026-08-14',
  lapses: 1,
  updatedAt: Date.parse('2026-08-13T20:00:00'),
};

describe('hydrateApp', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('leaves a fresh install on its defaults', async () => {
    const store = createStore();

    await store.dispatch(hydrateApp());

    const state = store.getState();
    expect(state.progress.byProduct).toEqual({});
    expect(state.review.queue).toEqual([]);
    expect(state.streak.currentStreak).toBe(0);
    expect(state.settings.settings).toEqual(defaultSettings);
    expect(state.settings.name).toBeNull();
    expect(state.settings.hydrated).toBe(true);
  });

  it('installs everything that was persisted', async () => {
    await write(STORAGE_KEYS.schemaVersion, 2);
    await write(STORAGE_KEYS.progress, { irs: record });
    await write(STORAGE_KEYS.questionHistory, { 'irs-q1': { right: 2, wrong: 1 } });
    await write(STORAGE_KEYS.reviewQueue, [queued]);
    await write(STORAGE_KEYS.streak, {
      currentStreak: 4,
      longestStreak: 9,
      lastActivityDate: '2026-08-12',
    });
    await write(STORAGE_KEYS.studyDays, ['2026-08-11', '2026-08-12']);
    await write(STORAGE_KEYS.profile, { name: 'Sachin' });
    await write(STORAGE_KEYS.settings, { ...defaultSettings, timedQuizzes: true });
    await write(STORAGE_KEYS.bookmarks, ['cds']);
    await write(STORAGE_KEYS.achievements, ['first-quiz']);

    const store = createStore();
    await store.dispatch(hydrateApp());
    const state = store.getState();

    expect(state.progress.byProduct.irs).toEqual(record);
    expect(state.progress.questionHistory['irs-q1']).toEqual({
      right: 2,
      wrong: 1,
    });
    expect(state.review.queue).toEqual([queued]);
    expect(state.streak).toMatchObject({
      currentStreak: 4,
      longestStreak: 9,
      lastActivityDate: '2026-08-12',
      studyDays: ['2026-08-11', '2026-08-12'],
    });
    expect(state.settings.name).toBe('Sachin');
    expect(state.settings.settings.timedQuizzes).toBe(true);
    expect(state.progress.bookmarkedProductIds).toEqual(['cds']);
    expect(state.progress.unlockedAchievementIds).toEqual(['first-quiz']);
  });

  /**
   * The ordering guarantee. A v1 install has no `progress` key at all — only
   * the legacy completed list — so if hydration read the v2 keys before the
   * migration wrote them, the user would launch to an empty app and their
   * progress would then be overwritten by the empty state on the next save.
   */
  it('migrates a v1 install before reading it', async () => {
    await write(STORAGE_KEYS.completedProducts, ['irs', 'cds']);

    const store = createStore();
    await store.dispatch(hydrateApp());

    const { byProduct } = store.getState().progress;
    expect(Object.keys(byProduct).sort()).toEqual(['cds', 'irs']);
    expect(byProduct.irs.mastery).toBe(MASTERY_COMPLETE);
    // And the legacy key is gone, so this is a one-time conversion.
    await expect(
      AsyncStorage.getItem(STORAGE_KEYS.completedProducts),
    ).resolves.toBeNull();
  });

  it('clears the loading flags once it has finished', async () => {
    const store = createStore();

    await store.dispatch(hydrateApp());

    expect(store.getState().progress.loading).toBe(false);
    expect(store.getState().review.loading).toBe(false);
  });

  /**
   * A read failure must not leave the app stuck behind a spinner. The loaders
   * swallow their own errors, so this drives the failure through `runMigrations`
   * — the one awaited call before the `try` block's work — to prove the
   * `finally` actually runs.
   */
  it('still clears the loading flags when start-up fails', async () => {
    // Restored by hand rather than with `mockRestore`. `AsyncStorage.getItem`
    // is already a jest.fn from the module mock, so `jest.spyOn` returns that
    // same mock rather than wrapping it — `mockRestore` would leave it stubbed
    // and every read in every later test in this file would silently fail.
    const getItem = jest.mocked(AsyncStorage.getItem);
    const realImplementation = getItem.getMockImplementation();
    getItem.mockRejectedValue(new Error('storage unavailable'));

    try {
      const store = createStore();
      await store.dispatch(hydrateApp());

      expect(store.getState().progress.loading).toBe(false);
      expect(store.getState().review.loading).toBe(false);
      expect(store.getState().settings.hydrated).toBe(true);
    } finally {
      getItem.mockImplementation(realImplementation!);
    }
  });

  it('is safe to run twice', async () => {
    await write(STORAGE_KEYS.progress, { irs: record });
    const store = createStore();

    await store.dispatch(hydrateApp());
    await store.dispatch(hydrateApp());

    expect(store.getState().progress.byProduct.irs).toEqual(record);
  });
});

describe('resetEverything', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('empties both the device and the store', async () => {
    await write(STORAGE_KEYS.progress, { irs: record });
    await write(STORAGE_KEYS.reviewQueue, [queued]);
    await write(STORAGE_KEYS.profile, { name: 'Sachin' });
    const store = createStore();
    await store.dispatch(hydrateApp());
    expect(store.getState().progress.byProduct.irs).toBeDefined();

    await store.dispatch(resetEverything());

    const state = store.getState();
    expect(state.progress.byProduct).toEqual({});
    expect(state.progress.bookmarkedProductIds).toEqual([]);
    expect(state.review.queue).toEqual([]);
    expect(state.streak.currentStreak).toBe(0);
    expect(state.settings.name).toBeNull();
    expect(state.settings.settings).toEqual(defaultSettings);

    await expect(AsyncStorage.getItem(STORAGE_KEYS.progress)).resolves.toBeNull();
    await expect(AsyncStorage.getItem(STORAGE_KEYS.profile)).resolves.toBeNull();
  });

  /** A reset is only real if it survives the next launch. */
  it('leaves nothing for a later hydration to restore', async () => {
    const store = createStore();
    store.dispatch(toggleBookmark('irs'));
    await store.dispatch(resetEverything());

    const fresh = createStore();
    await fresh.dispatch(hydrateApp());

    expect(fresh.getState().progress.bookmarkedProductIds).toEqual([]);
    expect(fresh.getState().progress.byProduct).toEqual({});
  });

  it('marks settings hydrated so the UI does not wait on a second load', async () => {
    const store = createStore();

    await store.dispatch(resetEverything());

    expect(store.getState().settings.hydrated).toBe(true);
  });
});
