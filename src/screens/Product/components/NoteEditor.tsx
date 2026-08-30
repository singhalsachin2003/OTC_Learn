import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppState';
import { saveProductNote } from '../../../store/thunks/notesThunks';
import {
  isNoteEmpty,
  NOTE_MAX_LENGTH,
  remainingLength,
} from '../../../utils/notes';
import { colors, radius, spacing, typography } from '../../../theme';

export interface NoteEditorProps {
  productId: string;
}

/**
 * The user's own note against a product.
 *
 * The draft is local state and only committed on Save, so a half-typed thought
 * is never persisted and a stray keystroke cannot delete an existing note.
 * Clearing the box and saving is how a note is deleted — there is no separate
 * destructive control to mis-tap.
 */
export function NoteEditor({ productId }: NoteEditorProps) {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((state) => state.notes.byProduct[productId]);
  const [draft, setDraft] = useState(saved?.body ?? '');

  // Re-seeds when the product changes, or when the stored note is replaced from
  // elsewhere — a reset, or hydration finishing after this mounted.
  useEffect(() => {
    setDraft(saved?.body ?? '');
  }, [productId, saved?.body]);

  const stored = saved?.body ?? '';
  const dirty = draft.trim() !== stored;
  const deleting = stored !== '' && isNoteEmpty(draft);
  const remaining = remainingLength(draft);

  return (
    <View testID="note-editor">
      <TextInput
        testID="note-input"
        value={draft}
        onChangeText={setDraft}
        multiline
        textAlignVertical="top"
        maxLength={NOTE_MAX_LENGTH}
        placeholder="What do you want to remember about this one?"
        placeholderTextColor={colors.text.tertiary}
        accessibilityLabel="Your note on this product"
        style={styles.input}
      />

      <View style={styles.footer}>
        <Text style={styles.counter} testID="note-counter">
          {saved === undefined ? 'Not saved yet' : `Last edited ${saved.updatedOn}`}
          {remaining < 200 ? ` · ${Math.max(0, remaining)} left` : ''}
        </Text>
        <Button
          testID="note-save"
          label={deleting ? 'Delete note' : 'Save note'}
          variant="secondary"
          disabled={!dirty}
          onPress={() => {
            void dispatch(saveProductNote({ productId, body: draft }));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    ...typography.body2,
    color: colors.text.body,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 96,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    columnGap: spacing.sm,
  },
  counter: {
    ...typography.micro,
    color: colors.text.tertiary,
    flexShrink: 1,
  },
});
