import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { daysBetween, toDateKey } from '../../utils/formatters';

export interface StreakState {
  currentStreak: number;
  /** Last day the user was active, as `YYYY-MM-DD` in local time. */
  lastActivityDate: string | null;
}

export const initialStreakState: StreakState = {
  currentStreak: 0,
  lastActivityDate: null,
};

/** See the note in `progressSlice` — slices never import thunks. */
const streakSlice = createSlice({
  name: 'streak',
  initialState: initialStreakState,
  reducers: {
    /**
     * Applies the streak rules for a day of activity:
     * same day → unchanged, next day → +1, any longer gap → reset to 1.
     *
     * The date defaults to today, but can be passed explicitly (tests, and any
     * caller that already resolved "today").
     */
    updateStreak: {
      reducer(state, action: PayloadAction<string>) {
        const today = action.payload;
        const last = state.lastActivityDate;

        if (last === today) {
          return;
        }

        const gap = last === null ? Number.NaN : daysBetween(last, today);
        state.currentStreak = gap === 1 ? state.currentStreak + 1 : 1;
        state.lastActivityDate = today;
      },
      prepare(dateKey?: string) {
        return { payload: dateKey ?? toDateKey() };
      },
    },
    /** Replaces the streak wholesale — used when hydrating from storage. */
    setStreak(state, action: PayloadAction<StreakState>) {
      state.currentStreak = action.payload.currentStreak;
      state.lastActivityDate = action.payload.lastActivityDate;
    },
  },
});

export const { updateStreak, setStreak } = streakSlice.actions;

export default streakSlice.reducer;
