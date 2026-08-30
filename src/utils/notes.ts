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

export interface NoteEntry extends Note {
  productId: string;
}

/**
 * Notes as a list, most recently edited first.
 *
 * Ties break on product id so the order is stable: two notes written on the
 * same day must not swap places between renders.
 */
export function sortedNotes(notes: NoteMap): NoteEntry[] {
  return Object.entries(notes)
    .flatMap(([productId, note]) =>
      note === undefined ? [] : [{ productId, ...note }],
    )
    .sort(
      (a, b) =>
        b.updatedOn.localeCompare(a.updatedOn) ||
        a.productId.localeCompare(b.productId),
    );
}

/** A one-line preview for a list row. */
export function notePreview(body: string, limit: number = 80): string {
  const flattened = body.replace(/\s+/g, ' ').trim();
  return flattened.length <= limit
    ? flattened
    : `${flattened.slice(0, limit).trimEnd()}…`;
}
