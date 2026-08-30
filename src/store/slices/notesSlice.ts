import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Note } from '../../utils/notes';

/**
 * Study notes, keyed by product id.
 *
 * A slice of its own rather than a corner of `progressSlice`: a note is
 * authored rather than earned, and nothing derives from it — mastery,
 * achievements and the review queue are all computed from answers, so notes
 * have no business sitting beside them.
 *
 * They are still cleared by `resetEverything`, which the user confirms as
 * "Reset everything" and which wipes the device: a reset that quietly kept the
 * user's own writing would be a worse surprise than one that takes it.
 */
export interface NotesState {
  byProduct: Record<string, Note>;
}

export const initialNotesState: NotesState = {
  byProduct: {},
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: initialNotesState,
  reducers: {
    /** Stores an edited note. The caller has already trimmed it. */
    setNote(state, action: PayloadAction<{ productId: string; note: Note }>) {
      state.byProduct[action.payload.productId] = action.payload.note;
    },

    /** Clearing a note deletes it — see `editNote`. */
    removeNote(state, action: PayloadAction<string>) {
      delete state.byProduct[action.payload];
    },

    setNotes(state, action: PayloadAction<Record<string, Note>>) {
      state.byProduct = action.payload;
    },

    /** Part of `resetEverything`. */
    clearNotes(): NotesState {
      return { byProduct: {} };
    },
  },
});

export const { setNote, removeNote, setNotes, clearNotes } = notesSlice.actions;

export default notesSlice.reducer;
