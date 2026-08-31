import { fireEvent, screen } from '@testing-library/react-native';

import { allKeyTerms } from '../../src/data/products';
import { GlossaryScreen } from '../../src/screens/Glossary/GlossaryScreen';
import { createStore, type AppStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import { noteKeyFor } from '../../src/utils/notes';
import { renderWithStore } from '../helpers/renderWithStore';

const TERM = allKeyTerms()[0];
const KEY = noteKeyFor(TERM.productId, TERM.term);
const NOTE_BUTTON = `glossary-note-${TERM.productId}-${TERM.term}`;
const EDITOR = `glossary-editor-${TERM.productId}-${TERM.term}`;

async function openGlossary(store: AppStore = createStore()) {
  await renderWithStore(<GlossaryScreen />, { store });
  return store;
}

/**
 * Opens the glossary and searches down to one term first.
 *
 * The full list is 216 rows and takes the best part of a second to render, so
 * six of them in one file is twenty seconds and a flaky timeout under load.
 * Searching is also how anyone reaches a term in a list that long.
 */
async function openTerm(store: AppStore = createStore()) {
  await renderWithStore(<GlossaryScreen />, { store });
  await fireEvent.changeText(screen.getByTestId('glossary-search'), TERM.term);
  return store;
}

describe('notes on glossary terms', () => {
  it('offers a note control on every term without opening one', async () => {
    await openGlossary();

    expect(screen.getByTestId(NOTE_BUTTON)).toBeTruthy();
    expect(screen.queryByTestId(EDITOR)).toBeNull();
  });

  it('opens an editor for that term, and closes it again', async () => {
    await openTerm();

    await fireEvent.press(screen.getByTestId(NOTE_BUTTON));
    expect(screen.getByTestId(EDITOR)).toBeTruthy();

    await fireEvent.press(screen.getByTestId(NOTE_BUTTON));
    expect(screen.queryByTestId(EDITOR)).toBeNull();
  });

  it('stores the note against the term, not the product', async () => {
    const store = await openTerm();

    await fireEvent.press(screen.getByTestId(NOTE_BUTTON));
    await fireEvent.changeText(
      screen.getByTestId(`${EDITOR}-input`),
      'the reference amount',
    );
    await fireEvent.press(screen.getByTestId(`${EDITOR}-save`));

    const notes = store.getState().notes.byProduct;
    expect(notes[KEY]?.body).toBe('the reference amount');
    // The product's own note is untouched — they are different notes.
    expect(notes[TERM.productId]).toBeUndefined();
  });

  it('seeds the editor with a note already written', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({ [KEY]: { body: 'kept', updatedOn: '2026-08-30', updatedAt: 0 } }),
    );
    await openTerm(store);

    await fireEvent.press(screen.getByTestId(NOTE_BUTTON));

    expect(screen.getByTestId(`${EDITOR}-input`)).toHaveDisplayValue('kept');
  });

  /**
   * Tapping the row means "explain this". Folding a second meaning into the
   * same target would make one of the two a surprise.
   */
  it('leaves the row itself opening the product', async () => {
    const store = await openTerm();

    await fireEvent.press(
      screen.getByTestId(`glossary-${TERM.productId}-${TERM.term}`),
    );

    expect(store.getState().app.selectedProductId).toBe(TERM.productId);
    expect(screen.queryByTestId(EDITOR)).toBeNull();
  });

  /** A screen of open text boxes is a form; this is a list you annotate. */
  it('keeps only one editor open at a time', async () => {
    const second = allKeyTerms().find((t) => t.term !== TERM.term)!;
    const secondButton = `glossary-note-${second.productId}-${second.term}`;
    await openGlossary();

    await fireEvent.press(screen.getByTestId(NOTE_BUTTON));
    await fireEvent.press(screen.getByTestId(secondButton));

    expect(screen.queryByTestId(EDITOR)).toBeNull();
    expect(
      screen.getByTestId(`glossary-editor-${second.productId}-${second.term}`),
    ).toBeTruthy();
  });
});
