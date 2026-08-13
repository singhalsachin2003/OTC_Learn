import { useCallback } from 'react';

import { getProductById, getQuestionById } from '../data/products';
import type { Question } from '../data/types';
import {
  finishQuiz,
  nextQuestion,
  recordAnswer,
  startQuiz,
  type QuizAnswerRecord,
  type QuizFeedback,
  type QuizMode,
} from '../store/slices/quizSlice';
import {
  completeReviewSession,
  completeSession,
} from '../store/thunks/progressThunks';
import { track } from '../utils/analytics';
import { hapticImpact, hapticSuccess, hapticWarning } from '../utils/haptics';
import {
  buildSession,
  correctAnswerLabel,
  isCorrectAnswer,
} from '../utils/quizSession';
import { dueItems } from '../utils/review';
import { shuffled, shuffleOptions } from '../utils/shuffle';
import {
  useAppDispatch,
  useAppSelector,
  useHapticsEnabled,
  useSettings,
} from './useAppState';
import { useNavigation } from './useNavigation';

export interface QuizController {
  question: Question | null;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  isAnswered: boolean;
  feedback: QuizFeedback | null;
  isLastQuestion: boolean;
  /** 0–1 share of questions already completed. */
  progress: number;
  answers: QuizAnswerRecord[];
  mode: QuizMode;
  startedAt: number | null;
  /** Draws a fresh paper for a product and starts the clock. */
  start: (productId: string) => void;
  /** Draws a paper from whatever is due in the review queue. */
  startReview: () => void;
  /** `boolean` for true/false, an option index for multiple choice. */
  answer: (value: boolean | number) => void;
  advance: () => void;
}

/**
 * Drives the active quiz.
 *
 * The paper is drawn once, into the store, rather than being derived on each
 * render: selection and shuffling are random, so a derived paper would reorder
 * itself on any re-render and move the question out from under the user.
 */
export function useQuiz(): QuizController {
  const dispatch = useAppDispatch();
  const { goToResults } = useNavigation();
  const quiz = useAppSelector((state) => state.quiz);
  const questionHistory = useAppSelector((state) => state.progress.questionHistory);
  const reviewQueue = useAppSelector((state) => state.review.queue);
  const settings = useSettings();
  const haptics = useHapticsEnabled();

  const totalQuestions = quiz.questions.length;
  const questionIndex = Math.min(
    quiz.currentIndex,
    Math.max(0, totalQuestions - 1),
  );
  const question = quiz.questions[questionIndex] ?? null;
  const isLastQuestion = totalQuestions > 0 && questionIndex === totalQuestions - 1;

  const start = useCallback(
    (productId: string) => {
      const product = getProductById(productId);
      if (product === undefined) {
        return;
      }
      const questions = buildSession(product.quiz, {
        size: settings.sessionSize,
        history: questionHistory,
      });
      dispatch(
        startQuiz({
          questions,
          mode: 'product',
          productId,
          startedAt: Date.now(),
        }),
      );
    },
    [dispatch, questionHistory, settings.sessionSize],
  );

  const startReview = useCallback(() => {
    const due = dueItems(reviewQueue);
    // Resolve ids back to questions, dropping any whose question no longer
    // exists — a release that removes a question must not strand the queue.
    const questions = due
      .map((item) => getQuestionById(item.id)?.question)
      .filter((found): found is Question => found !== undefined);

    if (questions.length === 0) {
      return;
    }

    const paper = shuffled(questions.slice(0, settings.sessionSize)).map((q) =>
      shuffleOptions(q),
    );

    track({ name: 'review_started', dueCount: due.length });
    dispatch(
      startQuiz({
        questions: paper,
        mode: 'review',
        productId: null,
        startedAt: Date.now(),
      }),
    );
  }, [dispatch, reviewQueue, settings.sessionSize]);

  const answer = useCallback(
    (value: boolean | number) => {
      if (question === null || quiz.isAnswered) {
        return;
      }
      const correct = isCorrectAnswer(question, value);

      if (correct) {
        hapticSuccess(haptics);
      } else {
        hapticWarning(haptics);
      }

      dispatch(
        recordAnswer({
          questionId: question.id,
          answer: value,
          correct,
          step: question.step,
          explanation: question.explanation,
          correctLabel: correctAnswerLabel(question),
        }),
      );

      const owner = quiz.productId ?? getQuestionById(question.id)?.product.id;
      if (owner !== undefined) {
        track({
          name: 'quiz_answered',
          productId: owner,
          questionId: question.id,
          correct,
        });
      }
    },
    [dispatch, question, quiz.isAnswered, quiz.productId, haptics],
  );

  const advance = useCallback(() => {
    if (!quiz.isAnswered) {
      return;
    }
    if (!isLastQuestion) {
      dispatch(nextQuestion());
      return;
    }

    const now = Date.now();
    dispatch(finishQuiz(now));
    hapticImpact(haptics);

    // `quiz.score` already counts the final answer: `recordAnswer` ran before
    // this, and the last question cannot be advanced past until it is answered.
    const scorePct =
      totalQuestions === 0 ? 0 : Math.round((quiz.score / totalQuestions) * 100);
    const answers = quiz.answers.map((record) => ({
      questionId: record.questionId,
      correct: record.correct,
    }));

    if (quiz.mode === 'review') {
      void dispatch(completeReviewSession({ answers }));
    } else if (quiz.productId !== null) {
      void dispatch(
        completeSession({ productId: quiz.productId, scorePct, answers }),
      );
      track({
        name: 'quiz_completed',
        productId: quiz.productId,
        score: quiz.score,
        total: totalQuestions,
      });
    }

    goToResults();
  }, [
    dispatch,
    goToResults,
    haptics,
    isLastQuestion,
    quiz.answers,
    quiz.isAnswered,
    quiz.mode,
    quiz.productId,
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
    answers: quiz.answers,
    mode: quiz.mode,
    startedAt: quiz.startedAt,
    start,
    startReview,
    answer,
    advance,
  };
}
