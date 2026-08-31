import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { getProductById } from '../../data/products';
import { useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';
import { notePreview, sortedNotes, type NoteEntry } from '../../utils/notes';

interface Row {
  entry: NoteEntry;
  productName: string;
  categoryId: string;
  /** What the note is about: the product, or one of its key terms. */
  subject: string;
}

/**
 * Every note the user has written, newest first.
 *
 * A note is only reachable from its own product page otherwise, which is the
 * wrong way round for the thing it is used for: you remember writing something
 * down, not which of thirty-six products you were on at the time. Search runs
 * over the note's own words as well as the product name for the same reason.
 *
 * A note whose product no longer exists is dropped rather than shown as an
 * untitled row — ids are a persisted schema, so this only happens if content is
 * renamed without a migration, and a row that cannot be opened is worse than
 * no row.
 */
export function NotesScreen() {
  const { goToTab, goToProduct } = useNavigation();
  const notes = useAppSelector((state) => state.notes.byProduct);
  const [query, setQuery] = useState('');

  const rows = useMemo<Row[]>(
    () =>
      sortedNotes(notes).flatMap((entry) => {
        const product = getProductById(entry.productId);
        return product === undefined
          ? []
          : [
              {
                entry,
                productName: product.name,
                categoryId: product.categoryId,
                subject: entry.term ?? product.name,
              },
            ];
      }),
    [notes],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === '') {
      return rows;
    }
    return rows.filter(
      (row) =>
        row.entry.body.toLowerCase().includes(needle) ||
        row.productName.toLowerCase().includes(needle) ||
        row.subject.toLowerCase().includes(needle),
    );
  }, [rows, query]);

  const isSearching = query.trim() !== '';

  return (
    <SafeAreaWrapper testID="notes-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="notes-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Notes
        </Text>
        <Text style={styles.subtitle} testID="notes-subtitle">
          {rows.length === 0
            ? 'Nothing written down yet'
            : isSearching
              ? `${filtered.length} of ${rows.length} match “${query.trim()}”`
              : `${rows.length} ${rows.length === 1 ? 'note' : 'notes'}, most recent first`}
        </Text>

        {/* The search box is hidden until there is something to search: on an
            empty library it is a control that can only ever return nothing. */}
        {rows.length > 0 && (
          <View style={styles.searchRow}>
            <TextInput
              testID="notes-search"
              value={query}
              onChangeText={setQuery}
              placeholder="Search your notes"
              placeholderTextColor={colors.text.tertiary}
              accessibilityLabel="Search notes"
              autoCorrect={false}
              style={[styles.search, isSearching && styles.searchWithClear]}
            />
            {isSearching && (
              <Pressable
                testID="notes-search-clear"
                onPress={() => setQuery('')}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                style={styles.searchClear}
              >
                <X size={16} strokeWidth={2.5} color={colors.text.tertiary} />
              </Pressable>
            )}
          </View>
        )}

        {rows.length === 0 ? (
          <Text testID="notes-empty" style={styles.empty}>
            Open any product and write down what you want to remember about it. Your
            notes collect here.
          </Text>
        ) : filtered.length === 0 ? (
          <Text testID="notes-no-match" style={styles.empty}>
            No note matches “{query.trim()}”.
          </Text>
        ) : (
          filtered.map((row) => {
            const { text: accent } = getCategoryColors(row.categoryId);
            return (
              <Pressable
                key={row.entry.key}
                testID={`notes-row-${row.entry.key}`}
                onPress={() => goToProduct(row.entry.productId)}
                accessibilityRole="button"
                accessibilityLabel={`Note on ${row.subject}, last edited ${row.entry.updatedOn}. ${row.entry.body}`}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <View style={styles.rowMain}>
                  <Text style={[styles.product, { color: accent }]}>
                    {/* A term note names the term, then where it came from —
                        "Notional" alone would not say which product's. */}
                    {row.entry.term === undefined
                      ? row.productName
                      : `${row.entry.term} · ${row.productName}`}
                  </Text>
                  <Text style={styles.preview}>{notePreview(row.entry.body)}</Text>
                  <Text style={styles.edited}>Edited {row.entry.updatedOn}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.labelSmall,
    color: colors.text.muted,
    marginTop: 3,
  },
  searchRow: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  rowMain: {
    flex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  product: {
    ...typography.micro,
    marginBottom: 4,
  },
  preview: {
    ...typography.body2,
    color: colors.text.body,
  },
  edited: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: 5,
  },
  chevron: {
    ...typography.h3,
    color: colors.chevron,
  },
  empty: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
