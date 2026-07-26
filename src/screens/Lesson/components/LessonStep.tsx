import { ScrollView, StyleSheet, Text } from 'react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import type { Lesson } from '../../../data/types';
import { colors, radius, spacing, typography } from '../../../theme';
import { formatStepLabel } from '../../../utils/formatters';

export interface LessonStepProps {
  lesson: Lesson;
  stepIndex: number;
  totalSteps: number;
  accent: string;
  accentSoft: string;
}

/** The white content card holding one lesson step. */
export function LessonStep({
  lesson,
  stepIndex,
  totalSteps,
  accent,
  accentSoft,
}: LessonStepProps) {
  return (
    <Card testID="lesson-card" style={styles.card}>
      <Badge
        testID="lesson-step-tag"
        label={`STEP ${formatStepLabel(stepIndex, totalSteps).toUpperCase()}`}
        color={accent}
        backgroundColor={accentSoft}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={styles.title}>
          {lesson.title}
        </Text>
        <Text style={styles.content}>{lesson.content}</Text>
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xxl,
    paddingVertical: 26,
    paddingHorizontal: spacing.xxl - 2,
  },
  body: {
    paddingTop: spacing.lg,
  },
  title: {
    ...typography.h3,
    lineHeight: 23.4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  content: {
    ...typography.body1,
    color: colors.text.body,
  },
});
