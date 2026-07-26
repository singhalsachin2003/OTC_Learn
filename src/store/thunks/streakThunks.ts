import { createAsyncThunk } from '@reduxjs/toolkit';

import { toDateKey } from '../../utils/formatters';
import {
  loadStreak as readStreak,
  saveStreak as writeStreak,
  type StoredStreak,
} from '../../utils/storage';
import type { RootState } from '../index';
import { setStreak, updateStreak } from '../slices/streakSlice';

/** Hydrates the streak from AsyncStorage during app start-up. */
export const loadStreak = createAsyncThunk<
  StoredStreak | null,
  void,
  { state: RootState }
>('streak/loadStreak', async (_arg, { dispatch }) => {
  const stored = await readStreak();
  if (stored !== null) {
    dispatch(setStreak(stored));
  }
  return stored;
});

/** Persists the streak currently held in the store. */
export const saveStreak = createAsyncThunk<
  StoredStreak,
  void,
  { state: RootState }
>('streak/saveStreak', async (_arg, { getState }) => {
  const { currentStreak, lastActivityDate } = getState().streak;
  const snapshot: StoredStreak = { currentStreak, lastActivityDate };
  await writeStreak(snapshot);
  return snapshot;
});

/**
 * Registers today's activity: applies the streak rules, then persists.
 * Safe to call on every app launch — same-day calls leave the count unchanged.
 */
export const recordActivity = createAsyncThunk<
  StoredStreak,
  string | undefined,
  { state: RootState }
>('streak/recordActivity', async (dateKey, { dispatch, getState }) => {
  const today = dateKey ?? toDateKey();
  const { lastActivityDate } = getState().streak;

  dispatch(updateStreak(today));

  // Only touch storage when the day actually changed.
  if (lastActivityDate === today) {
    const { currentStreak } = getState().streak;
    return { currentStreak, lastActivityDate };
  }

  const { currentStreak } = getState().streak;
  const snapshot: StoredStreak = { currentStreak, lastActivityDate: today };
  await writeStreak(snapshot);
  return snapshot;
});
