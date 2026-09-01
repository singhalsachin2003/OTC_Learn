import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { useNavigation } from '../../../hooks/useNavigation';
import { colors, spacing, typography } from '../../../theme';
import { freeCategoryName } from '../../../utils/access';

export interface LockedProductProps {
  /** The asset class this product belongs to, named rather than coded. */
  categoryName: string;
}

/**
 * What stands in for the lesson, quiz and reference sections on a product the
 * user cannot open.
 *
 * The page above it still shows the product's name, difficulty and summary,
 * which is the honest version of a teaser: enough to know whether it is worth
 * paying for, and none of the teaching. It also means a deep link into paid
 * content lands somewhere that explains itself rather than on a lesson.
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
        The lesson, the question bank and the worked example for this product are
        part of the subscription. {freeCategoryName()} stays free, always.
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
