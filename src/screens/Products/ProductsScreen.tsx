import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { X } from 'lucide-react-native';

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

/**
 * A row entry in the flattened list — a header or a product, one after
 * another as direct `ScrollView` children. Flattened rather than nested
 * (a `View` per category wrapping its own rows) so each header's index can
 * be handed to `stickyHeaderIndices`: that prop pins whichever indexed
 * child is currently at the top, so a header can only stick on its own if
 * it is a sibling of its rows rather than their parent.
 */
type Row =
  | { kind: 'header'; key: string; label: string }
  | { kind: 'product'; key: string; product: Product; subtitle?: string };

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
  const isSearching = query.trim() !== '';

  const rows = useMemo(() => {
    const list: Row[] = [];
    if (showSaved) {
      list.push({ kind: 'header', key: 'header-saved', label: 'SAVED' });
      saved.forEach((product) =>
        list.push({ kind: 'product', key: `saved-${product.id}`, product }),
      );
    }
    grouped.forEach(({ category, items }) => {
      list.push({
        kind: 'header',
        key: `header-${category.id}`,
        label: category.name.toUpperCase(),
      });
      items.forEach((product) =>
        list.push({
          kind: 'product',
          key: product.id,
          product,
          subtitle: isSearching
            ? `${getCategoryById(product.categoryId)?.name ?? ''} · ${product.hook}`
            : undefined,
        }),
      );
    });
    return list;
  }, [showSaved, saved, grouped, isSearching]);

  // Offset by the two fixed children (title, search bar) that always precede
  // the flattened rows, so a header's position in `rows` maps to its actual
  // index among the ScrollView's direct children.
  const stickyHeaderIndices = useMemo(
    () =>
      rows.reduce<number[]>((indices, row, index) => {
        if (row.kind === 'header') {
          indices.push(index + 2);
        }
        return indices;
      }, []),
    [rows],
  );

  return (
    <SafeAreaWrapper testID="products-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={rows.length > 0 ? stickyHeaderIndices : undefined}
      >
        <Text accessibilityRole="header" style={styles.title}>
          Products
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            testID="product-search"
            value={query}
            onChangeText={(text) => dispatch(setProductQuery(text))}
            placeholder="Search products and key terms"
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel="Search products"
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.search, isSearching && styles.searchWithClear]}
          />
          {isSearching && (
            <Pressable
              testID="product-search-clear"
              onPress={() => dispatch(setProductQuery(''))}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              style={styles.searchClear}
            >
              <X size={16} strokeWidth={2.5} color={colors.text.tertiary} />
            </Pressable>
          )}
        </View>

        {rows.length === 0 ? (
          <Text testID="products-empty" style={styles.empty}>
            Nothing matches “{query.trim()}”. Try a product name, or a term like
            “notional” or “strike”.
          </Text>
        ) : (
          rows.map((row) =>
            row.kind === 'header' ? (
              <View key={row.key} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{row.label}</Text>
              </View>
            ) : (
              <ProductRow
                key={row.key}
                product={row.product}
                mastery={masteryFor(row.product.id)}
                bookmarked={bookmarks.includes(row.product.id)}
                subtitle={row.subtitle}
                onPress={() => goToProduct(row.product.id)}
              />
            ),
          )
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
  searchRow: {
    marginBottom: spacing.lg,
    justifyContent: 'center',
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
  },
  searchWithClear: {
    paddingRight: spacing.xl + spacing.md,
  },
  searchClear: {
    position: 'absolute',
    right: spacing.md,
  },
  // Sticky headers need an opaque background — once pinned, the rows behind
  // them scroll up underneath and would otherwise show through.
  sectionHeader: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.micro,
    color: colors.text.tertiary,
  },
  empty: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
