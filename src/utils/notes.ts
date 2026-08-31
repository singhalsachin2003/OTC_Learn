/**
 * Study notes — a user's own words against a product.
 *
 * Notes are the one thing in the app the user authors rather than earns, which
 * sets the rules for handling them. They are never silently truncated, never
 * merged, and an empty note is a deletion rather than a stored blank: a note
 * someone cleared should not come back on the next launch as an empty card.
 */

/** Kept generous. This is a study note, not a tweet. */
export const NOTE_MAX_LENGTH = 2000;

export interface Note {
  /** The note itself, already trimmed. Never empty — see `editNote`. */
  body: string;
  /** Local date key of the last edit, for the notes list. */
  updatedOn: string;
  /**
   * Epoch milliseconds of the last edit, for sync to merge by. `updatedOn` is
   * what the notes list shows; this is what decides which of two edits wins.
   */
  updatedAt: number;
}

export type NoteMap = Readonly<Record<string, Note | undefined>>;

/**
 * Notes are keyed by what they are about, not only by product.
 *
 * A product note is keyed by the product id; a note on a key term is keyed by
 * the product and the term together. One map rather than two, and one column
 * rather than a second table, because `notes.product_id` in
 * `supabase/schema.sql` is plain text with no foreign key — the catalogue ships
 * inside the app, so the server was never interpreting that value. Widening it
 * from "a product id" to "what the note is about" therefore costs no migration
 * and no schema change, and term notes sync the day they exist.
 *
 * Split on the *first* separator, so a term containing one still parses.
 */
const KEY_SEPARATOR = '#';

export function noteKeyFor(productId: string, term?: string): string {
  return term === undefined ? productId : `${productId}${KEY_SEPARATOR}${term}`;
}

export interface NoteSubject {
  productId: string;
  /** Undefined when the note is about the product as a whole. */
  term?: string;
}

export function parseNoteKey(key: string): NoteSubject {
  const at = key.indexOf(KEY_SEPARATOR);
  if (at === -1) {
    return { productId: key };
  }
  return { productId: key.slice(0, at), term: key.slice(at + 1) };
}

/**
 * Applies an edit. Returns the note to store, or `null` to remove it.
 *
 * Trimming happens here rather than at the input, so whitespace a user is
 * mid-way through typing is not stolen from under the cursor — the decision
 * only lands when the edit is committed.
 */
export function editNote(
  body: string,
  today: string,
  now: Date = new Date(),
): Note | null {
  const trimmed = body.trim();
  if (trimmed.length === 0) {
    return null;
  }
  return {
    body: trimmed.slice(0, NOTE_MAX_LENGTH),
    updatedOn: today,
    updatedAt: now.getTime(),
  };
}

/** Whether a body would be stored, without building the note. */
export function isNoteEmpty(body: string): boolean {
  return body.trim().length === 0;
}

/** Characters left before the cap bites. Negative once it has. */
export function remainingLength(body: string): number {
  return NOTE_MAX_LENGTH - body.trim().length;
}

export interface NoteEntry extends Note, NoteSubject {
  /** The key it is stored under — `productId`, or `productId#term`. */
  key: string;
}

/**
 * Notes as a list, most recently edited first.
 *
 * Ties break on product id so the order is stable: two notes written on the
 * same day must not swap places between renders.
 */
export function sortedNotes(notes: NoteMap): NoteEntry[] {
  return Object.entries(notes)
    .flatMap(([key, note]) =>
      note === undefined ? [] : [{ key, ...parseNoteKey(key), ...note }],
    )
    .sort(
      (a, b) =>
        b.updatedOn.localeCompare(a.updatedOn) || a.key.localeCompare(b.key),
    );
}

/** A one-line preview for a list row. */
export function notePreview(body: string, limit: number = 80): string {
  const flattened = body.replace(/\s+/g, ' ').trim();
  return flattened.length <= limit
    ? flattened
    : `${flattened.slice(0, limit).trimEnd()}…`;
}
