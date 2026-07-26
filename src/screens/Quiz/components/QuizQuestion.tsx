import { type ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Card } from '../../../components/ui/Card';
import { colors, radius, spacing, typography } from '../../../theme';

export interface QuizQuestionProps {
  question: string;
  /** Feedback block, rendered inside the card once the question is answered. */
  children?: ReactNode;
}

/** Vertically-centred card holding the question and, later, its feedback. */
export function QuizQuestion({ question, children }: QuizQuestionProps) {
  return (
    <Card testID="quiz-card" style={styles.card}>
      <Text accessibilityRole="header" style={styles.question}>
        {question}
      </Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: radius.xxl,
    paddingVertical: 28,
    paddingHorizontal: spacing.xxl - 2,
  },
  question: {
    ...typography.question,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
});
