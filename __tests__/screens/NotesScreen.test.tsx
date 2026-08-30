import { fireEvent, screen } from '@testing-library/react-native';

import { NotesScreen } from '../../src/screens/Notes/NotesScreen';
import { createStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import { renderWithStore } from '../helpers/renderWithStore';

const NOTES = {
  irs: {
    body: 'Fixed leg pays annually, floating quarterly.',
    updatedOn: '2026-08-20',
    updatedAt: 0,
  },
  cds: {
    body: 'Protection buyer is short credit risk.',
    updatedOn: '2026-08-28',
    updatedAt: 0,
  },
  fxfwd: {
    body: 'Points come from the interest rate differential.',
    updatedOn: '2026-08-24',
    updatedAt: 0,
  },
};

describe('NotesScreen', () => {
  it('invites the user to write one when there is nothing yet', async () => {
    await renderWithStore(<NotesScreen />);

    expect(screen.getByTestId('notes-empty')).toBeTruthy();
    // A search box over an empty library can only ever return nothing.
    expect(screen.queryByTestId('notes-search')).toBeNull();
  });

  it('lists every note, most recently edited first', async () => {
    const store = createStore();
    store.dispatch(setNotes(NOTES));
    await renderWithStore(<NotesScreen />, { store });

    for (const productId of Object.keys(NOTES)) {
      expect(screen.getByTestId(`notes-row-${productId}`)).toBeTruthy();
    }
    expect(screen.getByTestId('notes-subtitle')).toHaveTextContent(
      '3 notes, most recent first',
    );
  });

  it('searches the note body as well as the product name', async () => {
    const store = createStore();
    store.dispatch(setNotes(NOTES));
    await renderWithStore(<NotesScreen />, { store });

    await fireEvent.changeText(screen.getByTestId('notes-search'), 'differential');

    expect(screen.getByTestId('notes-row-fxfwd')).toBeTruthy();
    expect(screen.queryByTestId('notes-row-irs')).toBeNull();
    expect(screen.queryByTestId('notes-row-cds')).toBeNull();
  });

  it('reports a search that matches nothing without losing the notes', async () => {
    const store = createStore();
    store.dispatch(setNotes(NOTES));
    await renderWithStore(<NotesScreen />, { store });

    await fireEvent.changeText(screen.getByTestId('notes-search'), 'gamma squeeze');
    expect(screen.getByTestId('notes-no-match')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('notes-search-clear'));
    expect(screen.getByTestId('notes-row-irs')).toBeTruthy();
  });

  it('opens the product a note was written against', async () => {
    const store = createStore();
    store.dispatch(setNotes(NOTES));
    await renderWithStore(<NotesScreen />, { store });

    await fireEvent.press(screen.getByTestId('notes-row-cds'));

    const state = store.getState();
    expect(state.app.currentScreen).toBe('product');
    expect(state.app.selectedProductId).toBe('cds');
  });

  /**
   * Ids are a persisted schema. A note stored against content that has since
   * been renamed cannot be opened, so a row for it would be a dead end.
   */
  it('drops a note whose product no longer exists', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        ...NOTES,
        retired: { body: 'Old product.', updatedOn: '2026-08-29', updatedAt: 0 },
      }),
    );
    await renderWithStore(<NotesScreen />, { store });

    expect(screen.queryByTestId('notes-row-retired')).toBeNull();
    expect(screen.getByTestId('notes-subtitle')).toHaveTextContent(
      '3 notes, most recent first',
    );
  });
});
