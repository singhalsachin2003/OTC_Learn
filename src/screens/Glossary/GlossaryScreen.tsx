import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { allKeyTerms } from '../../data/products';
import { useNavigation } from '../../hooks/useNavigation';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';

/**
 * Every key term in the catalogue, alphabetically.
 *
 * The terms already exist per product; collecting them here turns twenty short
 * vocabularies into one reference, which is how someone actually uses them —
 * you meet "basis risk" in a lesson and want the definition later, without
 * remembering which product it belonged to.
 */
export function GlossaryScreen() {
  const { goToTab, goToProduct } = useNavigation();
  const [query, setQuery] = useState('');

  const terms = useMemo(() => allKeyTerms(), []);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === '') {
      return terms;
    }
    return terms.filter(
      (entry) =>
        entry.term.toLowerCase().includes(needle) ||
        entry.definition.toLowerCase().includes(needle),
    );
  }, [terms, query]);

  return (
    <SafeAreaWrapper testID="glossary-screen">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="glossary-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Glossary
        </Text>
        <Text style={styles.subtitle}>
          {terms.length} terms from across the catalogue
        </Text>

        <TextInput
          testID="glossary-search"
          value={query}
          onChangeText={setQuery}
          placeholder="Search terms"
          placeholderTextColor={colors.text.tertiary}
          accessibilityLabel="Search glossary"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={styles.search}
        />

        {filtered.length === 0 ? (
          <Text testID="glossary-empty" style={styles.empty}>
            No term matches “{query.trim()}”.
          </Text>
        ) : (
          filtered.map((entry) => {
            const { accent } = getCategoryColors(entry.categoryId);
            return (
              <Pressable
                key={`${entry.productId}-${entry.term}`}
                testID={`glossary-${entry.productId}-${entry.term}`}
                onPress={() => goToProduct(entry.productId)}
                accessibilityRole="button"
                accessibilityLabel={`${entry.term}. ${entry.definition}. From ${entry.productName}.`}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <Text style={styles.term}>{entry.term}</Text>
                <Text style={styles.definition}>{entry.definition}</Text>
                <Text style={[styles.source, { color: accent }]}>
                  {entry.productName}
                </Text>
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
  search: {
    ...typography.body2,
    color: colors.text.primary,
    backgroundColor: colors.card,
    borderRadius: radius.large,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  pressed: {
    opacity: 0.6,
  },
  term: {
    ...typography.label,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 3,
  },
  definition: {
    ...typography.body2,
    color: colors.text.body,
  },
  source: {
    ...typography.micro,
    marginTop: 5,
  },
  empty: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
