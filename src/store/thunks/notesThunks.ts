import { createAsyncThunk } from '@reduxjs/toolkit';

import { toDateKey } from '../../utils/formatters';
import { editNote } from '../../utils/notes';
import { saveNotes } from '../../utils/storage';
import type { RootState } from '../index';
import { removeNote, setNote } from '../slices/notesSlice';

/**
 * Commits an edit and persists the whole map.
 *
 * The trim-and-drop decision lives in `editNote`, so the screen can hand over
 * exactly what the user typed and the rule about an empty note being a
 * deletion is applied in one place rather than at each caller.
 */
export const saveProductNote = createAsyncThunk<
  void,
  { productId: string; body: string },
  { state: RootState }
>('notes/save', async ({ productId, body }, { getState, dispatch }) => {
  const note = editNote(body, toDateKey());

  if (note === null) {
    dispatch(removeNote(productId));
  } else {
    dispatch(setNote({ productId, note }));
  }

  await saveNotes(getState().notes.byProduct);
});
