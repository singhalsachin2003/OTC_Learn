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

/** A product quiz, or a run through the review queue. */
export type QuizMode = 'product' | 'review';

export interface QuizState {
  /**
   * The paper for this sitting: drawn from the bank, order shuffled, options
   * shuffled. Held in state rather than recomputed, so a re-render cannot
   * reshuffle the questions under the user mid-quiz.
   */
  questions: Question[];
  mode: QuizMode;
  productId: string | null;
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
      const { questions, mode, productId, startedAt } = action.payload;
      // `answers` is overridden for the same reason `questions` is: spreading
      // the initial state alone would hand out the module singleton, and immer
      // freezes whatever it is given — permanently, for every later reader.
      return {
        ...initialQuizState,
        questions,
        answers: [],
        mode,
        productId,
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
