import { useCallback, useMemo } from 'react';

import { getProductsByCategory, TOTAL_PRODUCTS } from '../data/products';
import { progressRatio } from '../utils/formatters';
import { useAppSelector } from './useAppState';

export interface ProgressSummary {
  completedProductIds: string[];
  completedCount: number;
  totalCount: number;
  /** 0–1, safe to use directly as a flex ratio. */
  ratio: number;
  loading: boolean;
  isProductComplete: (productId: string) => boolean;
  /** Number of completed products within one asset class. */
  completedInCategory: (categoryId: string) => number;
}

export function useProgress(): ProgressSummary {
  const completedProductIds = useAppSelector(
    (state) => state.progress.completedProductIds,
  );
  const loading = useAppSelector((state) => state.progress.loading);

  const completedSet = useMemo(
    () => new Set(completedProductIds),
    [completedProductIds],
  );

  const isProductComplete = useCallback(
    (productId: string) => completedSet.has(productId),
    [completedSet],
  );

  const completedInCategory = useCallback(
    (categoryId: string) =>
      getProductsByCategory(categoryId).filter((p) => completedSet.has(p.id))
        .length,
    [completedSet],
  );

  return {
    completedProductIds,
    completedCount: completedSet.size,
    totalCount: TOTAL_PRODUCTS,
    ratio: progressRatio(completedSet.size, TOTAL_PRODUCTS),
    loading,
    isProductComplete,
    completedInCategory,
  };
}
