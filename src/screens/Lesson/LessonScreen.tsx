import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { getCategoryById } from '../../data/categories';
import { getProductById } from '../../data/products';
import { useHapticsEnabled, useSelectedProductId } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { colors, getCategoryColors, spacing, typography } from '../../theme';
import { track } from '../../utils/analytics';
import { hapticSelection } from '../../utils/haptics';
import {
  shouldClaimSwipe,
  stepAfterSwipe,
  swipeIntent,
  SWIPE_FOLLOW_RATIO,
} from '../../utils/swipe';
import { LessonStep } from './components/LessonStep';
import { StepIndicator } from './components/StepIndicator';

export function LessonScreen() {
  const productId = useSelectedProductId();
  const { goToProduct, goToQuiz } = useNavigation();
  const haptics = useHapticsEnabled();

  // The step index is view-local: it never needs to survive leaving the screen,
  // and every entry point resets it to the first step.
  const [stepIndex, setStepIndex] = useState(0);
  const drag = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    setStepIndex(0);
  }, [productId]);

  const product = getProductById(productId);
  const category = getCategoryById(product?.categoryId ?? null);
  const { accent, soft } = getCategoryColors(category?.id ?? '');
  const totalSteps = product?.lessons.length ?? 0;

  const settle = useCallback(() => {
    Animated.spring(drag, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  }, [drag]);

  const goToStep = useCallback(
    (next: number) => {
      if (next < 0 || next > totalSteps - 1) {
        settle();
        return;
      }
      hapticSelection(haptics);
      setStepIndex(next);
      settle();
    },
    [haptics, settle, totalSteps],
  );

  /**
   * Swiping between steps.
   *
   * `PanResponder` rather than a gesture library: the app has no other gesture
   * needs, and claiming the responder only after a clearly horizontal drag lets
   * the card's own ScrollView keep vertical scrolling for long lesson text.
   * The rules themselves live in `utils/swipe.ts`, where they can be tested
   * without fabricating touch histories.
   */
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) => shouldClaimSwipe(gesture),
        onPanResponderMove: (_event, gesture) => {
          drag.setValue({ x: gesture.dx * SWIPE_FOLLOW_RATIO, y: 0 });
        },
        onPanResponderRelease: (_event, gesture) => {
          const intent = swipeIntent(gesture);
          if (intent === 'none') {
            settle();
            return;
          }
          goToStep(stepAfterSwipe(intent, stepIndex, totalSteps));
        },
        onPanResponderTerminate: settle,
      }),
    [drag, goToStep, settle, stepIndex, totalSteps],
  );

  // A plain "Back" rather than the product's own name — the h2 heading right
  // below it already states that, and stacking the same name twice at the
  // top of the screen was pure repetition.
  const backLabel = 'Back';
  const backAccessibilityLabel = `Back to ${product?.name ?? category?.name ?? 'product'}`;
  const goBack = () => {
    if (product !== undefined) {
      goToProduct(product.id);
    }
  };

  if (product === undefined || product.lessons.length === 0) {
    return (
      <SafeAreaWrapper testID="lesson-screen">
        <BackButton
          label={backLabel}
          accessibilityLabel={backAccessibilityLabel}
          onPress={goBack}
          testID="lesson-back"
        />
        <Text style={styles.productName}>This lesson is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;
  const lesson = product.lessons[stepIndex];

  const handleStartQuiz = () => {
    track({ name: 'lesson_completed', productId: product.id });
    goToQuiz(product.id);
  };

  return (
    <SafeAreaWrapper testID="lesson-screen">
      <View style={styles.body}>
        <BackButton
          label={backLabel}
          accessibilityLabel={backAccessibilityLabel}
          onPress={goBack}
          testID="lesson-back"
        />
        <Text accessibilityRole="header" style={styles.productName}>
          {product.name}
        </Text>

        <StepIndicator
          testID="lesson-steps"
          totalSteps={totalSteps}
          currentStep={stepIndex}
          color={accent}
        />

        <Animated.View
          testID="lesson-swipe-area"
          style={[styles.card, { transform: [{ translateX: drag.x }] }]}
          {...responder.panHandlers}
        >
          <LessonStep
            lesson={lesson}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            accent={accent}
            accentSoft={soft}
          />
        </Animated.View>

        <Text style={styles.hint}>Swipe between steps</Text>

        <View style={styles.actions}>
          <Button
            testID="lesson-back-step"
            label="Back"
            variant="secondary"
            flex={1}
            disabled={isFirstStep}
            onPress={() => goToStep(stepIndex - 1)}
          />
          {isLastStep ? (
            <Button
              testID="lesson-start-quiz"
              label="Take the quiz →"
              flex={2}
              onPress={handleStartQuiz}
            />
          ) : (
            <Button
              testID="lesson-next-step"
              label="Next"
              flex={2}
              onPress={() => goToStep(stepIndex + 1)}
            />
          )}
        </View>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  productName: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: 14,
  },
  card: {
    flex: 1,
  },
  hint: {
    ...typography.micro,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 14,
  },
});
