import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type { DepthSection } from '../../../data/types';
import { useNavigation } from '../../../hooks/useNavigation';
import { colors, radius, spacing, typography } from '../../../theme';

export interface DepthSectionsProps {
  sections: DepthSection[];
  /** How many extra questions come with it, for the locked pitch. */
  extraQuestions: number;
  /** Whether the reader has to subscribe first. */
  locked: boolean;
  accent: string;
  soft: string;
}

/**
 * "Going deeper" — the paid extension of a product that is otherwise free.
 *
 * Placed after the free lesson rather than inside it, and that is the design
 * decision worth keeping: the five-step lesson is what the product shipped
 * with, its numbering is a promise to anyone who has already learned it, and a
 * sixth step appearing between two they remember would be a change to
 * something they were given rather than an addition beside it.
 *
 * Locked, it is the app's most useful conversion surface — it sits on a page
 * the reader chose to open, about a product they are already learning, and it
 * says exactly what is missing rather than advertising an asset class they may
 * have no interest in.
 */
export function DepthSections({
  sections,
  extraQuestions,
  locked,
  accent,
  soft,
}: DepthSectionsProps) {
  const { goToPaywall } = useNavigation();

  if (locked) {
    return (
      <Card testID="product-depth-locked" style={styles.card}>
        <View style={styles.heading}>
          <Lock size={16} strokeWidth={2.5} color={colors.text.secondary} />
          <Text style={styles.title}>Going deeper</Text>
        </View>
        <Text style={styles.body}>
          {sections.length} further sections on this product, and {extraQuestions}{' '}
          more questions in its bank, come with a subscription. The lesson, the
          worked example and the twelve questions above are free and stay free.
        </Text>
        <Text style={styles.list}>
          {sections.map((section) => section.title).join(' · ')}
        </Text>
        <Button
          testID="product-depth-unlock"
          label="See what a subscription opens"
          onPress={() => goToPaywall('product')}
          style={styles.action}
        />
      </Card>
    );
  }

  return (
    <View testID="product-depth">
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.content}</Text>
          {section.callout !== undefined && (
            <View style={[styles.callout, { backgroundColor: soft }]}>
              <Text style={[styles.calloutLabel, { color: accent }]}>
                WORTH KNOWING
              </Text>
              <Text style={styles.calloutBody}>{section.callout}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    rowGap: spacing.sm,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  title: {
    ...typography.label,
    fontSize: 14.5,
    color: colors.text.primary,
    flexShrink: 1,
  },
  body: {
    ...typography.body2,
    color: colors.text.body,
  },
  list: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  action: {
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
    rowGap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  sectionBody: {
    ...typography.body1,
    color: colors.text.body,
  },
  callout: {
    padding: spacing.md,
    borderRadius: radius.md,
    rowGap: spacing.xs,
  },
  calloutLabel: {
    ...typography.micro,
  },
  calloutBody: {
    ...typography.body2,
    color: colors.text.body,
  },
});
