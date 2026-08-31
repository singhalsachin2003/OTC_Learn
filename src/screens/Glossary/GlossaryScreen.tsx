import { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NotebookPen, X } from 'lucide-react-native';

import { BackButton } from '../../components/common/BackButton';
import { SafeAreaWrapper } from '../../components/common/SafeAreaWrapper';
import { allKeyTerms } from '../../data/products';
import { useAppSelector } from '../../hooks/useAppState';
import { useNavigation } from '../../hooks/useNavigation';
import { NoteEditor } from '../Product/components/NoteEditor';
import { noteKeyFor } from '../../utils/notes';
import {
  colors,
  getCategoryColors,
  radius,
  spacing,
  typography,
} from '../../theme';

type Entry = ReturnType<typeof allKeyTerms>[number];
interface Section {
  letter: string;
  data: Entry[];
}

/** The section a term is grouped under — its first letter, or "#" for the
 * handful of terms (e.g. "25-delta") that start with a digit. */
function letterFor(term: string): string {
  const first = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : '#';
}

/**
 * Every key term in the catalogue, alphabetically.
 *
 * The terms already exist per product; collecting them here turns thirty-six
 * short vocabularies into one reference, which is how someone actually uses
 * them — you meet "basis risk" in a lesson and want the definition later,
 * without remembering which product it belonged to.
 */
export function GlossaryScreen() {
  const { goToTab, goToProduct } = useNavigation();
  const [query, setQuery] = useState('');
  // Which term's editor is open. One at a time: a screen of open text boxes is
  // a form, and this is a reference list you occasionally annotate.
  const [openNote, setOpenNote] = useState<string | null>(null);
  const notes = useAppSelector((state) => state.notes.byProduct);

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
  const isSearching = query.trim() !== '';

  // Grouped, not flattened. The previous version flattened headers and rows
  // into one array because `stickyHeaderIndices` on a ScrollView only pins a
  // header that is a sibling of its rows — but that meant rendering all 216
  // terms eagerly, every time, with no virtualisation. A SectionList gives the
  // sticky behaviour and windowing together, so the shape that was a workaround
  // is no longer needed.
  const sections = useMemo<Section[]>(() => {
    const byLetter = new Map<string, Entry[]>();
    filtered.forEach((entry) => {
      const letter = letterFor(entry.term);
      const bucket = byLetter.get(letter);
      if (bucket === undefined) {
        byLetter.set(letter, [entry]);
      } else {
        bucket.push(entry);
      }
    });
    return [...byLetter.entries()].map(([letter, data]) => ({ letter, data }));
  }, [filtered]);

  const renderItem = useCallback(
    ({ item: entry }: { item: Entry }) => {
      const { text: accent } = getCategoryColors(entry.categoryId);
      const noteKey = noteKeyFor(entry.productId, entry.term);
      const noted = notes[noteKey] !== undefined;
      const editing = openNote === noteKey;

      return (
        <View>
          <Pressable
            testID={`glossary-${entry.productId}-${entry.term}`}
            onPress={() => goToProduct(entry.productId)}
            accessibilityRole="button"
            accessibilityLabel={`${entry.term}. ${entry.definition}. From ${entry.productName}.`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowMain}>
              <Text style={styles.term}>{entry.term}</Text>
              <Text style={styles.definition}>{entry.definition}</Text>
              <Text style={[styles.source, { color: accent }]}>
                {entry.productName}
              </Text>
            </View>
            {/* Its own control, not part of the row's tap target: tapping the
                row means "explain this", and folding a second meaning into it
                would make one of the two a surprise. */}
            <Pressable
              testID={`glossary-note-${entry.productId}-${entry.term}`}
              onPress={() => setOpenNote(editing ? null : noteKey)}
              accessibilityRole="button"
              accessibilityLabel={
                noted
                  ? `Edit your note on ${entry.term}`
                  : `Add a note on ${entry.term}`
              }
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.noteButton}
            >
              <NotebookPen
                size={17}
                strokeWidth={2}
                color={noted || editing ? accent : colors.chevron}
              />
            </Pressable>
            <Text style={styles.chevron}>›</Text>
          </Pressable>

          {editing && (
            <View style={styles.noteEditor}>
              <NoteEditor
                noteKey={noteKey}
                testID={`glossary-editor-${entry.productId}-${entry.term}`}
                placeholder={`What do you want to remember about ${entry.term}?`}
              />
            </View>
          )}
        </View>
      );
    },
    [goToProduct, notes, openNote],
  );

  return (
    <SafeAreaWrapper testID="glossary-screen">
      {/* Fixed above the list rather than passed as `ListHeaderComponent`.
          A `TextInput` inside a list header remounts whenever the header's
          identity changes — which is every keystroke, since the subtitle reads
          the query — and a remounted input loses focus after one character.
          Pinning it also means the search stays reachable in a list this long,
          which is the right behaviour for a reference screen anyway. */}
      <View style={styles.header}>
        <BackButton
          label="Profile"
          onPress={() => goToTab('profile')}
          testID="glossary-back"
        />

        <Text accessibilityRole="header" style={styles.title}>
          Glossary
        </Text>
        <Text style={styles.subtitle}>
          {isSearching
            ? `${filtered.length} of ${terms.length} terms match “${query.trim()}”`
            : `${terms.length} terms from across the catalogue`}
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            testID="glossary-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search terms"
            placeholderTextColor={colors.text.tertiary}
            accessibilityLabel="Search glossary"
            autoCorrect={false}
            style={[styles.search, isSearching && styles.searchWithClear]}
          />
          {isSearching && (
            <Pressable
              testID="glossary-search-clear"
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
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(entry) => `${entry.productId}-${entry.term}`}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.letterHeader}>
            <Text style={styles.letterText}>{section.letter}</Text>
          </View>
        )}
        // Off by default on Android, which is the platform this ships on.
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        // The open editor and the saved notes both live outside `sections`, so
        // the list would not otherwise know a row had changed.
        extraData={`${openNote ?? ''}|${Object.keys(notes).length}`}
        ListEmptyComponent={
          <Text testID="glossary-empty" style={styles.empty}>
            No term matches “{query.trim()}”.
          </Text>
        }
      />
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  // The fixed block above the list. `SafeAreaWrapper` supplies the horizontal
  // padding the ScrollView used to; the list needs its own so rows can still
  // draw their separators edge to edge.
  header: {
    paddingTop: spacing.lg,
  },
  content: {
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
  // Sticky headers need an opaque background — once pinned, rows behind them
  // scroll up underneath and would otherwise show through.
  letterHeader: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    paddingBottom: 4,
  },
  letterText: {
    ...typography.label,
    color: colors.text.tertiary,
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
  chevron: {
    ...typography.h3,
    color: colors.chevron,
  },
  noteButton: {
    paddingHorizontal: spacing.xs,
  },
  noteEditor: {
    paddingBottom: spacing.md,
  },
  empty: {
    ...typography.body2,
    color: colors.text.muted,
    marginTop: spacing.lg,
  },
});
