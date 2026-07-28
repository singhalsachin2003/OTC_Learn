import { useEffect } from 'react';
import { BackHandler } from 'react-native';

import { getProductById } from '../data/products';
import {
  useCurrentScreen,
  useSelectedCategoryId,
  useSelectedProductId,
} from './useAppState';
import { useNavigation } from './useNavigation';

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
  const { goHome, goToCategory } = useNavigation();

  useEffect(() => {
    function onBackPress() {
      if (screen === 'home') {
        return false;
      }

      if (screen === 'category') {
        goHome();
        return true;
      }

      // Lesson, quiz and results all go up to the product's asset class, the
      // same destination their on-screen back controls use — including the
      // fallback to the product's own category when nothing is selected.
      const product = getProductById(productId);
      goToCategory(categoryId ?? product?.categoryId ?? '');
      return true;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => subscription.remove();
  }, [screen, categoryId, productId, goHome, goToCategory]);
}
