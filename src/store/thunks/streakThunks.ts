import { createAsyncThunk } from '@reduxjs/toolkit';

import { toDateKey } from '../../utils/formatters';
import {
  saveStreak as writeStreak,
  saveStudyDays as writeStudyDays,
  type StoredStreak,
} from '../../utils/storage';
import type { RootState } from '../index';
import { updateStreak } from '../slices/streakSlice';

/** Snapshot of what the streak slice currently holds, in storage shape. */
function snapshot(state: RootState): StoredStreak {
  const { currentStreak, longestStreak, lastActivityDate } = state.streak;
  return { currentStreak, longestStreak, lastActivityDate };
}

/** Persists the streak currently held in the store. */
export const saveStreak = createAsyncThunk<
  StoredStreak,
  void,
  { state: RootState }
>('streak/saveStreak', async (_arg, { getState }) => {
  const stored = snapshot(getState());
  await writeStreak(stored);
  return stored;
});

/**
 * Registers today's activity: applies the streak rules, then persists.
 *
 * Safe to call on every app launch — a same-day call leaves the count
 * unchanged. The study-day list is still written on a repeat call the first
 * time a given day is recorded, which is what the week strip reads.
 */
export const recordActivity = createAsyncThunk<
  StoredStreak,
  string | undefined,
  { state: RootState }
>('streak/recordActivity', async (dateKey, { dispatch, getState }) => {
  const today = dateKey ?? toDateKey();
  const before = getState().streak;
  const dayIsNew = !before.studyDays.includes(today);
  const streakChanged = before.lastActivityDate !== today;

  dispatch(updateStreak(today));

  const after = getState();
  const stored = snapshot(after);

  await Promise.all([
    streakChanged ? writeStreak(stored) : Promise.resolve(true),
    dayIsNew ? writeStudyDays(after.streak.studyDays) : Promise.resolve(true),
  ]);

  return stored;
});
