import { StyleSheet, Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';

import { Card } from '../../../components/ui/Card';
import { Ring } from '../../../components/ui/Ring';
import { categories } from '../../../data/categories';
import { getProductsByCategory } from '../../../data/products';
import type { Category } from '../../../data/types';
import { useAccess } from '../../../hooks/useAccess';
import { useNavigation } from '../../../hooks/useNavigation';
import { useProgress } from '../../../hooks/useProgress';
import { colors, getCategoryColors, spacing, typography } from '../../../theme';

const GUTTER = spacing.md;

/** Two-column grid of every category, each with a mastery ring. */
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
  const { categoryPercent, masteredInCategory } = useProgress();
  const { categoryLocked } = useAccess();
  const { accent } = getCategoryColors(category.id);

  const locked = categoryLocked(category.id);
  const total = getProductsByCategory(category.id).length;
  const mastered = masteredInCategory(category.id);
  const percent = categoryPercent(category.id);
  // Matches DashboardCard's leadLine: a fresh install reads "N to learn"
  // rather than a hollow "0 of N mastered".
  const subtext =
    mastered === 0 ? `${total} to learn` : `${mastered} of ${total} mastered`;

  return (
    <Card
      testID={`category-card-${category.id}`}
      onPress={() => goToCategory(category.id)}
      accessibilityLabel={`${category.name}. ${
        locked ? 'Needs a subscription. ' : ''
      }${percent} percent mastery. ${subtext}`}
      accessibilityHint="Opens the products in this category"
      style={styles.card}
    >
      <View style={styles.topRow}>
        {/* The ring replaces the old icon badge: it carries the same identity
            colour while also showing where the user is in that asset class. */}
        <Ring
          size={44}
          innerSize={32}
          percent={percent}
          fillColor={accent}
          animated={false}
        >
          <Text style={[styles.icon, { color: accent }]}>{category.icon}</Text>
        </Ring>
        {/* The card still opens: seeing the route through an asset class is
            the case for paying for it, and a card that refuses to open says
            less than one that shows what is behind it. */}
        {locked && (
          <View testID={`category-locked-${category.id}`}>
            <Lock size={14} strokeWidth={2.5} color={colors.text.tertiary} />
          </View>
        )}
      </View>
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  icon: {
    ...typography.micro,
    fontSize: 11,
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
