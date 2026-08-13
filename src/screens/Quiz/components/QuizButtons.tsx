import { StyleSheet, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import type { Question } from '../../../data/types';
import { spacing } from '../../../theme';

export interface QuizButtonsProps {
  kind: Question['kind'];
  isAnswered: boolean;
  isLastQuestion: boolean;
  onAnswer: (value: boolean | number) => void;
  onAdvance: () => void;
}

/**
 * The answer controls.
 *
 * True/false questions answer from here; multiple-choice questions answer by
 * tapping an option, so this renders nothing for them until there is something
 * to advance to. Either way, swapping the controls out is what "locks" the
 * answer — there is nothing left to tap once the question is answered.
 */
export function QuizButtons({
  kind,
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

  if (kind === 'choice') {
    return null;
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
