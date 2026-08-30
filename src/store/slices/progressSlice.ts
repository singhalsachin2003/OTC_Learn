import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { ExamResult } from '../../utils/exam';
import { applySession, type ProductProgress } from '../../utils/mastery';
import type { QuestionStat } from '../../utils/quizSession';

export interface ProgressState {
  /** Product id → mastery record. Absent means never attempted. */
  byProduct: Record<string, ProductProgress>;
  /** Question id → lifetime right/wrong tally, used to weight future papers. */
  questionHistory: Record<string, QuestionStat>;
  bookmarkedProductIds: string[];
  unlockedAchievementIds: string[];
  /**
   * Finished practice exams, oldest first. Lives here rather than in its own
   * slice so `resetProgress` clears it with everything else — an exam history
   * that outlived a reset would report on progress that no longer exists.
   */
  examResults: ExamResult[];
  /**
   * Achievements earned by the sitting that just finished, so the results
   * screen can announce those and only those. Not persisted: it describes one
   * moment, and a badge already celebrated should not reappear on next launch.
   */
  recentlyUnlockedIds: string[];
  /** True while progress is being hydrated from AsyncStorage. */
  loading: boolean;
}

export const initialProgressState: ProgressState = {
  byProduct: {},
  questionHistory: {},
  bookmarkedProductIds: [],
  unlockedAchievementIds: [],
  examResults: [],
  recentlyUnlockedIds: [],
  loading: false,
};

export interface RecordSessionPayload {
  productId: string;
  scorePct: number;
  /** Local date key for today, resolved by the caller. */
  today: string;
}

/**
 * Slices never import thunks: the store's module graph flows one way
 * (thunks → slices), so hydration is applied by thunks dispatching these plain
 * reducers rather than via `extraReducers`. Importing the thunks here would
 * close a require cycle, which Metro warns about and which can leave one module
 * holding an uninitialized binding from the other.
 */
const progressSlice = createSlice({
  name: 'progress',
  initialState: initialProgressState,
  reducers: {
    /** Folds one finished session into the product's running mastery. */
    recordSession(state, action: PayloadAction<RecordSessionPayload>) {
      const { productId, scorePct, today } = action.payload;
      state.byProduct[productId] = applySession(
        state.byProduct[productId],
        scorePct,
        today,
      );
    },

    /** Accumulates one answer into the question's lifetime tally. */
    recordQuestionResult(
      state,
      action: PayloadAction<{ questionId: string; correct: boolean }>,
    ) {
      const { questionId, correct } = action.payload;
      const stat = state.questionHistory[questionId] ?? { right: 0, wrong: 0 };
      state.questionHistory[questionId] = {
        right: stat.right + (correct ? 1 : 0),
        wrong: stat.wrong + (correct ? 0 : 1),
      };
    },

    toggleBookmark(state, action: PayloadAction<string>) {
      const id = action.payload;
      const index = state.bookmarkedProductIds.indexOf(id);
      if (index === -1) {
        state.bookmarkedProductIds.push(id);
      } else {
        state.bookmarkedProductIds.splice(index, 1);
      }
    },

    /**
     * Records the achievements a sitting earned. Always dispatched at the end
     * of a session, including with an empty list — that is what clears the
     * previous sitting's badges off the results screen.
     */
    unlockAchievements(state, action: PayloadAction<string[]>) {
      for (const id of action.payload) {
        if (!state.unlockedAchievementIds.includes(id)) {
          state.unlockedAchievementIds.push(id);
        }
      }
      state.recentlyUnlockedIds = action.payload;
    },

    /** Appends a finished sitting. Exams accumulate; nothing revises one. */
    recordExamResult(state, action: PayloadAction<ExamResult>) {
      state.examResults.push(action.payload);
    },

    setExamResults(state, action: PayloadAction<ExamResult[]>) {
      state.examResults = action.payload;
    },

    setProgress(state, action: PayloadAction<Record<string, ProductProgress>>) {
      state.byProduct = action.payload;
    },

    setQuestionHistory(state, action: PayloadAction<Record<string, QuestionStat>>) {
      state.questionHistory = action.payload;
    },

    setBookmarks(state, action: PayloadAction<string[]>) {
      state.bookmarkedProductIds = [...new Set(action.payload)];
    },

    setAchievements(state, action: PayloadAction<string[]>) {
      state.unlockedAchievementIds = [...new Set(action.payload)];
    },

    setProgressLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    /**
     * Wipes everything this slice owns — backs "reset progress".
     *
     * Every array is rebuilt rather than taken from the spread, for the reason
     * `quizSlice.startQuiz` spells out: a returned state is what immer freezes,
     * so spreading alone would hand out — and permanently freeze — the module
     * singletons that `initialProgressState` holds, for every later reader.
     */
    resetProgress(): ProgressState {
      return {
        ...initialProgressState,
        byProduct: {},
        questionHistory: {},
        bookmarkedProductIds: [],
        unlockedAchievementIds: [],
        examResults: [],
        recentlyUnlockedIds: [],
      };
    },
  },
});

export const {
  recordSession,
  recordQuestionResult,
  recordExamResult,
  setExamResults,
  toggleBookmark,
  unlockAchievements,
  setProgress,
  setQuestionHistory,
  setBookmarks,
  setAchievements,
  setProgressLoading,
  resetProgress,
} = progressSlice.actions;

export default progressSlice.reducer;
