import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore } from '../../src/store';
import { setStreak } from '../../src/store/slices/streakSlice';
import { recordActivity, saveStreak } from '../../src/store/thunks/streakThunks';
import { STORAGE_KEYS } from '../../src/utils/storage';

/** What the streak key holds, parsed back out. */
async function storedStreak(): Promise<unknown> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.streak);
  return raw === null ? null : JSON.parse(raw);
}

async function storedStudyDays(): Promise<unknown> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.studyDays);
  return raw === null ? null : JSON.parse(raw);
}

describe('streak thunks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  describe('recordActivity', () => {
    it('starts a streak on first activity and persists it', async () => {
      const store = createStore();

      await store.dispatch(recordActivity('2026-07-25'));

      expect(store.getState().streak).toEqual({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-07-25',
        studyDays: ['2026-07-25'],
      });
      await expect(storedStreak()).resolves.toEqual({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-07-25',
      });
      await expect(storedStudyDays()).resolves.toEqual(['2026-07-25']);
    });

    it('increments across consecutive days', async () => {
      const store = createStore();

      await store.dispatch(recordActivity('2026-07-25'));
      await store.dispatch(recordActivity('2026-07-26'));

      expect(store.getState().streak.currentStreak).toBe(2);
      await expect(storedStudyDays()).resolves.toEqual([
        '2026-07-25',
        '2026-07-26',
      ]);
    });

    it('resets the streak to one after a gap', async () => {
      const store = createStore();

      await store.dispatch(recordActivity('2026-07-25'));
      await store.dispatch(recordActivity('2026-07-26'));
      await store.dispatch(recordActivity('2026-07-30'));

      expect(store.getState().streak.currentStreak).toBe(1);
    });

    it('keeps the longest run after the current one is broken', async () => {
      const store = createStore();

      await store.dispatch(recordActivity('2026-07-25'));
      await store.dispatch(recordActivity('2026-07-26'));
      await store.dispatch(recordActivity('2026-07-30'));

      expect(store.getState().streak.longestStreak).toBe(2);
      await expect(storedStreak()).resolves.toMatchObject({
        currentStreak: 1,
        longestStreak: 2,
      });
    });

    // Called on every launch, so the no-op path has to stay cheap: nothing
    // about the day has changed, so nothing is written.
    it('writes nothing when the same day is recorded twice', async () => {
      const store = createStore();
      await store.dispatch(recordActivity('2026-07-25'));

      // `AsyncStorage.setItem` is already a jest.fn in the global mock, so the
      // spy is that same function with every earlier test's calls still on it.
      const setItem = jest.spyOn(AsyncStorage, 'setItem');
      setItem.mockClear();

      await store.dispatch(recordActivity('2026-07-25'));

      expect(setItem).not.toHaveBeenCalled();
      expect(store.getState().streak.currentStreak).toBe(1);
    });

    // A hydrated install knows its streak but may not have the day in its
    // study-day list — the week strip reads that list, so it still gets written
    // even though the streak count itself is unchanged.
    it('writes the study days but not the streak for an already-counted day', async () => {
      const store = createStore();
      store.dispatch(
        setStreak({
          currentStreak: 3,
          longestStreak: 5,
          lastActivityDate: '2026-07-25',
        }),
      );

      await store.dispatch(recordActivity('2026-07-25'));

      expect(store.getState().streak.currentStreak).toBe(3);
      await expect(storedStreak()).resolves.toBeNull();
      await expect(storedStudyDays()).resolves.toEqual(['2026-07-25']);
    });

    it('resumes a hydrated streak rather than restarting it', async () => {
      const store = createStore();
      store.dispatch(
        setStreak({
          currentStreak: 3,
          longestStreak: 3,
          lastActivityDate: '2026-07-25',
          studyDays: ['2026-07-25'],
        }),
      );

      await store.dispatch(recordActivity('2026-07-26'));

      expect(store.getState().streak.currentStreak).toBe(4);
      expect(store.getState().streak.longestStreak).toBe(4);
    });

    it('defaults to today when no date key is passed', async () => {
      const store = createStore();

      await store.dispatch(recordActivity(undefined));

      expect(store.getState().streak.currentStreak).toBe(1);
      expect(store.getState().streak.lastActivityDate).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
    });

    it('resolves with the streak it persisted', async () => {
      const store = createStore();

      const stored = await store.dispatch(recordActivity('2026-07-25')).unwrap();

      expect(stored).toEqual({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '2026-07-25',
      });
    });

    // A failed write must not reject the thunk: losing a day of streak is not a
    // reason to show the user an error on launch.
    it('resolves even when the streak write fails', async () => {
      // One-shot: spying on a property that is already a jest.fn hands back
      // that same mock, so a lasting implementation would survive
      // `restoreAllMocks` and silently swallow every later test's writes.
      jest
        .spyOn(AsyncStorage, 'setItem')
        .mockRejectedValueOnce(new Error('disk full'));

      const store = createStore();

      await expect(
        store.dispatch(recordActivity('2026-07-25')).unwrap(),
      ).resolves.toMatchObject({ currentStreak: 1 });
    });
  });

  describe('saveStreak', () => {
    it('persists the streak currently held in memory', async () => {
      const store = createStore();
      store.dispatch(
        setStreak({
          currentStreak: 6,
          longestStreak: 11,
          lastActivityDate: '2026-07-25',
        }),
      );

      await store.dispatch(saveStreak());

      await expect(storedStreak()).resolves.toEqual({
        currentStreak: 6,
        longestStreak: 11,
        lastActivityDate: '2026-07-25',
      });
    });

    // The study-day list is owned by `recordActivity`; a bare save must not
    // touch it, or a save before the first activity would blank the week strip.
    it('leaves the study-day list alone', async () => {
      const store = createStore();
      await store.dispatch(recordActivity('2026-07-25'));
      await AsyncStorage.removeItem(STORAGE_KEYS.studyDays);

      await store.dispatch(saveStreak());

      await expect(storedStudyDays()).resolves.toBeNull();
    });
  });
});
