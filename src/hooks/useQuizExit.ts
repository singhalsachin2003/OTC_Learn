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
 * Leaves the quiz, confirming first when there are answers to lose.
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
  const { goToCategory, goToTab, goToExam } = useNavigation();
  const mode = useAppSelector((state) => state.quiz.mode);
  const hasAnswers = useAppSelector(
    (state) => state.quiz.answers.length > 0 || state.quiz.isAnswered,
  );

  return useCallback(() => {
    // A review sitting and an exam each span several products, so neither has
    // a single category to fall back to — they return where they were started
    // from, matching what the results screen's own back control does.
    const leave = () => {
      if (mode === 'exam') {
        goToExam();
        return;
      }
      if (mode === 'review') {
        goToTab('review');
        return;
      }
      const product = getProductById(productId);
      goToCategory(categoryId ?? product?.categoryId ?? '');
    };

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
  }, [categoryId, productId, goToCategory, goToTab, goToExam, hasAnswers, mode]);
}
