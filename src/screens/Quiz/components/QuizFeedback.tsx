import { StyleSheet, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';

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
      {/* A drawn mark rather than "✓"/"✗": neither character exists in Plus
          Jakarta Sans, so Android substituted them from another family at a
          different weight and baseline to the sentence they sat inside. */}
      <View style={styles.headline}>
        {correct ? (
          <Check size={15} strokeWidth={3} color={colors.success.text} />
        ) : (
          <X size={15} strokeWidth={3} color={colors.error.text} />
        )}
        <Text
          style={[styles.text, correct ? styles.textCorrect : styles.textIncorrect]}
        >
          {`${correct ? 'Correct' : 'Not quite'} — ${explanation}`}
        </Text>
      </View>
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
  headline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 7,
  },
  text: {
    ...typography.label,
    fontSize: 13.5,
    lineHeight: 20,
    flex: 1,
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
