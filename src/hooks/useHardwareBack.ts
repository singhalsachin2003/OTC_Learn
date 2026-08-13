import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import { getProductById } from '../data/products';
import { isTabScreen } from '../store/slices/appSlice';
import {
  useCurrentScreen,
  useCurrentTab,
  useSelectedCategoryId,
  useSelectedProductId,
} from './useAppState';
import { useNavigation } from './useNavigation';
import { useQuizExit } from './useQuizExit';

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
  const tab = useCurrentTab();
  const categoryId = useSelectedCategoryId();
  const productId = useSelectedProductId();
  const { goHome, goToTab, goToCategory, goToProduct } = useNavigation();
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

      // Screens reached from Profile return to it.
      if (screen === 'glossary' || screen === 'achievements') {
        goToTab(tab === 'profile' ? 'profile' : tab);
        return true;
      }

      if (screen === 'category') {
        goHome();
        return true;
      }

      const product = getProductById(productId);

      // The lesson and the results both sit under a product, so back goes to
      // the product page rather than skipping past it to the category.
      if (screen === 'lesson' || screen === 'results') {
        if (product !== undefined) {
          goToProduct(product.id);
          return true;
        }
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
    tab,
    categoryId,
    productId,
    goHome,
    goToTab,
    goToCategory,
    goToProduct,
    exitQuiz,
  ]);
}
