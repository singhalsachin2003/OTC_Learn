import { useCallback } from 'react';

import { getProductById } from '../data/products';
import type { QuizQuestion } from '../data/types';
import { nextQuestion, recordAnswer } from '../store/slices/quizSlice';
import type { QuizFeedback } from '../store/slices/quizSlice';
import { completeProduct } from '../store/thunks/progressThunks';
import { track } from '../utils/analytics';
import { useNavigation } from './useNavigation';
import {
  useAppDispatch,
  useAppSelector,
  useSelectedProductId,
} from './useAppState';

export interface QuizController {
  question: QuizQuestion | null;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  isAnswered: boolean;
  feedback: QuizFeedback | null;
  isLastQuestion: boolean;
  /** 0–1 share of questions already completed. */
  progress: number;
  answer: (value: boolean) => void;
  advance: () => void;
}

/**
 * Drives the active quiz: reads the current question from the selected product
 * and exposes the two actions the screen needs.
 */
export function useQuiz(): QuizController {
  const dispatch = useAppDispatch();
  const { goToResults } = useNavigation();
  const productId = useSelectedProductId();
  const quiz = useAppSelector((state) => state.quiz);

  const product = getProductById(productId);
  const questions = product?.quiz ?? [];
  const totalQuestions = questions.length;
  const questionIndex = Math.min(
    quiz.currentQuestionIndex,
    Math.max(0, totalQuestions - 1),
  );
  const question = questions[questionIndex] ?? null;
  const isLastQuestion = totalQuestions > 0 && questionIndex === totalQuestions - 1;

  const answer = useCallback(
    (value: boolean) => {
      if (question === null || quiz.isAnswered) {
        return;
      }
      const correct = value === question.correctAnswer;
      dispatch(
        recordAnswer({
          questionId: question.id,
          answer: value,
          correct,
          explanation: question.explanation,
        }),
      );
      if (productId !== null) {
        track({
          name: 'quiz_answered',
          productId,
          questionId: question.id,
          correct,
        });
      }
    },
    [dispatch, question, quiz.isAnswered, productId],
  );

  const advance = useCallback(() => {
    if (!quiz.isAnswered) {
      return;
    }
    if (!isLastQuestion) {
      dispatch(nextQuestion());
      return;
    }

    // Finishing the quiz marks the product complete. `completeProduct` is a
    // no-op on retries, so the score shown is always the latest attempt while
    // completion is recorded only once.
    if (productId !== null) {
      void dispatch(completeProduct(productId));
      track({
        name: 'quiz_completed',
        productId,
        score: quiz.score,
        total: totalQuestions,
      });
    }
    goToResults();
  }, [
    dispatch,
    goToResults,
    isLastQuestion,
    productId,
    quiz.isAnswered,
    quiz.score,
    totalQuestions,
  ]);

  return {
    question,
    questionIndex,
    totalQuestions,
    score: quiz.score,
    isAnswered: quiz.isAnswered,
    feedback: quiz.feedback,
    isLastQuestion,
    progress: totalQuestions === 0 ? 0 : questionIndex / totalQuestions,
    answer,
    advance,
  };
}
