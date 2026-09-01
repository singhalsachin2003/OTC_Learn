import { useCallback, useMemo } from 'react';

import { getProductById } from '../data/products';
import {
  canOpenCategory,
  canOpenProduct,
  lockedCategoryCount,
  paywallApplies,
} from '../utils/access';
import { useAppSelector } from './useAppState';

export interface AppAccess {
  /** Whether anything is locked for this user at all. */
  paywalled: boolean;
  categoryLocked: (categoryId: string) => boolean;
  productLocked: (productId: string) => boolean;
  /** How many asset classes a subscription would add, for the paywall's copy. */
  lockedCategories: number;
}

/**
 * What this user may open.
 *
 * The rules themselves are pure and live in `utils/access.ts`; this only feeds
 * them the store. Screens ask `productLocked(id)` rather than reading the three
 * state fields and reasoning about them, so the two guards that make the
 * paywall safe — inert without a key, permanent for existing installs — cannot
 * be forgotten at one call site and honoured at the rest.
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

  return useMemo(
    () => ({
      paywalled,
      categoryLocked,
      productLocked,
      lockedCategories: lockedCategoryCount(),
    }),
    [paywalled, categoryLocked, productLocked],
  );
}
