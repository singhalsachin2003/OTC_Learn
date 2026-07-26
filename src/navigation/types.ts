import type { ScreenName } from '../store/slices/appSlice';

export type { ScreenName };

/**
 * Parameters each screen reads. They live in `appSlice` rather than being
 * passed as route params, so this map documents the contract rather than
 * feeding a navigator's generics.
 */
export interface ScreenParams {
  home: undefined;
  category: { categoryId: string };
  lesson: { productId: string };
  quiz: { productId: string };
  results: { productId: string };
}

/** Order used for deep-link resolution and back-navigation fallbacks. */
export const SCREEN_ORDER: ScreenName[] = [
  'home',
  'category',
  'lesson',
  'quiz',
  'results',
];
