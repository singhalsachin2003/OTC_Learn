import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../../../theme';

export interface QuizFeedbackProps {
  correct: boolean;
  explanation: string;
}

/**
 * Result of the last answer. The leading ✓/✗ and the "Correct"/"Not quite"
 * wording carry the meaning on their own, so colour is never the sole signal.
 */
export function QuizFeedback({ correct, explanation }: QuizFeedbackProps) {
  const text = `${correct ? '✓ Correct' : '✗ Not quite'} — ${explanation}`;

  return (
    <Text
      testID="quiz-feedback"
      accessibilityLiveRegion="polite"
      style={[styles.box, correct ? styles.correct : styles.incorrect]}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  box: {
    ...typography.label,
    fontSize: 13.5,
    lineHeight: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  correct: {
    color: colors.success.text,
    backgroundColor: colors.success.bgFeedback,
  },
  incorrect: {
    color: colors.error.text,
    backgroundColor: colors.error.bgFeedback,
  },
});
