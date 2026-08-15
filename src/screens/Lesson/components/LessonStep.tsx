import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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
        // `flexGrow: 1` + centring lets a short step (no callout, one
        // paragraph) sit in the middle of the card rather than pinned to
        // the top with a void below it; a step long enough to fill the
        // card scrolls exactly as before; `justifyContent` has no effect
        // once content exceeds the available height.
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {/* Keyed on the step so the content cross-fades when it changes: the
            card itself stays put, which keeps the swipe feeling like one
            surface rather than a stack being shuffled. */}
        <Animated.View
          key={lesson.step}
          entering={FadeIn.duration(220)}
          exiting={FadeOut.duration(120)}
        >
          <Text accessibilityRole="header" style={styles.title}>
            {lesson.title}
          </Text>
          <Text style={styles.content}>{lesson.content}</Text>

          {lesson.callout !== undefined && (
            <View
              testID="lesson-callout"
              style={[styles.callout, { backgroundColor: accentSoft }]}
            >
              <Text style={[styles.calloutLabel, { color: accent }]}>
                WORTH KNOWING
              </Text>
              <Text style={styles.calloutText}>{lesson.callout}</Text>
            </View>
          )}
        </Animated.View>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
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
  callout: {
    borderRadius: radius.medium,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  calloutLabel: {
    ...typography.micro,
    marginBottom: 5,
  },
  calloutText: {
    ...typography.body2,
    color: colors.text.body,
  },
});
