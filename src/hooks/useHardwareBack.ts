import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import { getProductById } from '../data/products';
import { isTabScreen, type ScreenName } from '../store/slices/appSlice';
import {
  useAppSelector,
  useCurrentScreen,
  useSelectedCategoryId,
  useSelectedProductId,
} from './useAppState';
import { useNavigation } from './useNavigation';
import { useQuizExit } from './useQuizExit';

/** Detail screens whose in-app back control returns to the Profile tab. */
const PROFILE_DETAIL_SCREENS: readonly ScreenName[] = [
  'glossary',
  'achievements',
  'insights',
  'exam',
  'notes',
];

/**
 * Mirrors each screen's in-app back control on the Android hardware button.
 *
 * Navigation lives in Redux rather than a stack navigator, so there is no
 * history for the platform to unwind: without a listener the OS default runs
 * and back closes the app from any screen. Returning `false` on home keeps that
 * default, which is the right behaviour at the root of the flow.
 *
 * `BackHandler` is an inert stub on iOS and web, so this is safe to mount
 * unconditionally.
 */
export function useHardwareBack() {
  const screen = useCurrentScreen();
  const categoryId = useSelectedCategoryId();
  const productId = useSelectedProductId();
  const { goHome, goToTab, goToCategory, goToProduct, goToExam } = useNavigation();
  const mode = useAppSelector((state) => state.quiz.mode);
  const exitQuiz = useQuizExit();

  useEffect(() => {
    function onBackPress() {
      // Home is the root of the app: let the OS close it.
      if (screen === 'home') {
        return false;
      }

      // Any other tab root goes to Home first, so back always walks toward the
      // root rather than closing the app from a side tab.
      if (isTabScreen(screen)) {
        goHome();
        return true;
      }

      // A part-finished quiz confirms before discarding answers, so back goes
      // through the same exit the on-screen control uses.
      if (screen === 'quiz') {
        exitQuiz();
        return true;
      }

      // Screens reached from Profile return to it. Every one of them has to
      // be listed: anything not named here falls through to the category
      // branch below and backs out to a category the user never opened.
      if (PROFILE_DETAIL_SCREENS.includes(screen)) {
        goToTab('profile');
        return true;
      }

      if (screen === 'category') {
        goHome();
        return true;
      }

      const product = getProductById(productId);

      // Mirrors the results screen's own `results-back` control: an exam and a
      // review sitting each span many products, so neither has one to return
      // to, and falling through to the category branch below lands on "That
      // asset class is unavailable".
      if (screen === 'results') {
        if (mode === 'exam') {
          goToExam();
        } else if (mode === 'review' || product === undefined) {
          goToTab('review');
        } else {
          goToProduct(product.id);
        }
        return true;
      }

      // A lesson sits under a product, so back goes to the product page rather
      // than skipping past it to the category.
      if (screen === 'lesson' && product !== undefined) {
        goToProduct(product.id);
        return true;
      }

      goToCategory(categoryId ?? product?.categoryId ?? '');
      return true;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [
    screen,
    categoryId,
    productId,
    mode,
    goHome,
    goToTab,
    goToCategory,
    goToProduct,
    goToExam,
    exitQuiz,
  ]);
}
