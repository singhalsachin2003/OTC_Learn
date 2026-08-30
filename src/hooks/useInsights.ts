import { useMemo } from 'react';

import { categories } from '../data/categories';
import { getQuestionById, products } from '../data/products';
import {
  accuracyByCategory,
  accuracyByStep,
  masteryDistribution,
  rankWeakest,
  recommendations,
  studyConsistency,
  type CategoryAccuracy,
  type MasteryDistribution,
  type QuestionFacts,
  type Recommendation,
  type StepAccuracy,
  type StudyConsistency,
} from '../utils/insights';
import { useAppSelector } from './useAppState';

/**
 * Wires the catalogue into the pure insights engine.
 *
 * `utils/insights.ts` resolves question ids through an injected function so it
 * can be tested without loading the content; this is the one place that
 * function is the real catalogue.
 */

/** How many weak spots to surface. More than three reads as a list of failures. */
const WEAKEST_LIMIT = 3;
const RECOMMENDATION_LIMIT = 3;
const CONSISTENCY_WINDOW_DAYS = 14;

export interface Insights {
  accuracyByCategory: CategoryAccuracy[];
  weakestCategories: CategoryAccuracy[];
  accuracyByStep: StepAccuracy[];
  weakestSteps: StepAccuracy[];
  distribution: MasteryDistribution;
  consistency: StudyConsistency;
  recommendations: Recommendation[];
  /** True until enough has been answered for any ranking to mean anything. */
  tooEarly: boolean;
}

function resolveQuestion(questionId: string): QuestionFacts | undefined {
  const entry = getQuestionById(questionId);
  if (entry === undefined) {
    return undefined;
  }
  return {
    categoryId: entry.product.categoryId,
    productId: entry.product.id,
    step: entry.question.step,
  };
}

export function useInsights(): Insights {
  const byProduct = useAppSelector((state) => state.progress.byProduct);
  const questionHistory = useAppSelector((state) => state.progress.questionHistory);
  const studyDays = useAppSelector((state) => state.streak.studyDays);

  const categoryIds = useMemo(() => categories.map((category) => category.id), []);
  const productIds = useMemo(() => products.map((product) => product.id), []);
  const candidates = useMemo(
    () =>
      products.map((product) => ({
        id: product.id,
        categoryId: product.categoryId,
        foundational: product.difficulty === 'foundational',
      })),
    [],
  );

  return useMemo(() => {
    const byCategory = accuracyByCategory(
      questionHistory,
      resolveQuestion,
      categoryIds,
    );
    const bySteps = accuracyByStep(questionHistory, resolveQuestion);

    return {
      accuracyByCategory: byCategory,
      weakestCategories: rankWeakest(byCategory, WEAKEST_LIMIT),
      accuracyByStep: bySteps,
      weakestSteps: rankWeakest(bySteps, WEAKEST_LIMIT),
      distribution: masteryDistribution(productIds, byProduct),
      consistency: studyConsistency(studyDays, CONSISTENCY_WINDOW_DAYS),
      recommendations: recommendations(candidates, byProduct, RECOMMENDATION_LIMIT),
      // A ranking needs a confident bucket somewhere to rank. Until then the
      // screen shows what has been done rather than conclusions drawn from it.
      tooEarly: !byCategory.some((bucket) => bucket.confident),
    };
  }, [byProduct, questionHistory, studyDays, categoryIds, productIds, candidates]);
}
