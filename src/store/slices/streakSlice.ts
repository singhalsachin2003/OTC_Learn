import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { daysBetween, toDateKey } from '../../utils/formatters';

/**
 * Days on which the user studied, most recent last. Capped so a long-lived
 * install cannot grow this list without bound; a year is far more than the week
 * strip and the profile ever read.
 */
const MAX_STUDY_DAYS = 365;

export interface StreakState {
  currentStreak: number;
  /** Best run ever, so a broken streak still leaves something to beat. */
  longestStreak: number;
  /** Last day the user was active, as `YYYY-MM-DD` in local time. */
  lastActivityDate: string | null;
  studyDays: string[];
}

export const initialStreakState: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  studyDays: [],
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

        if (!state.studyDays.includes(today)) {
          state.studyDays.push(today);
          if (state.studyDays.length > MAX_STUDY_DAYS) {
            state.studyDays.splice(0, state.studyDays.length - MAX_STUDY_DAYS);
          }
        }

        if (last === today) {
          return;
        }

        const gap = last === null ? Number.NaN : daysBetween(last, today);
        state.currentStreak = gap === 1 ? state.currentStreak + 1 : 1;
        state.lastActivityDate = today;
        state.longestStreak = Math.max(state.longestStreak, state.currentStreak);
      },
      prepare(dateKey?: string) {
        return { payload: dateKey ?? toDateKey() };
      },
    },

    /** Replaces the streak wholesale — used when hydrating from storage. */
    setStreak(
      state,
      action: PayloadAction<
        Omit<StreakState, 'studyDays'> & { studyDays?: string[] }
      >,
    ) {
      state.currentStreak = action.payload.currentStreak;
      state.longestStreak = action.payload.longestStreak;
      state.lastActivityDate = action.payload.lastActivityDate;
      if (action.payload.studyDays !== undefined) {
        state.studyDays = action.payload.studyDays;
      }
    },

    setStudyDays(state, action: PayloadAction<string[]>) {
      state.studyDays = [...new Set(action.payload)].sort();
    },

    resetStreak() {
      return { ...initialStreakState, studyDays: [] };
    },
  },
});

export const { updateStreak, setStreak, setStudyDays, resetStreak } =
  streakSlice.actions;

export default streakSlice.reducer;
