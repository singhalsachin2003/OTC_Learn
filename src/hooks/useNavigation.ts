import { useCallback, useMemo } from 'react';

import {
  navigateToAchievements,
  navigateToCategory,
  navigateToGlossary,
  navigateToExam,
  navigateToHome,
  navigateToInsights,
  navigateToLesson,
  navigateToNotes,
  navigateToProduct,
  navigateToQuiz,
  navigateToResults,
  navigateToTab,
  type TabName,
} from '../store/slices/appSlice';
import { resetQuiz } from '../store/slices/quizSlice';
import { track } from '../utils/analytics';
import { hapticSelection } from '../utils/haptics';
import { useAppDispatch, useHapticsEnabled } from './useAppState';

export interface AppNavigation {
  goToTab: (tab: TabName) => void;
  goHome: () => void;
  goToCategory: (categoryId: string) => void;
  goToProduct: (productId: string) => void;
  goToLesson: (productId: string) => void;
  goToQuiz: (productId: string) => void;
  goToReviewQuiz: () => void;
  goToResults: () => void;
  goToGlossary: () => void;
  goToAchievements: () => void;
  goToInsights: () => void;
  goToExam: () => void;
  goToNotes: () => void;
  /** Enters a drawn exam paper. The draw itself happens in `useQuiz`. */
  goToExamQuiz: () => void;
}

/**
 * Screen transitions. Navigation lives in Redux (`app.currentScreen`), so these
 * are dispatch wrappers that also perform the state clean-up each transition
 * implies — e.g. leaving or entering a quiz always resets quiz state.
 */
export function useNavigation(): AppNavigation {
  const dispatch = useAppDispatch();
  const haptics = useHapticsEnabled();

  const goToTab = useCallback(
    (tab: TabName) => {
      hapticSelection(haptics);
      dispatch(resetQuiz());
      dispatch(navigateToTab(tab));
    },
    [dispatch, haptics],
  );

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

  const goToProduct = useCallback(
    (productId: string) => {
      dispatch(resetQuiz());
      dispatch(navigateToProduct(productId));
      track({ name: 'product_opened', productId });
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

  // The paper itself is drawn by `useQuiz`; this only moves the screen, so a
  // caller cannot accidentally start a quiz with an empty question list.
  const goToQuiz = useCallback(
    (productId: string) => {
      dispatch(navigateToQuiz());
      track({ name: 'quiz_started', productId });
    },
    [dispatch],
  );

  /**
   * A review sitting spans several products, so it carries no product id — and
   * reporting one would attribute the whole session to whichever product
   * happened to be selected last.
   */
  const goToReviewQuiz = useCallback(() => {
    dispatch(navigateToQuiz());
  }, [dispatch]);

  const goToResults = useCallback(() => {
    dispatch(navigateToResults());
  }, [dispatch]);

  const goToGlossary = useCallback(() => {
    dispatch(navigateToGlossary());
  }, [dispatch]);

  const goToAchievements = useCallback(() => {
    dispatch(navigateToAchievements());
  }, [dispatch]);

  const goToInsights = useCallback(() => {
    dispatch(navigateToInsights());
  }, [dispatch]);

  const goToExam = useCallback(() => {
    dispatch(navigateToExam());
  }, [dispatch]);

  const goToNotes = useCallback(() => {
    dispatch(navigateToNotes());
  }, [dispatch]);

  // Takes no product, for the same reason `goToReviewQuiz` does not: an exam
  // spans many products, so selecting one would misattribute the sitting.
  const goToExamQuiz = useCallback(() => {
    dispatch(navigateToQuiz());
  }, [dispatch]);

  return useMemo(
    () => ({
      goToTab,
      goHome,
      goToCategory,
      goToProduct,
      goToLesson,
      goToQuiz,
      goToReviewQuiz,
      goToResults,
      goToGlossary,
      goToAchievements,
      goToInsights,
      goToExam,
      goToExamQuiz,
      goToNotes,
    }),
    [
      goToTab,
      goHome,
      goToCategory,
      goToProduct,
      goToLesson,
      goToQuiz,
      goToReviewQuiz,
      goToResults,
      goToGlossary,
      goToAchievements,
      goToInsights,
      goToExam,
      goToExamQuiz,
      goToNotes,
    ],
  );
}
