import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { Button } from '../../components/ui/Button';
import { getCategoryById } from '../../data/categories';
import { getProductById } from '../../data/products';
import {
  useSelectedCategoryId,
  useSelectedProductId,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { colors, getCategoryColors, spacing, typography } from '../../theme';
import { track } from '../../utils/analytics';
import { LessonStep } from './components/LessonStep';
import { StepIndicator } from './components/StepIndicator';

export function LessonScreen() {
  const productId = useSelectedProductId();
  const categoryId = useSelectedCategoryId();
  const { goToCategory, goToQuiz } = useNavigation();

  // The step index is view-local: it never needs to survive leaving the screen,
  // and every entry point resets it to the first step.
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [productId]);

  const product = getProductById(productId);
  const category = getCategoryById(categoryId ?? product?.categoryId ?? null);
  const { accent, soft } = getCategoryColors(category?.id ?? '');

  const backLabel = category?.name ?? 'Home';
  const goBack = () => goToCategory(category?.id ?? '');

  if (product === undefined || product.lessons.length === 0) {
    return (
      <SafeAreaWrapper testID="lesson-screen">
        <BackButton label={backLabel} onPress={goBack} testID="lesson-back" />
        <Text style={styles.productName}>This lesson is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  const totalSteps = product.lessons.length;
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;
  const lesson = product.lessons[stepIndex];

  const handleNext = () => {
    setStepIndex((current) => Math.min(totalSteps - 1, current + 1));
  };

  const handleStartQuiz = () => {
    track({ name: 'lesson_completed', productId: product.id });
    goToQuiz(product.id);
  };

  return (
    <SafeAreaWrapper testID="lesson-screen">
      <View style={styles.body}>
        <BackButton label={backLabel} onPress={goBack} testID="lesson-back" />
        <Text accessibilityRole="header" style={styles.productName}>
          {product.name}
        </Text>

        <StepIndicator
          testID="lesson-steps"
          totalSteps={totalSteps}
          currentStep={stepIndex}
          color={accent}
        />

        <LessonStep
          lesson={lesson}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          accent={accent}
          accentSoft={soft}
        />

        <View style={styles.actions}>
          <Button
            testID="lesson-back-step"
            label="Back"
            variant="secondary"
            flex={1}
            disabled={isFirstStep}
            onPress={() => setStepIndex((current) => Math.max(0, current - 1))}
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
              onPress={handleNext}
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
  actions: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: 18,
  },
});
