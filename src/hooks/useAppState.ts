import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import type { AppDispatch, RootState } from '../store';

/** Typed `useDispatch` — knows about thunks. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Typed `useSelector` — infers `RootState` so selectors need no annotation. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useCurrentScreen() {
  return useAppSelector((state) => state.app.currentScreen);
}

export function useSelectedCategoryId() {
  return useAppSelector((state) => state.app.selectedCategoryId);
}

export function useSelectedProductId() {
  return useAppSelector((state) => state.app.selectedProductId);
}

export function useStreak() {
  return useAppSelector((state) => state.streak.currentStreak);
}
