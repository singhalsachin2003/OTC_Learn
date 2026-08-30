import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Question } from '../../data/types';

export interface QuizFeedback {
  correct: boolean;
  explanation: string;
  /** The right answer, spelled out — shown when the user got it wrong. */
  correctLabel: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  /** `boolean` for a true/false question, an option index for a choice. */
  answer: boolean | number;
  correct: boolean;
  /** Which lesson step this question tested, for the results breakdown. */
  step: number;
}

/** A product quiz, a run through the review queue, or a practice exam. */
export type QuizMode = 'product' | 'review' | 'exam';

export interface QuizState {
  /**
   * The paper for this sitting: drawn from the bank, order shuffled, options
   * shuffled. Held in state rather than recomputed, so a re-render cannot
   * reshuffle the questions under the user mid-quiz.
   */
  questions: Question[];
  mode: QuizMode;
  productId: string | null;
  /**
   * Which scope an exam was drawn for — a category id, or `EXAM_SCOPE_ALL`.
   * Null for the other two modes, which are not scoped: a product quiz already
   * names its product, and a review draws from whatever happens to be due.
   */
  scopeId: string | null;
  /** Milliseconds allowed, or null when the sitting is not timed. */
  timeLimitMs: number | null;
  currentIndex: number;
  score: number;
  answers: QuizAnswerRecord[];
  /** True once the current question has been answered — locks the controls. */
  isAnswered: boolean;
  feedback: QuizFeedback | null;
  /** Epoch ms when the sitting began, or null if not started. */
  startedAt: number | null;
  /** Elapsed ms at the moment the last question was answered. */
  finishedInMs: number | null;
}

export const initialQuizState: QuizState = {
  questions: [],
  mode: 'product',
  productId: null,
  scopeId: null,
  timeLimitMs: null,
  currentIndex: 0,
  score: 0,
  answers: [],
  isAnswered: false,
  feedback: null,
  startedAt: null,
  finishedInMs: null,
};

export interface StartQuizPayload {
  questions: Question[];
  mode: QuizMode;
  productId: string | null;
  scopeId?: string | null;
  timeLimitMs?: number | null;
  /** Passed in rather than read here, so the reducer stays pure. */
  startedAt: number;
}

export interface RecordAnswerPayload {
  questionId: string;
  answer: boolean | number;
  correct: boolean;
  step: number;
  explanation: string;
  correctLabel: string;
}

const quizSlice = createSlice({
  name: 'quiz',
  initialState: initialQuizState,
  reducers: {
    /** Clears the sitting. Used when leaving a quiz or before starting one. */
    resetQuiz() {
      return { ...initialQuizState, questions: [], answers: [] };
    },

    /** Installs a freshly drawn paper and starts the clock. */
    startQuiz(_state, action: PayloadAction<StartQuizPayload>) {
      const {
        questions,
        mode,
        productId,
        scopeId = null,
        timeLimitMs = null,
        startedAt,
      } = action.payload;
      // `answers` is overridden for the same reason `questions` is: spreading
      // the initial state alone would hand out the module singleton, and immer
      // freezes whatever it is given — permanently, for every later reader.
      return {
        ...initialQuizState,
        questions,
        answers: [],
        mode,
        productId,
        scopeId,
        timeLimitMs,
        startedAt,
      };
    },

    /**
     * Records the answer to the current question. Ignored if the question has
     * already been answered, so a double tap cannot double-count the score.
     */
    recordAnswer(state, action: PayloadAction<RecordAnswerPayload>) {
      if (state.isAnswered) {
        return;
      }
      const { questionId, answer, correct, step, explanation, correctLabel } =
        action.payload;
      state.answers.push({ questionId, answer, correct, step });
      state.isAnswered = true;
      state.feedback = { correct, explanation, correctLabel };
      if (correct) {
        state.score += 1;
      }
    },

    /** Advances to the next question and unlocks the controls. */
    nextQuestion(state) {
      state.currentIndex += 1;
      state.isAnswered = false;
      state.feedback = null;
    },

    /** Stamps the elapsed time once the last question has been answered. */
    finishQuiz(state, action: PayloadAction<number>) {
      state.finishedInMs =
        state.startedAt === null ? null : action.payload - state.startedAt;
    },
  },
});

export const { resetQuiz, startQuiz, recordAnswer, nextQuestion, finishQuiz } =
  quizSlice.actions;

export default quizSlice.reducer;
