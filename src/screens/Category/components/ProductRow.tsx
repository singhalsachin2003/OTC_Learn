import { StyleSheet, Text, View } from 'react-native';

import { CompletedBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import type { Product } from '../../../data/types';
import { colors, radius, spacing, typography } from '../../../theme';

export interface ProductRowProps {
  product: Product;
  completed: boolean;
  onPress: () => void;
}

/** One product in a category list: name + hook, with a completion affordance. */
export function ProductRow({ product, completed, onPress }: ProductRowProps) {
  return (
    <Card
      testID={`product-row-${product.id}`}
      onPress={onPress}
      accessibilityLabel={`${product.name}. ${product.hook}.${
        completed ? ' Completed.' : ''
      }`}
      accessibilityHint="Opens the lesson for this product"
      style={styles.card}
    >
      <View style={styles.text}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.hook}>{product.hook}</Text>
      </View>
      {completed ? (
        <CompletedBadge testID={`product-done-${product.id}`} />
      ) : (
        <Text
          testID={`product-chevron-${product.id}`}
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={styles.chevron}
        >
          ›
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    borderRadius: radius.large,
    marginBottom: 10,
  },
  text: {
    flex: 1,
  },
  name: {
    ...typography.label,
    fontSize: 14.5,
    color: colors.text.primary,
    marginBottom: 3,
  },
  hook: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
  chevron: {
    ...typography.label,
    fontSize: 16,
    lineHeight: 20,
    color: colors.chevron,
  },
});
