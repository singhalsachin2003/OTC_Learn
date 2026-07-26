import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../../../components/ui/Card';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { categories } from '../../../data/categories';
import { getProductsByCategory } from '../../../data/products';
import type { Category } from '../../../data/types';
import { useNavigation } from '../../../hooks/useNavigation';
import { useProgress } from '../../../hooks/useProgress';
import { colors, spacing, typography } from '../../../theme';
import { formatProductCount } from '../../../utils/formatters';

const GUTTER = spacing.md;

/** Two-column grid of the five asset classes. */
export function CategoryGrid() {
  return (
    <View style={styles.grid}>
      {categories.map((category) => (
        <View key={category.id} style={styles.cell}>
          <CategoryCard category={category} />
        </View>
      ))}
    </View>
  );
}

function CategoryCard({ category }: { category: Category }) {
  const { goToCategory } = useNavigation();
  const { completedInCategory } = useProgress();

  const total = getProductsByCategory(category.id).length;
  const done = completedInCategory(category.id);
  const subtext = formatProductCount(total, done);

  return (
    <Card
      testID={`category-card-${category.id}`}
      onPress={() => goToCategory(category.id)}
      accessibilityLabel={`${category.name}. ${subtext}`}
      accessibilityHint="Opens the products in this asset class"
      style={styles.card}
    >
      <CategoryIcon categoryId={category.id} label={category.icon} size={36} />
      <Text style={styles.name}>{category.name}</Text>
      <Text style={styles.subtext}>{subtext}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  // Half-gutter cells inside a negatively-inset row give an even 12px gap on
  // both axes without relying on `gap` percentage resolution.
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -GUTTER / 2,
  },
  cell: {
    width: '50%',
    paddingHorizontal: GUTTER / 2,
    paddingBottom: GUTTER,
  },
  card: {
    flex: 1,
    rowGap: 10,
  },
  name: {
    ...typography.label,
    fontSize: 14,
    color: colors.text.primary,
  },
  subtext: {
    ...typography.labelSmall,
    color: colors.text.muted,
  },
});
