import {
  editNote,
  isNoteEmpty,
  noteKeyFor,
  notePreview,
  parseNoteKey,
  NOTE_MAX_LENGTH,
  remainingLength,
  sortedNotes,
  type NoteMap,
} from '../../src/utils/notes';

const TODAY = '2026-08-30';

describe('editNote', () => {
  it('stores a trimmed note', () => {
    const now = new Date(2026, 7, 30, 9, 0);
    expect(editNote('  a swap is a swap  ', TODAY, now)).toEqual({
      body: 'a swap is a swap',
      updatedOn: TODAY,
      updatedAt: now.getTime(),
    });
  });

  /**
   * An empty note is a deletion. Storing a blank would bring the note back on
   * the next launch as an empty card the user has to clear again.
   */
  it('treats an empty body as a deletion', () => {
    expect(editNote('', TODAY)).toBeNull();
    expect(editNote('   \n  ', TODAY)).toBeNull();
  });

  it('caps a very long note rather than rejecting it', () => {
    const note = editNote('x'.repeat(NOTE_MAX_LENGTH + 500), TODAY);

    expect(note?.body).toHaveLength(NOTE_MAX_LENGTH);
  });

  it('keeps internal whitespace, trimming only the ends', () => {
    expect(editNote('  two\n\nparagraphs  ', TODAY)?.body).toBe(
      'two\n\nparagraphs',
    );
  });
});

describe('isNoteEmpty', () => {
  it('is true only for whitespace', () => {
    expect(isNoteEmpty('')).toBe(true);
    expect(isNoteEmpty('  \t ')).toBe(true);
    expect(isNoteEmpty(' a ')).toBe(false);
  });
});

describe('remainingLength', () => {
  it('counts down from the cap', () => {
    expect(remainingLength('')).toBe(NOTE_MAX_LENGTH);
    expect(remainingLength('abc')).toBe(NOTE_MAX_LENGTH - 3);
  });

  it('goes negative once the cap is passed', () => {
    expect(remainingLength('x'.repeat(NOTE_MAX_LENGTH + 5))).toBe(-5);
  });
});

describe('note keys', () => {
  it('keys a product note by the product alone', () => {
    expect(noteKeyFor('irs')).toBe('irs');
    expect(parseNoteKey('irs')).toEqual({ productId: 'irs' });
  });

  it('keys a term note by product and term', () => {
    const key = noteKeyFor('irs', 'Notional');

    expect(parseNoteKey(key)).toEqual({ productId: 'irs', term: 'Notional' });
  });

  it('round-trips a term containing the separator', () => {
    const key = noteKeyFor('irs', 'A#B');

    expect(parseNoteKey(key)).toEqual({ productId: 'irs', term: 'A#B' });
  });

  it('round-trips terms with spaces and punctuation', () => {
    for (const term of ['Fixed leg', '25-delta', 'Day-count (ACT/360)']) {
      expect(parseNoteKey(noteKeyFor('irs', term)).term).toBe(term);
    }
  });
});

describe('sortedNotes', () => {
  const notes: NoteMap = {
    irs: { body: 'first', updatedOn: '2026-08-01', updatedAt: 0 },
    fxfwd: { body: 'latest', updatedOn: '2026-08-30', updatedAt: 0 },
    cds: { body: 'middle', updatedOn: '2026-08-15', updatedAt: 0 },
  };

  it('lists the most recently edited first', () => {
    expect(sortedNotes(notes).map((n) => n.productId)).toEqual([
      'fxfwd',
      'cds',
      'irs',
    ]);
  });

  it('breaks ties on product id so the order is stable', () => {
    const sameDay: NoteMap = {
      zeta: { body: 'z', updatedOn: TODAY, updatedAt: 0 },
      alpha: { body: 'a', updatedOn: TODAY, updatedAt: 0 },
    };

    expect(sortedNotes(sameDay).map((n) => n.productId)).toEqual(['alpha', 'zeta']);
    expect(sortedNotes(sameDay)).toEqual(sortedNotes(sameDay));
  });

  it('skips absent entries rather than listing them blank', () => {
    expect(sortedNotes({ irs: undefined })).toEqual([]);
  });

  it('handles an empty map', () => {
    expect(sortedNotes({})).toEqual([]);
  });
});

describe('notePreview', () => {
  it('collapses newlines into a single line', () => {
    expect(notePreview('two\n\n  lines')).toBe('two lines');
  });

  it('leaves a short note whole', () => {
    expect(notePreview('short')).toBe('short');
  });

  it('ellipsises a long note without a dangling space', () => {
    const preview = notePreview(`${'a'.repeat(78)} bcd`, 80);

    expect(preview.endsWith('…')).toBe(true);
    expect(preview).not.toContain(' …');
  });
});
