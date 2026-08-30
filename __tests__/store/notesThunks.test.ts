import AsyncStorage from '@react-native-async-storage/async-storage';

import { createStore, type AppStore } from '../../src/store';
import { setNotes } from '../../src/store/slices/notesSlice';
import { resetEverything } from '../../src/store/thunks/bootstrapThunks';
import { saveProductNote } from '../../src/store/thunks/notesThunks';
import { toDateKey } from '../../src/utils/formatters';
import { NOTE_MAX_LENGTH } from '../../src/utils/notes';
import { loadNotes, STORAGE_KEYS } from '../../src/utils/storage';

async function stored(): Promise<unknown> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.notes);
  return raw === null ? null : JSON.parse(raw);
}

function notesOf(store: AppStore) {
  return store.getState().notes.byProduct;
}

describe('notes thunks', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('saves a note against a product and persists it', async () => {
    const store = createStore();

    await store.dispatch(
      saveProductNote({ productId: 'irs', body: '  fixed leg  ' }),
    );

    expect(notesOf(store).irs).toEqual({
      body: 'fixed leg',
      updatedOn: toDateKey(),
      updatedAt: expect.any(Number),
    });
    await expect(stored()).resolves.toMatchObject({ irs: { body: 'fixed leg' } });
  });

  it('replaces the note on a second edit rather than appending', async () => {
    const store = createStore();

    await store.dispatch(saveProductNote({ productId: 'irs', body: 'first' }));
    await store.dispatch(saveProductNote({ productId: 'irs', body: 'second' }));

    expect(notesOf(store).irs.body).toBe('second');
  });

  /** Clearing the box is how a note is deleted — there is no separate control. */
  it('deletes the note when the body is cleared', async () => {
    const store = createStore();
    await store.dispatch(saveProductNote({ productId: 'irs', body: 'temporary' }));

    await store.dispatch(saveProductNote({ productId: 'irs', body: '   ' }));

    expect(notesOf(store).irs).toBeUndefined();
    await expect(stored()).resolves.toEqual({});
  });

  it('leaves other products alone when one note is deleted', async () => {
    const store = createStore();
    await store.dispatch(saveProductNote({ productId: 'irs', body: 'keep' }));
    await store.dispatch(saveProductNote({ productId: 'cds', body: 'drop' }));

    await store.dispatch(saveProductNote({ productId: 'cds', body: '' }));

    expect(notesOf(store).irs.body).toBe('keep');
    expect(notesOf(store).cds).toBeUndefined();
  });

  it('caps an over-long note', async () => {
    const store = createStore();

    await store.dispatch(
      saveProductNote({
        productId: 'irs',
        body: 'x'.repeat(NOTE_MAX_LENGTH + 100),
      }),
    );

    expect(notesOf(store).irs.body).toHaveLength(NOTE_MAX_LENGTH);
  });

  /**
   * `clearAll` already removes the notes key, so the store has to be cleared
   * with it — otherwise the app shows notes that are no longer on disk until
   * the next launch silently drops them.
   */
  it('clears notes from memory as well as disk on a full reset', async () => {
    const store = createStore();
    await store.dispatch(saveProductNote({ productId: 'irs', body: 'mine' }));

    await store.dispatch(resetEverything());

    expect(notesOf(store)).toEqual({});
    await expect(loadNotes()).resolves.toEqual({});
  });
});

describe('notes storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('reads an absent key as an empty map', async () => {
    await expect(loadNotes()).resolves.toEqual({});
  });

  it('drops a malformed note rather than the whole map', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.notes,
      JSON.stringify({
        irs: { body: 'good', updatedOn: '2026-08-30' },
        cds: { body: 42 },
        fxfwd: null,
      }),
    );

    await expect(loadNotes()).resolves.toEqual({
      irs: {
        body: 'good',
        updatedOn: '2026-08-30',
        // No stamp on a note written before v3, so it falls back to its own
        // date key rather than to zero.
        updatedAt: Date.parse('2026-08-30T00:00:00'),
      },
    });
  });

  it('drops a blank note, which should never have been stored', async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.notes,
      JSON.stringify({ irs: { body: '   ', updatedOn: '2026-08-30' } }),
    );

    await expect(loadNotes()).resolves.toEqual({});
  });

  it('round-trips through the store', async () => {
    const store = createStore();
    store.dispatch(
      setNotes({
        irs: { body: 'kept', updatedOn: '2026-08-30', updatedAt: 0 },
      }),
    );

    await store.dispatch(saveProductNote({ productId: 'cds', body: 'added' }));

    await expect(loadNotes()).resolves.toMatchObject({
      irs: { body: 'kept' },
      cds: { body: 'added' },
    });
  });
});
