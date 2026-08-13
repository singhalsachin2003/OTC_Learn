import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../../../theme';

export interface QuizFeedbackProps {
  correct: boolean;
  explanation: string;
  /** The right answer, spelled out. Passed only when the user got it wrong. */
  correctLabel?: string;
}

/**
 * Result of the last answer. The leading ✓/✗ and the "Correct"/"Not quite"
 * wording carry the meaning on their own, so colour is never the sole signal.
 */
export function QuizFeedback({
  correct,
  explanation,
  correctLabel,
}: QuizFeedbackProps) {
  return (
    <View
      testID="quiz-feedback"
      accessibilityLiveRegion="polite"
      style={[styles.box, correct ? styles.correct : styles.incorrect]}
    >
      <Text
        style={[styles.text, correct ? styles.textCorrect : styles.textIncorrect]}
      >
        {`${correct ? '✓ Correct' : '✗ Not quite'} — ${explanation}`}
      </Text>
      {correctLabel !== undefined && (
        <Text
          testID="quiz-feedback-answer"
          style={[styles.answer, styles.textIncorrect]}
        >
          The answer was: {correctLabel}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: spacing.lg,
  },
  correct: {
    backgroundColor: colors.success.bgFeedback,
  },
  incorrect: {
    backgroundColor: colors.error.bgFeedback,
  },
  text: {
    ...typography.label,
    fontSize: 13.5,
    lineHeight: 20,
  },
  textCorrect: {
    color: colors.success.text,
  },
  textIncorrect: {
    color: colors.error.text,
  },
  answer: {
    ...typography.bodyStrong,
    fontSize: 13,
    marginTop: spacing.sm,
  },
});
