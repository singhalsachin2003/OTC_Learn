import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { spacing } from '../../../theme';

export interface QuizButtonsProps {
  isAnswered: boolean;
  isLastQuestion: boolean;
  onAnswer: (value: boolean) => void;
  onAdvance: () => void;
}

/**
 * True/False pair before an answer is given; a single advance button after.
 * Swapping the controls is what "locks" the answer — there is nothing left to
 * tap once the question is answered.
 */
export function QuizButtons({
  isAnswered,
  isLastQuestion,
  onAnswer,
  onAdvance,
}: QuizButtonsProps) {
  if (isAnswered) {
    return (
      <Button
        testID="quiz-advance"
        label={isLastQuestion ? 'See results →' : 'Next question'}
        onPress={onAdvance}
        style={styles.advance}
      />
    );
  }

  return (
    <View style={styles.row}>
      <Button
        testID="quiz-answer-true"
        label="True"
        variant="success"
        flex={1}
        onPress={() => onAnswer(true)}
        accessibilityHint="Answer true to this statement"
      />
      <Button
        testID="quiz-answer-false"
        label="False"
        variant="danger"
        flex={1}
        onPress={() => onAnswer(false)}
        accessibilityHint="Answer false to this statement"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: 10,
    marginTop: spacing.lg,
  },
  advance: {
    marginTop: spacing.lg,
    paddingVertical: 15,
  },
});
