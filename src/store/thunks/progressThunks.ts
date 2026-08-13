import { createAsyncThunk } from '@reduxjs/toolkit';

import { earnedAchievements } from '../../data/achievements';
import { getQuestionById } from '../../data/products';
import { toDateKey } from '../../utils/formatters';
import {
  saveAchievements,
  saveBookmarks,
  saveProgressMap,
  saveQuestionHistory,
  saveReviewQueue,
} from '../../utils/storage';
import type { RootState } from '../index';
import {
  recordQuestionResult,
  recordSession,
  toggleBookmark,
  unlockAchievements,
} from '../slices/progressSlice';
import { applyReviewResult } from '../slices/reviewSlice';

export interface SessionAnswer {
  questionId: string;
  correct: boolean;
}

export interface CompleteSessionArg {
  productId: string;
  scorePct: number;
  answers: SessionAnswer[];
}

/** Lifetime answer totals, derived from the per-question tallies. */
function answerTotals(history: RootState['progress']['questionHistory']) {
  return Object.values(history).reduce(
    (totals, stat) => ({
      answered: totals.answered + stat.right + stat.wrong,
      correct: totals.correct + stat.right,
    }),
    { answered: 0, correct: 0 },
  );
}

/**
 * Folds a finished sitting into every store that cares about it: mastery, the
 * per-question history that weights future papers, the review queue, and any
 * achievement the result unlocks. Persists all four, then resolves with the
 * achievements that were newly earned so the results screen can announce them.
 *
 * One thunk rather than four dispatched from the screen, because these have to
 * move together — a mastery bump saved without its question history would
 * change which questions come up next in a way the score does not justify.
 */
export const completeSession = createAsyncThunk<
  string[],
  CompleteSessionArg,
  { state: RootState }
>('progress/completeSession', async (arg, { getState, dispatch }) => {
  const { productId, scorePct, answers } = arg;
  const today = toDateKey();
  const now = Date.now();

  dispatch(recordSession({ productId, scorePct, today }));

  const spacedRepetition = getState().settings.settings.spacedRepetition;
  for (const answer of answers) {
    dispatch(recordQuestionResult(answer));
    if (spacedRepetition) {
      dispatch(
        applyReviewResult({
          questionId: answer.questionId,
          productId,
          correct: answer.correct,
          now,
        }),
      );
    }
  }

  const after = getState();
  const totals = answerTotals(after.progress.questionHistory);
  const alreadyUnlocked = after.progress.unlockedAchievementIds;
  const earned = earnedAchievements({
    progress: after.progress.byProduct,
    currentStreak: after.streak.currentStreak,
    longestStreak: after.streak.longestStreak,
    questionsAnswered: totals.answered,
    questionsCorrect: totals.correct,
    lastSessionPct: scorePct,
  });
  const fresh = earned.filter((id) => !alreadyUnlocked.includes(id));

  // Dispatched even when empty: it doubles as "this sitting earned nothing",
  // which is what clears the last sitting's badges off the results screen.
  dispatch(unlockAchievements(fresh));

  const final = getState();
  await Promise.all([
    saveProgressMap(final.progress.byProduct),
    saveQuestionHistory(final.progress.questionHistory),
    saveReviewQueue(final.review.queue),
    fresh.length > 0
      ? saveAchievements(final.progress.unlockedAchievementIds)
      : Promise.resolve(true),
  ]);

  return fresh;
});

/**
 * The review-queue equivalent of `completeSession`.
 *
 * A review sitting updates the question history and reschedules each item, but
 * deliberately leaves product mastery alone: mastery measures how a full paper
 * on one product went, and four scattered questions across four products is not
 * that measurement. Getting review questions right still shows up — it empties
 * the queue and shifts which questions future papers draw.
 */
export const completeReviewSession = createAsyncThunk<
  void,
  { answers: SessionAnswer[] },
  { state: RootState }
>('progress/completeReviewSession', async ({ answers }, { getState, dispatch }) => {
  const now = Date.now();

  for (const answer of answers) {
    dispatch(recordQuestionResult(answer));
    const owner = getQuestionById(answer.questionId)?.product.id;
    if (owner !== undefined) {
      dispatch(
        applyReviewResult({
          questionId: answer.questionId,
          productId: owner,
          correct: answer.correct,
          now,
        }),
      );
    }
  }

  const final = getState();
  await Promise.all([
    saveQuestionHistory(final.progress.questionHistory),
    saveReviewQueue(final.review.queue),
  ]);
});

/** Toggles a bookmark and persists the new list. */
export const toggleProductBookmark = createAsyncThunk<
  string[],
  string,
  { state: RootState }
>('progress/toggleBookmark', async (productId, { getState, dispatch }) => {
  dispatch(toggleBookmark(productId));
  const updated = getState().progress.bookmarkedProductIds;
  await saveBookmarks(updated);
  return updated;
});
