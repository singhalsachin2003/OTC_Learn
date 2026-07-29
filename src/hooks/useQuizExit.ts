import { useCallback } from 'react';
import { Alert } from 'react-native';

import { getProductById } from '../data/products';
import {
  useAppSelector,
  useSelectedCategoryId,
  useSelectedProductId,
} from './useAppState';
import { useNavigation } from './useNavigation';

/**
 * Leaves the quiz for the product's asset class, confirming first when there
 * are answers to lose.
 *
 * Leaving always resets the quiz, so a part-finished attempt is discarded
 * silently otherwise — easy to do by accident with the hardware back button.
 * An untouched quiz has nothing to lose, so it exits without a prompt.
 *
 * Shared by the on-screen control and the hardware back button so the two
 * cannot drift apart.
 */
export function useQuizExit(): () => void {
  const categoryId = useSelectedCategoryId();
  const productId = useSelectedProductId();
  const { goToCategory } = useNavigation();
  const hasAnswers = useAppSelector(
    (state) => state.quiz.currentQuestionIndex > 0 || state.quiz.isAnswered,
  );

  return useCallback(() => {
    const product = getProductById(productId);
    const leave = () => goToCategory(categoryId ?? product?.categoryId ?? '');

    if (!hasAnswers) {
      leave();
      return;
    }

    Alert.alert(
      'Leave this quiz?',
      'Your answers so far will be discarded.',
      [
        { text: 'Keep going', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: leave },
      ],
      { cancelable: true },
    );
  }, [categoryId, productId, goToCategory, hasAnswers]);
}
