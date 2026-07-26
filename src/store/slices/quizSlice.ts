import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface QuizFeedback {
  correct: boolean;
  explanation: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  /** Recorded answer per question id; `null` for questions not yet answered. */
  answers: Record<string, boolean | null>;
  /** True once the current question has been answered — locks the buttons. */
  isAnswered: boolean;
  feedback: QuizFeedback | null;
}

export interface RecordAnswerPayload {
  questionId: string;
  answer: boolean;
  correct: boolean;
  explanation: string;
}

export const initialQuizState: QuizState = {
  currentQuestionIndex: 0,
  score: 0,
  answers: {},
  isAnswered: false,
  feedback: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState: initialQuizState,
  reducers: {
    /** Clears all quiz progress. Used when starting or retrying a quiz. */
    resetQuiz() {
      return { ...initialQuizState, answers: {} };
    },
    /**
     * Records the answer to the current question. Ignored if the question has
     * already been answered, so a double tap cannot double-count the score.
     */
    recordAnswer(state, action: PayloadAction<RecordAnswerPayload>) {
      if (state.isAnswered) {
        return;
      }
      const { questionId, answer, correct, explanation } = action.payload;
      state.answers[questionId] = answer;
      state.isAnswered = true;
      state.feedback = { correct, explanation };
      if (correct) {
        state.score += 1;
      }
    },
    /** Advances to the next question and unlocks the answer buttons. */
    nextQuestion(state) {
      state.currentQuestionIndex += 1;
      state.isAnswered = false;
      state.feedback = null;
    },
  },
});

export const { resetQuiz, recordAnswer, nextQuestion } = quizSlice.actions;

export default quizSlice.reducer;
