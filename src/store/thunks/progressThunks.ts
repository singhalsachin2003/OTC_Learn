import { createAsyncThunk } from '@reduxjs/toolkit';

import { loadCompletedProducts, saveCompletedProducts } from '../../utils/storage';
import type { RootState } from '../index';
import {
  markProductComplete,
  setProgress,
  setProgressLoading,
} from '../slices/progressSlice';

/** Hydrates completed products from AsyncStorage during app start-up. */
export const loadProgress = createAsyncThunk<string[], void, { state: RootState }>(
  'progress/loadProgress',
  async (_arg, { dispatch }) => {
    dispatch(setProgressLoading(true));
    try {
      const stored = await loadCompletedProducts();
      dispatch(setProgress(stored));
      return stored;
    } finally {
      dispatch(setProgressLoading(false));
    }
  },
);

/** Persists an explicit list of completed product ids. */
export const saveProgress = createAsyncThunk<string[], string[]>(
  'progress/saveProgress',
  async (completed) => {
    await saveCompletedProducts(completed);
    return completed;
  },
);

/**
 * Marks a product complete and persists the result.
 *
 * No-ops when the product is already complete, which keeps quiz retries from
 * rewriting storage. Resolves to the list of completed ids after the update.
 */
export const completeProduct = createAsyncThunk<
  string[],
  string,
  { state: RootState }
>('progress/completeProduct', async (productId, { getState, dispatch }) => {
  if (getState().progress.completedProductIds.includes(productId)) {
    return getState().progress.completedProductIds;
  }
  dispatch(markProductComplete(productId));
  const updated = getState().progress.completedProductIds;
  await saveCompletedProducts(updated);
  return updated;
});
