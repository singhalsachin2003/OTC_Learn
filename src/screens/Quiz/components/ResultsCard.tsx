import { StyleSheet, Text, View } from 'react-native';
import { Check, Star } from 'lucide-react-native';

import { colors, radius, spacing, typography } from '../../../theme';

export interface ResultsCardProps {
  /** True when every question was answered correctly. */
  perfect: boolean;
  accent: string;
  accentSoft: string;
  title: string;
  subtitle: string;
}

/** Badge + headline shown at the top of the results screen. */
export function ResultsCard({
  perfect,
  accent,
  accentSoft,
  title,
  subtitle,
}: ResultsCardProps) {
  return (
    <View style={styles.container}>
      <View
        testID="results-badge"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[styles.badge, { backgroundColor: accentSoft }]}
      >
        {/* A drawn icon rather than "★"/"✓" characters — Plus Jakarta Sans
            lacks both glyphs, the same font-substitution risk already fixed
            for the tab bar, back chevron and quiz-answer marks. */}
        {perfect ? (
          <Star size={30} strokeWidth={2} color={accent} fill={accent} />
        ) : (
          <Check size={32} strokeWidth={2.5} color={accent} />
        )}
      </View>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radius.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    ...typography.h1,
    fontSize: 21,
    color: colors.text.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyStrong,
    color: colors.text.secondary,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
