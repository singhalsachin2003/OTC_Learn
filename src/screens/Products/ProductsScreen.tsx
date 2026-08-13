import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { ProductRow } from '../../components/ui/ProductRow';
import { categories, getCategoryById } from '../../data/categories';
import { products } from '../../data/products';
import type { Product } from '../../data/types';
import {
  useAppDispatch,
  useBookmarks,
  useProductQuery,
} from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { useProgress } from '../../hooks/useProgress';
import { setProductQuery } from '../../store/slices/appSlice';
import { colors, radius, spacing, typography } from '../../theme';

/**
 * Searches name, hook, summary and key terms.
 *
 * Key terms are included deliberately: someone who half-remembers "notional" or
 * "basis risk" is more likely to type that than the product name, and the terms
 * are the part of the content that names the concepts.
 */
function matches(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') {
    return true;
  }
  const haystack = [
    product.name,
    product.hook,
    product.summary,
    ...product.keyTerms.map((term) => term.term),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function ProductsScreen() {
  const dispatch = useAppDispatch();
  const query = useProductQuery();
  const bookmarks = useBookmarks();
  const { goToProduct } = useNavigation();
  const { masteryFor } = useProgress();

  const grouped = useMemo(() => {
    const found = products.filter((product) => matches(product, query));
    return categories
      .map((category) => ({
        category,
        items: found.filter((product) => product.categoryId === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const saved = useMemo(
    () => products.filter((product) => bookmarks.includes(product.id)),
    [bookmarks],
  );
  const showSaved = query.trim() === '' && saved.length > 0;

  return (
    <SafeAreaWrapper testID="products-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text accessibilityRole="header" style={styles.title}>
          Products
        </Text>

        <TextInput
          testID="product-search"
          value={query}
          onChangeText={(text) => dispatch(setProductQuery(text))}
          placeholder="Search products and key terms"
          placeholderTextColor={colors.text.tertiary}
          accessibilityLabel="Search products"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
          style={styles.search}
        />

        {showSaved && (
          <View testID="saved-section">
            <Text style={styles.sectionTitle}>SAVED</Text>
            {saved.map((product) => (
              <ProductRow
                key={`saved-${product.id}`}
                product={product}
                mastery={masteryFor(product.id)}
                bookmarked
                onPress={() => goToProduct(product.id)}
              />
            ))}
          </View>
        )}

        {grouped.length === 0 ? (
          <Text testID="products-empty" style={styles.empty}>
            Nothing matches “{query.trim()}”. Try a product name, or a term like
            “notional” or “strike”.
          </Text>
        ) : (
          grouped.map(({ category, items }) => (
            <View key={category.id}>
              <Text style={styles.sectionTitle}>{category.name.toUpperCase()}</Text>
              {items.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  mastery={masteryFor(product.id)}
                  bookmarked={bookmarks.includes(product.id)}
                  subtitle={
                    query.trim() === ''
                      ? undefined
                      : `${getCategoryById(product.categoryId)?.name ?? ''} · ${product.hook}`
                  }
                  onPress={() => goToProduct(product.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  search: {
    ...typography.body2,
    color: colors.text.primary,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  empty: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
