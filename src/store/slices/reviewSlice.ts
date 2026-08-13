import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  scheduleLapse,
  schedulePromotion,
  type ReviewItem,
} from '../../utils/review';

export interface ReviewState {
  queue: ReviewItem[];
  loading: boolean;
}

export const initialReviewState: ReviewState = {
  queue: [],
  loading: false,
};

export interface ReviewResultPayload {
  questionId: string;
  productId: string;
  correct: boolean;
  /**
   * "Now" as epoch ms, passed in so the reducer stays pure and the tests can
   * schedule against a fixed date.
   */
  now: number;
}

/** See the note in `progressSlice` — slices never import thunks. */
const reviewSlice = createSlice({
  name: 'review',
  initialState: initialReviewState,
  reducers: {
    /**
     * Applies one answer to the queue.
     *
     * A wrong answer schedules the question (or resets it if already queued);
     * a right answer promotes a queued question to the next interval, or drops
     * it once it has graduated. A right answer on a question that was never
     * queued does nothing — only mistakes enter the queue.
     */
    applyReviewResult(state, action: PayloadAction<ReviewResultPayload>) {
      const { questionId, productId, correct, now } = action.payload;
      const date = new Date(now);
      const index = state.queue.findIndex((item) => item.id === questionId);
      const existing = index === -1 ? undefined : state.queue[index];

      if (!correct) {
        const scheduled = scheduleLapse(existing, questionId, productId, date);
        if (index === -1) {
          state.queue.push(scheduled);
        } else {
          state.queue[index] = scheduled;
        }
        return;
      }

      if (existing === undefined) {
        return;
      }

      const promoted = schedulePromotion(existing, date);
      if (promoted === null) {
        state.queue.splice(index, 1);
      } else {
        state.queue[index] = promoted;
      }
    },

    setReviewQueue(state, action: PayloadAction<ReviewItem[]>) {
      state.queue = action.payload;
    },

    setReviewLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    resetReview() {
      return { ...initialReviewState, queue: [] };
    },
  },
});

export const { applyReviewResult, setReviewQueue, setReviewLoading, resetReview } =
  reviewSlice.actions;

export default reviewSlice.reducer;
