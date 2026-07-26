import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore } from '../../src/store';
import {
  loadStreak,
  recordActivity,
  saveStreak,
} from '../../src/store/thunks/streakThunks';
import { STORAGE_KEYS } from '../../src/utils/storage';

describe('streak thunks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.restoreAllMocks();
  });

  it('hydrates a stored streak', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.streak,
      JSON.stringify({ currentStreak: 4, lastActivityDate: '2026-07-25' }),
    );

    const store = createStore();
    await store.dispatch(loadStreak());

    expect(store.getState().streak).toEqual({
      currentStreak: 4,
      lastActivityDate: '2026-07-25',
    });
  });

  it('leaves the initial state alone when nothing is stored', async () => {
    const store = createStore();
    await store.dispatch(loadStreak());

    expect(store.getState().streak).toEqual({
      currentStreak: 0,
      lastActivityDate: null,
    });
  });

  it('starts a streak on first activity and persists it', async () => {
    const store = createStore();
    await store.dispatch(recordActivity('2026-07-25'));

    expect(store.getState().streak).toEqual({
      currentStreak: 1,
      lastActivityDate: '2026-07-25',
    });
    await expect(AsyncStorage.getItem(STORAGE_KEYS.streak)).resolves.toBe(
      JSON.stringify({ currentStreak: 1, lastActivityDate: '2026-07-25' }),
    );
  });

  it('increments across consecutive days', async () => {
    const store = createStore();
    await store.dispatch(recordActivity('2026-07-25'));
    await store.dispatch(recordActivity('2026-07-26'));

    expect(store.getState().streak.currentStreak).toBe(2);
  });

  it('skips the storage write for repeat activity on the same day', async () => {
    const store = createStore();
    await store.dispatch(recordActivity('2026-07-25'));

    const setItem = jest.spyOn(AsyncStorage, 'setItem');
    setItem.mockClear();

    await store.dispatch(recordActivity('2026-07-25'));

    expect(setItem).not.toHaveBeenCalled();
    expect(store.getState().streak.currentStreak).toBe(1);
  });

  it('defaults to today when no date is passed', async () => {
    const store = createStore();
    await store.dispatch(recordActivity(undefined));

    expect(store.getState().streak.currentStreak).toBe(1);
    expect(store.getState().streak.lastActivityDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('persists the current in-memory streak on demand', async () => {
    const store = createStore();
    await store.dispatch(recordActivity('2026-07-25'));
    await AsyncStorage.clear();

    await store.dispatch(saveStreak());

    await expect(AsyncStorage.getItem(STORAGE_KEYS.streak)).resolves.toBe(
      JSON.stringify({ currentStreak: 1, lastActivityDate: '2026-07-25' }),
    );
  });

  it('resumes a stored streak rather than restarting it', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.streak,
      JSON.stringify({ currentStreak: 3, lastActivityDate: '2026-07-25' }),
    );

    const store = createStore();
    await store.dispatch(loadStreak());
    await store.dispatch(recordActivity('2026-07-26'));

    expect(store.getState().streak.currentStreak).toBe(4);
  });
});
