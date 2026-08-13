import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCategoryById } from '../../../data/categories';
import { getProductById } from '../../../data/products';
import { useNavigation } from '../../../hooks/useNavigation';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../../theme';

export interface RelatedProductsProps {
  ids: readonly string[];
}

/** Chips linking to sibling products. Unresolvable ids are skipped silently. */
export function RelatedProducts({ ids }: RelatedProductsProps) {
  const { goToProduct } = useNavigation();
  const related = ids.flatMap((id) => {
    const product = getProductById(id);
    return product === undefined ? [] : [product];
  });

  if (related.length === 0) {
    return null;
  }

  return (
    <View testID="related-products" style={styles.row}>
      {related.map((product) => {
        const { accent, soft } = getCategoryColors(product.categoryId);
        const category = getCategoryById(product.categoryId);

        return (
          <Pressable
            key={product.id}
            testID={`related-${product.id}`}
            onPress={() => goToProduct(product.id)}
            accessibilityRole="button"
            accessibilityLabel={`${product.name}, ${category?.name ?? ''}`}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: soft },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.name, { color: accent }]}>{product.name}</Text>
            <Text style={styles.category}>{category?.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.medium,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  pressed: {
    opacity: 0.75,
  },
  name: {
    ...typography.label,
    fontSize: 13,
  },
  category: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: 2,
  },
});
