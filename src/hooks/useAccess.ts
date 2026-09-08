import { useCallback, useMemo } from 'react';

import { getProductById, getQuestionById } from '../data/products';
import type { Product, Question } from '../data/types';
import {
  canOpenCategory,
  canOpenDepth,
  canOpenProduct,
  canOpenQuestion,
  openQuizFor,
  paywallApplies,
  premiumCategoryCount,
} from '../utils/access';
import { useAppSelector } from './useAppState';

export interface AppAccess {
  /** Whether anything is locked for this user at all. */
  paywalled: boolean;
  categoryLocked: (categoryId: string) => boolean;
  productLocked: (productId: string) => boolean;
  /** Whether the paid depth on an otherwise free product is out of reach. */
  depthLocked: (productId: string) => boolean;
  /** Whether a single question may be shown — asked by the review queue. */
  questionLocked: (questionId: string) => boolean;
  /** The questions a quiz on this product may draw from, for this reader. */
  openQuiz: (product: Product) => Question[];
  /** How many asset classes a subscription would add, for the paywall's copy. */
  premiumCategories: number;
}

/**
 * What this user may open.
 *
 * The rules themselves are pure and live in `utils/access.ts`; this only feeds
 * them the store. Screens ask `productLocked(id)` rather than reading the four
 * state fields and reasoning about them, so the guards that make the paywall
 * safe — inert without a key, inert with nothing premium to sell, permanent
 * for existing installs — cannot be forgotten at one call site and honoured at
 * the rest.
 */
export function useAccess(): AppAccess {
  const access = useAppSelector((state) => state.access);

  const paywalled = paywallApplies(access);

  const categoryLocked = useCallback(
    (categoryId: string) => !canOpenCategory(categoryId, access),
    [access],
  );

  const productLocked = useCallback(
    (productId: string) => !canOpenProduct(getProductById(productId), access),
    [access],
  );

  const depthLocked = useCallback(
    (productId: string) =>
      getProductById(productId)?.depth !== undefined && !canOpenDepth(access),
    [access],
  );

  const questionLocked = useCallback(
    (questionId: string) => !canOpenQuestion(getQuestionById(questionId), access),
    [access],
  );

  const openQuiz = useCallback(
    (product: Product) => openQuizFor(product, access),
    [access],
  );

  return useMemo(
    () => ({
      paywalled,
      categoryLocked,
      productLocked,
      depthLocked,
      questionLocked,
      openQuiz,
      premiumCategories: premiumCategoryCount(),
    }),
    [
      paywalled,
      categoryLocked,
      productLocked,
      depthLocked,
      questionLocked,
      openQuiz,
    ],
  );
}
