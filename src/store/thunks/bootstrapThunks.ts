import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  clearAll,
  loadAchievements,
  loadBookmarks,
  loadExamResults,
  loadNotes,
  loadProfile,
  loadProgressMap,
  loadQuestionHistory,
  loadReviewQueue,
  loadSettings,
  loadStreak,
  loadStudyDays,
  runMigrations,
} from '../../utils/storage';
import { clearNotes, setNotes } from '../slices/notesSlice';
import type { RootState } from '../index';
import {
  setAchievements,
  setExamResults,
  setBookmarks,
  setProgress,
  setProgressLoading,
  setQuestionHistory,
  resetProgress,
} from '../slices/progressSlice';
import {
  setReviewLoading,
  setReviewQueue,
  resetReview,
} from '../slices/reviewSlice';
import {
  setHydrated,
  setName,
  setSettings,
  resetSettings,
} from '../slices/settingsSlice';
import { setStreak, setStudyDays, resetStreak } from '../slices/streakSlice';

/**
 * Reads everything persisted and installs it in the store.
 *
 * Migrations run first and are awaited: a v1 install has its completed-product
 * list rewritten as mastery records before anything reads the v2 keys, so the
 * rest of this function never has to know which schema it is looking at.
 */
export const hydrateApp = createAsyncThunk<void, void, { state: RootState }>(
  'app/hydrate',
  async (_arg, { dispatch }) => {
    dispatch(setProgressLoading(true));
    dispatch(setReviewLoading(true));

    try {
      await runMigrations();

      const [
        progress,
        history,
        queue,
        streak,
        studyDays,
        profile,
        settings,
        bookmarks,
        unlocked,
        examResults,
        notes,
      ] = await Promise.all([
        loadProgressMap(),
        loadQuestionHistory(),
        loadReviewQueue(),
        loadStreak(),
        loadStudyDays(),
        loadProfile(),
        loadSettings(),
        loadBookmarks(),
        loadAchievements(),
        loadExamResults(),
        loadNotes(),
      ]);

      dispatch(setProgress(progress));
      dispatch(setQuestionHistory(history));
      dispatch(setReviewQueue(queue));
      dispatch(setStudyDays(studyDays));
      dispatch(setBookmarks(bookmarks));
      dispatch(setAchievements(unlocked));
      dispatch(setExamResults(examResults));
      dispatch(setNotes(notes));
      dispatch(setSettings(settings));
      dispatch(setName(profile.name));

      if (streak !== null) {
        dispatch(
          setStreak({
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastActivityDate: streak.lastActivityDate,
          }),
        );
      }
    } finally {
      dispatch(setProgressLoading(false));
      dispatch(setReviewLoading(false));
      dispatch(setHydrated(true));
    }
  },
);

/**
 * Wipes every trace of the user from the device and from memory.
 *
 * Storage is cleared before the slices are reset so that a failure part-way
 * through leaves the store still describing what is on disk, rather than
 * showing an empty app that repopulates on the next launch.
 */
export const resetEverything = createAsyncThunk<void, void, { state: RootState }>(
  'app/reset',
  async (_arg, { dispatch }) => {
    await clearAll();
    dispatch(resetProgress());
    dispatch(resetReview());
    dispatch(resetStreak());
    dispatch(resetSettings());
    dispatch(clearNotes());
  },
);
