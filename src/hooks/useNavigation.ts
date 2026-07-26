import { useCallback, useMemo } from 'react';

import {
  navigateToCategory,
  navigateToHome,
  navigateToLesson,
  navigateToQuiz,
  navigateToResults,
} from '../store/slices/appSlice';
import { resetQuiz } from '../store/slices/quizSlice';
import { track } from '../utils/analytics';
import { useAppDispatch } from './useAppState';

export interface AppNavigation {
  goHome: () => void;
  goToCategory: (categoryId: string) => void;
  goToLesson: (productId: string) => void;
  goToQuiz: (productId: string) => void;
  goToResults: () => void;
}

/**
 * Screen transitions. Navigation lives in Redux (`app.currentScreen`), so these
 * are dispatch wrappers that also perform the state clean-up each transition
 * implies — e.g. leaving or entering a quiz always resets quiz state.
 */
export function useNavigation(): AppNavigation {
  const dispatch = useAppDispatch();

  const goHome = useCallback(() => {
    dispatch(resetQuiz());
    dispatch(navigateToHome());
  }, [dispatch]);

  const goToCategory = useCallback(
    (categoryId: string) => {
      dispatch(resetQuiz());
      dispatch(navigateToCategory(categoryId));
      track({ name: 'category_opened', categoryId });
    },
    [dispatch],
  );

  const goToLesson = useCallback(
    (productId: string) => {
      dispatch(resetQuiz());
      dispatch(navigateToLesson(productId));
      track({ name: 'lesson_started', productId });
    },
    [dispatch],
  );

  const goToQuiz = useCallback(
    (productId: string) => {
      dispatch(resetQuiz());
      dispatch(navigateToQuiz());
      track({ name: 'quiz_started', productId });
    },
    [dispatch],
  );

  const goToResults = useCallback(() => {
    dispatch(navigateToResults());
  }, [dispatch]);

  return useMemo(
    () => ({ goHome, goToCategory, goToLesson, goToQuiz, goToResults }),
    [goHome, goToCategory, goToLesson, goToQuiz, goToResults],
  );
}
