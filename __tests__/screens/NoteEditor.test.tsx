import { fireEvent, screen } from '@testing-library/react-native';

import { NoteEditor } from '../../src/screens/Product/components/NoteEditor';
import { createStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import { toDateKey } from '../../src/utils/formatters';
import { renderWithStore } from '../helpers/renderWithStore';

const PRODUCT = 'irs';

describe('NoteEditor', () => {
  it('starts empty for a product with no note', async () => {
    await renderWithStore(<NoteEditor productId={PRODUCT} />);

    expect(screen.getByTestId('note-input').props.value).toBe('');
    expect(screen.getByTestId('note-counter')).toHaveTextContent('Not saved yet');
  });

  it('seeds the box with an existing note', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        [PRODUCT]: { body: 'fixed leg', updatedOn: '2026-08-20', updatedAt: 0 },
      }),
    );

    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    expect(screen.getByTestId('note-input').props.value).toBe('fixed leg');
    expect(screen.getByTestId('note-counter')).toHaveTextContent(
      'Last edited 2026-08-20',
    );
  });

  /** Typing must not persist; only Save commits. */
  it('does not store a draft until it is saved', async () => {
    const store = createStore();
    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    await fireEvent.changeText(screen.getByTestId('note-input'), 'half a thought');

    expect(store.getState().notes.byProduct[PRODUCT]).toBeUndefined();
  });

  it('saves the draft on press', async () => {
    const store = createStore();
    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    await fireEvent.changeText(screen.getByTestId('note-input'), 'pay fixed');
    await fireEvent.press(screen.getByTestId('note-save'));

    expect(store.getState().notes.byProduct[PRODUCT]).toEqual({
      body: 'pay fixed',
      updatedOn: toDateKey(),
      updatedAt: expect.any(Number),
    });
  });

  it('offers nothing to save until the draft differs from what is stored', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        [PRODUCT]: { body: 'same', updatedOn: '2026-08-20', updatedAt: 0 },
      }),
    );
    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    expect(screen.getByTestId('note-save')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('note-input'), 'different');
    expect(screen.getByTestId('note-save')).not.toBeDisabled();
  });

  /**
   * Clearing the box is the delete gesture, so the control has to say so —
   * a button still reading "Save note" that deletes would be a trap.
   */
  it('relabels itself when clearing an existing note', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        [PRODUCT]: { body: 'doomed', updatedOn: '2026-08-20', updatedAt: 0 },
      }),
    );
    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    await fireEvent.changeText(screen.getByTestId('note-input'), '  ');

    expect(screen.getByText('Delete note')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('note-save'));
    expect(store.getState().notes.byProduct[PRODUCT]).toBeUndefined();
  });

  it('ignores whitespace-only changes to an existing note', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        [PRODUCT]: { body: 'stable', updatedOn: '2026-08-20', updatedAt: 0 },
      }),
    );
    await renderWithStore(<NoteEditor productId={PRODUCT} />, { store });

    await fireEvent.changeText(screen.getByTestId('note-input'), '  stable  ');

    expect(screen.getByTestId('note-save')).toBeDisabled();
  });
});
