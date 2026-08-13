import { useCallback, useMemo } from 'react';

import { getProductsByCategory, products, TOTAL_PRODUCTS } from '../data/products';
import {
  averageMastery,
  countMastered,
  emptyProgress,
  masteryBand,
  MASTERY_COMPLETE,
  type MasteryBand,
  type ProductProgress,
} from '../utils/mastery';
import { useAppSelector } from './useAppState';

export interface ProgressSummary {
  byProduct: Record<string, ProductProgress>;
  /** Products at or above the mastery threshold. */
  masteredCount: number;
  totalCount: number;
  /** Mean mastery across the whole catalogue, 0–100. */
  overallPercent: number;
  loading: boolean;
  progressFor: (productId: string) => ProductProgress;
  masteryFor: (productId: string) => number;
  bandFor: (productId: string) => MasteryBand;
  isProductMastered: (productId: string) => boolean;
  isProductStarted: (productId: string) => boolean;
  /** Mean mastery within one asset class, 0–100. */
  categoryPercent: (categoryId: string) => number;
  masteredInCategory: (categoryId: string) => number;
  /** Lifetime answer totals across every sitting. */
  questionsAnswered: number;
  questionsCorrect: number;
  accuracyPercent: number;
}

/**
 * Reads mastery rather than a completed list.
 *
 * "Completed" was a single bit: a product was done or it was not, and a user
 * who had scraped 2/5 looked identical to one who had aced it. Mastery keeps
 * the distinction, so everything here is derived from a number rather than
 * from set membership.
 */
export function useProgress(): ProgressSummary {
  const byProduct = useAppSelector((state) => state.progress.byProduct);
  const questionHistory = useAppSelector((state) => state.progress.questionHistory);
  const loading = useAppSelector((state) => state.progress.loading);

  const allIds = useMemo(() => products.map((product) => product.id), []);

  const progressFor = useCallback(
    (productId: string) => byProduct[productId] ?? emptyProgress,
    [byProduct],
  );

  const masteryFor = useCallback(
    (productId: string) => byProduct[productId]?.mastery ?? 0,
    [byProduct],
  );

  const bandFor = useCallback(
    (productId: string) => masteryBand(masteryFor(productId)),
    [masteryFor],
  );

  const isProductMastered = useCallback(
    (productId: string) => masteryFor(productId) >= MASTERY_COMPLETE,
    [masteryFor],
  );

  const isProductStarted = useCallback(
    (productId: string) => (byProduct[productId]?.attempts ?? 0) > 0,
    [byProduct],
  );

  const categoryPercent = useCallback(
    (categoryId: string) =>
      averageMastery(
        getProductsByCategory(categoryId).map((product) => product.id),
        byProduct,
      ),
    [byProduct],
  );

  const masteredInCategory = useCallback(
    (categoryId: string) =>
      countMastered(
        getProductsByCategory(categoryId).map((product) => product.id),
        byProduct,
      ),
    [byProduct],
  );

  const totals = useMemo(
    () =>
      Object.values(questionHistory).reduce(
        (acc, stat) => ({
          answered: acc.answered + stat.right + stat.wrong,
          correct: acc.correct + stat.right,
        }),
        { answered: 0, correct: 0 },
      ),
    [questionHistory],
  );

  return {
    byProduct,
    masteredCount: countMastered(allIds, byProduct),
    totalCount: TOTAL_PRODUCTS,
    overallPercent: averageMastery(allIds, byProduct),
    loading,
    progressFor,
    masteryFor,
    bandFor,
    isProductMastered,
    isProductStarted,
    categoryPercent,
    masteredInCategory,
    questionsAnswered: totals.answered,
    questionsCorrect: totals.correct,
    accuracyPercent:
      totals.answered === 0
        ? 0
        : Math.round((totals.correct / totals.answered) * 100),
  };
}
