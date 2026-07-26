import { ScrollView, StyleSheet, Text } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { getCategoryById } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';
import { useSelectedCategoryId } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import { colors, spacing, typography } from '../../theme';
import { ProductRow } from './components/ProductRow';

export function CategoryScreen() {
  const categoryId = useSelectedCategoryId();
  const { goHome, goToLesson } = useNavigation();
  const { isProductComplete } = useProgress();

  const category = getCategoryById(categoryId);
  const categoryProducts = getProductsByCategory(categoryId);

  // Defensive: the navigator only mounts this screen with a category selected.
  if (category === undefined) {
    return (
      <SafeAreaWrapper testID="category-screen">
        <BackButton label="Home" onPress={goHome} testID="category-back" />
        <Text style={styles.blurb}>That asset class is unavailable.</Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper testID="category-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BackButton label="Home" onPress={goHome} testID="category-back" />
        <CategoryIcon
          categoryId={category.id}
          label={category.icon}
          size={44}
          style={styles.icon}
        />
        <Text accessibilityRole="header" style={styles.title}>
          {category.name}
        </Text>
        <Text style={styles.blurb}>{category.description}</Text>

        {categoryProducts.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            completed={isProductComplete(product.id)}
            onPress={() => goToLesson(product.id)}
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
  icon: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  blurb: {
    ...typography.label,
    fontFamily: typography.body1.fontFamily,
    lineHeight: 19.5,
    color: colors.text.blurb,
    marginBottom: spacing.xl,
  },
});
