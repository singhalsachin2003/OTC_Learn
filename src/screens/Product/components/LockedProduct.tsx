import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useNavigation } from '../../../hooks/useNavigation';
import { colors, spacing, typography } from '../../../theme';

export interface LockedProductProps {
  /** The asset class this product belongs to, named rather than coded. */
  categoryName: string;
}

/**
 * What stands in for the lesson, quiz and reference sections on a product the
 * user cannot open — since 2026-09-08, the asset classes added after the
 * paywall.
 *
 * The page above it shows the product's name and difficulty and stops there.
 * It used to keep the hook and the summary as a teaser; they came out on
 * 2026-09-08 because a one-line description of a structured product is the
 * part a reader can act on without ever opening the lesson, which made it a
 * poor way to sell the lesson. The name still has to be shown — a deep link
 * into paid content has to land somewhere that explains itself, and a row with
 * no name explains nothing.
 */
export function LockedProduct({ categoryName }: LockedProductProps) {
  const { goToPaywall } = useNavigation();

  return (
    <Card testID="product-locked" style={styles.card}>
      <View style={styles.heading}>
        <Lock size={16} strokeWidth={2.5} color={colors.text.secondary} />
        <Text style={styles.title}>{categoryName} needs a subscription</Text>
      </View>
      <Text style={styles.body}>
        The description, the lesson, the question bank and the worked example for
        this product are part of the subscription. Everything the app shipped with
        stays free — this is one of the asset classes added since.
      </Text>
      <Button
        testID="product-unlock"
        label="See what a subscription opens"
        onPress={() => goToPaywall('product')}
        style={styles.action}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: spacing.lg,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    marginBottom: spacing.sm,
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
  action: {
    marginTop: spacing.md,
  },
});
