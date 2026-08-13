import { StyleSheet, Text, View } from 'react-native';

import type { QuizAnswerRecord } from '../../../store/slices/quizSlice';
import { colors, radius, spacing, typography } from '../../../theme';

/** Lesson step titles, in order. Every product uses the same five-step arc. */
const STEP_NAMES = [
  'What it is',
  'How it works',
  'Why it’s used',
  'Key terms',
  'Risks to watch',
] as const;

export interface StepBreakdownProps {
  answers: readonly QuizAnswerRecord[];
  accent: string;
}

/**
 * Score split by the lesson step each question tested.
 *
 * A bare "4/6" tells someone they have work to do but not where. Because every
 * question is tagged with the step it came from, the same six answers can say
 * "you have the mechanics but not the risks", which is a thing you can act on.
 * Steps with no questions in this sitting are omitted rather than shown at
 * zero, which would read as a failure the user never had a chance at.
 */
export function StepBreakdown({ answers, accent }: StepBreakdownProps) {
  if (answers.length === 0) {
    return null;
  }

  const byStep = STEP_NAMES.map((name, index) => {
    const step = index + 1;
    const forStep = answers.filter((record) => record.step === step);
    return {
      name,
      step,
      total: forStep.length,
      correct: forStep.filter((record) => record.correct).length,
    };
  }).filter((row) => row.total > 0);

  return (
    <View testID="step-breakdown" style={styles.card}>
      <Text style={styles.title}>BY TOPIC</Text>
      {byStep.map((row) => {
        const allRight = row.correct === row.total;
        return (
          <View key={row.step} style={styles.row}>
            <Text style={styles.name}>{row.name}</Text>
            <View style={styles.marks}>
              {Array.from({ length: row.total }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.pip,
                    {
                      backgroundColor:
                        index < row.correct ? accent : colors.trackDot,
                    },
                  ]}
                />
              ))}
              <Text
                style={[styles.score, allRight && { color: colors.success.base }]}
              >
                {row.correct}/{row.total}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  title: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: spacing.md,
    paddingVertical: 7,
  },
  name: {
    ...typography.body2,
    color: colors.text.body,
    flexShrink: 1,
  },
  marks: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  pip: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  score: {
    ...typography.labelSmall,
    color: colors.text.tertiary,
    marginLeft: 4,
    minWidth: 26,
    textAlign: 'right',
  },
});
