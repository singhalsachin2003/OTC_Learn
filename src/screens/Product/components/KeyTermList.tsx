import { StyleSheet, Text, View } from 'react-native';

import type { KeyTerm } from '../../../data/types';
import { colors, spacing, typography } from '../../../theme';

export interface KeyTermListProps {
  terms: readonly KeyTerm[];
  accent: string;
}

/** The product's vocabulary, as a definition list. */
export function KeyTermList({ terms, accent }: KeyTermListProps) {
  return (
    <View testID="key-terms">
      {terms.map((entry, index) => (
        <View
          key={entry.term}
          style={[styles.row, index === terms.length - 1 && styles.lastRow]}
        >
          <View style={[styles.marker, { backgroundColor: accent }]} />
          <View style={styles.text}>
            <Text style={styles.term}>{entry.term}</Text>
            <Text style={styles.definition}>{entry.definition}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  /** A short rule rather than a bullet — reads as a ledger, not a list. */
  marker: {
    width: 3,
    borderRadius: 2,
    marginTop: 3,
    alignSelf: 'stretch',
  },
  text: {
    flex: 1,
  },
  term: {
    ...typography.label,
    fontSize: 13.5,
    color: colors.text.primary,
    marginBottom: 3,
  },
  definition: {
    ...typography.body2,
    color: colors.text.body,
  },
});
