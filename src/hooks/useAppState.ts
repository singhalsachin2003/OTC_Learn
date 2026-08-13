import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import type { AppDispatch, RootState } from '../store';

/** Typed `useDispatch` — knows about thunks. */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Typed `useSelector` — infers `RootState` so selectors need no annotation. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useCurrentScreen() {
  return useAppSelector((state) => state.app.currentScreen);
}

export function useCurrentTab() {
  return useAppSelector((state) => state.app.currentTab);
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

export function useLongestStreak() {
  return useAppSelector((state) => state.streak.longestStreak);
}

export function useStudyDays() {
  return useAppSelector((state) => state.streak.studyDays);
}

export function useSettings() {
  return useAppSelector((state) => state.settings.settings);
}

export function useUserName() {
  return useAppSelector((state) => state.settings.name);
}

/** Whether haptics should fire — read by every call site that buzzes. */
export function useHapticsEnabled() {
  return useAppSelector((state) => state.settings.settings.haptics);
}

export function useBookmarks() {
  return useAppSelector((state) => state.progress.bookmarkedProductIds);
}

export function useProductQuery() {
  return useAppSelector((state) => state.app.productQuery);
}
