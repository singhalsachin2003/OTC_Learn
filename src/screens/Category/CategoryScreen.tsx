import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { ProductRow } from '../../components/ui/ProductRow';
import { Ring } from '../../components/ui/Ring';
import { getCategoryById } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';
import { useBookmarks, useSelectedCategoryId } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';

export function CategoryScreen() {
  const categoryId = useSelectedCategoryId();
  const { goHome, goToProduct } = useNavigation();
  const { masteryFor, categoryPercent, masteredInCategory } = useProgress();
  const bookmarks = useBookmarks();

  const category = getCategoryById(categoryId);
  const products = getProductsByCategory(categoryId);

  if (category === undefined) {
    return (
      <SafeAreaWrapper testID="category-screen">
        <BackButton label="Home" onPress={goHome} testID="category-back" />
        <Text style={styles.empty}>That asset class is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  const { accent, soft } = getCategoryColors(category.id);
  const percent = categoryPercent(category.id);
  const mastered = masteredInCategory(category.id);

  return (
    <SafeAreaWrapper testID="category-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton label="Home" onPress={goHome} testID="category-back" />

        <View style={[styles.header, { backgroundColor: soft }]}>
          <Ring size={54} innerSize={40} percent={percent} fillColor={accent}>
            <Text style={[styles.headerIcon, { color: accent }]}>
              {category.icon}
            </Text>
          </Ring>
          <View style={styles.headerText}>
            <Text accessibilityRole="header" style={styles.title}>
              {category.name}
            </Text>
            <Text style={styles.meta}>
              {mastered} of {products.length} mastered · {percent}% overall
            </Text>
          </View>
        </View>

        <Text style={styles.blurb}>{category.description}</Text>

        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            mastery={masteryFor(product.id)}
            bookmarked={bookmarks.includes(product.id)}
            onPress={() => goToProduct(product.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  headerIcon: {
    ...typography.micro,
    fontSize: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.text.primary,
  },
  meta: {
    ...typography.labelSmall,
    color: colors.text.secondary,
    marginTop: 3,
  },
  blurb: {
    ...typography.body2,
    color: colors.text.blurb,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  empty: {
    ...typography.body1,
    color: colors.text.body,
    marginTop: spacing.lg,
  },
});
