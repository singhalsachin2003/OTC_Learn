import AsyncStorage from '@react-native-async-storage/async-storage';

import { examResultId, type ExamResult } from './exam';
import type { Note } from './notes';
import { emptyProgress, MASTERY_COMPLETE, type ProductProgress } from './mastery';
import type { QuestionStat } from './quizSession';
import type { ReviewItem } from './review';

/**
 * Local persistence.
 *
 * Everything the app knows about a user lives here and nowhere else — there is
 * no account and no server. Two rules follow from that: a read must never throw
 * (a corrupt value should cost a user their streak, not their ability to open
 * the app), and a schema change must migrate rather than reset.
 */

/** AsyncStorage keys, namespaced so they never collide with library keys. */
export const STORAGE_KEYS = {
  schemaVersion: '@otc-learn/schema-version',
  /** v1 only. Read during migration, then deleted. */
  completedProducts: '@otc-learn/completed-products',
  progress: '@otc-learn/progress',
  questionHistory: '@otc-learn/question-history',
  reviewQueue: '@otc-learn/review-queue',
  streak: '@otc-learn/streak',
  studyDays: '@otc-learn/study-days',
  profile: '@otc-learn/profile',
  settings: '@otc-learn/settings',
  bookmarks: '@otc-learn/bookmarks',
  achievements: '@otc-learn/achievements',
  examResults: '@otc-learn/exam-results',
  notes: '@otc-learn/notes',
  /**
   * When settings and the profile name last changed. They merge as whole rows
   * rather than per field, so one timestamp each is enough — and keeping them
   * here rather than inside the payloads leaves `StoredSettings` and
   * `StoredProfile` exactly as every screen already knows them.
   */
  syncMeta: '@otc-learn/sync-meta',
  /**
   * Set once, for installs that were using the app before it had a paywall.
   * See `utils/access.ts` — this is what stops a subscription taking away
   * content someone already had.
   */
  grandfathered: '@otc-learn/grandfathered',
} as const;

export const SCHEMA_VERSION = 4;

export interface StoredStreak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

export interface StoredProfile {
  name: string | null;
}

export interface StoredSettings {
  spacedRepetition: boolean;
  timedQuizzes: boolean;
  haptics: boolean;
  dailyReminder: boolean;
  /** Questions drawn per quiz session. */
  sessionSize: number;
}

/**
 * Bounds on `sessionSize`, defined here rather than in the slice because both
 * the setter and the loader have to agree: the settings UI can only express
 * values in this range, so a stored value outside it is one the user could
 * neither have chosen nor undo.
 */
export const SESSION_SIZE_MIN = 3;
export const SESSION_SIZE_MAX = 12;

export function clampSessionSize(size: number): number {
  return Math.max(SESSION_SIZE_MIN, Math.min(SESSION_SIZE_MAX, Math.round(size)));
}

export const defaultSettings: StoredSettings = {
  spacedRepetition: true,
  timedQuizzes: false,
  haptics: true,
  // Off by default so the OS permission prompt appears when the user asks for
  // reminders, rather than ambushing them on first launch.
  dailyReminder: false,
  sessionSize: 6,
};

// ---------------------------------------------------------------------------
// Primitives

/**
 * Reads and JSON-parses a key. Storage failures and malformed payloads both
 * resolve to `null` rather than throwing — a corrupt cache should never stop
 * the app from launching.
 */
async function readJson<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

/** Writes a JSON payload. Returns whether the write succeeded. */
async function writeJson(key: string, value: unknown): Promise<boolean> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * The `updatedAt` a record carries, or the best approximation available.
 *
 * Records written before schema v3 have no timestamp. Rather than stamping them
 * all with the migration's own clock — which would make every legacy record on
 * a device look equally recent, and would order two devices by which happened to
 * open the app first — this falls back to the record's own date key. That is a
 * day's resolution, which is coarse, but it is at least *about* when the record
 * was last touched. Zero is the last resort, and a zero always loses a merge to
 * anything stamped.
 */
function parseUpdatedAt(value: unknown, fallbackDateKey: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof fallbackDateKey === 'string') {
    const parsed = Date.parse(`${fallbackDateKey}T00:00:00`);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Progress

/**
 * Validates one persisted progress record. Anything unparseable is dropped
 * rather than repaired: a half-trusted mastery figure is worse than a zero the
 * user can rebuild in one session.
 */
function parseProgress(value: unknown): ProductProgress | null {
  if (!isRecord(value) || typeof value.mastery !== 'number') {
    return null;
  }
  return {
    mastery: Math.max(0, Math.min(100, Math.round(value.mastery))),
    attempts: typeof value.attempts === 'number' ? value.attempts : 0,
    bestScorePct: typeof value.bestScorePct === 'number' ? value.bestScorePct : 0,
    lastStudiedOn:
      typeof value.lastStudiedOn === 'string' ? value.lastStudiedOn : null,
    updatedAt: parseUpdatedAt(value.updatedAt, value.lastStudiedOn),
  };
}

export async function loadProgressMap(): Promise<Record<string, ProductProgress>> {
  const stored = await readJson<unknown>(STORAGE_KEYS.progress);
  if (!isRecord(stored)) {
    return {};
  }
  const out: Record<string, ProductProgress> = {};
  for (const [id, value] of Object.entries(stored)) {
    const parsed = parseProgress(value);
    if (parsed !== null) {
      out[id] = parsed;
    }
  }
  return out;
}

export async function saveProgressMap(
  progress: Record<string, ProductProgress>,
): Promise<boolean> {
  return writeJson(STORAGE_KEYS.progress, progress);
}

// ---------------------------------------------------------------------------
// Question history

export async function loadQuestionHistory(): Promise<Record<string, QuestionStat>> {
  const stored = await readJson<unknown>(STORAGE_KEYS.questionHistory);
  if (!isRecord(stored)) {
    return {};
  }
  const out: Record<string, QuestionStat> = {};
  for (const [id, value] of Object.entries(stored)) {
    if (
      isRecord(value) &&
      typeof value.right === 'number' &&
      typeof value.wrong === 'number'
    ) {
      out[id] = { right: value.right, wrong: value.wrong };
    }
  }
  return out;
}

export async function saveQuestionHistory(
  history: Record<string, QuestionStat>,
): Promise<boolean> {
  return writeJson(STORAGE_KEYS.questionHistory, history);
}

// ---------------------------------------------------------------------------
// Review queue

export async function loadReviewQueue(): Promise<ReviewItem[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.reviewQueue);
  if (!Array.isArray(stored)) {
    return [];
  }
  // Mapped rather than filtered with a type predicate. A predicate would let a
  // record written before schema v3 through while asserting it is a full
  // `ReviewItem`, so every reader would believe it had an `updatedAt` it does
  // not have — the one kind of mistake the type system cannot catch for us.
  return stored.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== 'string' ||
      typeof item.productId !== 'string' ||
      typeof item.step !== 'number' ||
      typeof item.dueOn !== 'string' ||
      typeof item.lapses !== 'number'
    ) {
      return [];
    }
    return [
      {
        id: item.id,
        productId: item.productId,
        step: item.step,
        dueOn: item.dueOn,
        lapses: item.lapses,
        // No date on a queue item approximates when it was last touched —
        // `dueOn` is in the future by construction — so a legacy item starts
        // at zero and loses any merge against a stamped one.
        updatedAt: parseUpdatedAt(item.updatedAt, null),
      },
    ];
  });
}

export async function saveReviewQueue(
  queue: readonly ReviewItem[],
): Promise<boolean> {
  return writeJson(STORAGE_KEYS.reviewQueue, queue);
}

// ---------------------------------------------------------------------------
// Streak and study days

export async function loadStreak(): Promise<StoredStreak | null> {
  const stored = await readJson<Partial<StoredStreak>>(STORAGE_KEYS.streak);
  if (stored === null || typeof stored.currentStreak !== 'number') {
    return null;
  }
  return {
    currentStreak: stored.currentStreak,
    // Added in v2. An install upgrading mid-streak has no record of its best
    // run, so the current one is the most honest starting point.
    longestStreak:
      typeof stored.longestStreak === 'number'
        ? stored.longestStreak
        : stored.currentStreak,
    lastActivityDate:
      typeof stored.lastActivityDate === 'string' ? stored.lastActivityDate : null,
  };
}

export async function saveStreak(streak: StoredStreak): Promise<boolean> {
  return writeJson(STORAGE_KEYS.streak, streak);
}

/** Date keys on which the user studied — drives the week strip. */
export async function loadStudyDays(): Promise<string[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.studyDays);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored.filter((day): day is string => typeof day === 'string');
}

export async function saveStudyDays(days: readonly string[]): Promise<boolean> {
  return writeJson(STORAGE_KEYS.studyDays, days);
}

// ---------------------------------------------------------------------------
// Profile, settings, bookmarks, achievements

export async function loadProfile(): Promise<StoredProfile> {
  const stored = await readJson<Partial<StoredProfile>>(STORAGE_KEYS.profile);
  return { name: typeof stored?.name === 'string' ? stored.name : null };
}

export async function saveProfile(profile: StoredProfile): Promise<boolean> {
  return writeJson(STORAGE_KEYS.profile, profile);
}

export async function loadSettings(): Promise<StoredSettings> {
  const stored = await readJson<Partial<StoredSettings>>(STORAGE_KEYS.settings);
  if (stored === null) {
    // A copy, not the shared object: hydration puts this straight into the
    // store, and handing Redux the module singleton lets immer freeze it for
    // the rest of the process.
    return { ...defaultSettings };
  }
  // Merged onto the defaults, so a settings key added in a later release lands
  // on its default rather than `undefined` for everyone who already has a file.
  return {
    spacedRepetition: stored.spacedRepetition ?? defaultSettings.spacedRepetition,
    timedQuizzes: stored.timedQuizzes ?? defaultSettings.timedQuizzes,
    haptics: stored.haptics ?? defaultSettings.haptics,
    dailyReminder: stored.dailyReminder ?? defaultSettings.dailyReminder,
    // Clamped, not merely checked for sanity: `setSettings` installs this
    // payload wholesale, so a stored 99 — from a corrupt file, or a release
    // that widened the range and was rolled back — would otherwise drive the
    // quiz draw to a size the settings screen cannot express or undo.
    // A positive value is clamped into range; anything else — zero, negative,
    // NaN — is nonsense rather than an out-of-range preference, so it falls
    // back to the default instead of to the nearest bound.
    sessionSize:
      typeof stored.sessionSize === 'number' &&
      Number.isFinite(stored.sessionSize) &&
      stored.sessionSize > 0
        ? clampSessionSize(stored.sessionSize)
        : defaultSettings.sessionSize,
  };
}

export async function saveSettings(settings: StoredSettings): Promise<boolean> {
  return writeJson(STORAGE_KEYS.settings, settings);
}

/**
 * A bookmark and when it last changed.
 *
 * Stored as a record per product rather than a list of ids, because removing a
 * bookmark has to survive a merge with a device that still has it. An absent
 * entry cannot say "removed at"; `bookmarked: false` can.
 */
export interface BookmarkRecord {
  bookmarked: boolean;
  updatedAt: number;
}

export type BookmarkMap = Record<string, BookmarkRecord>;

/**
 * Reads the map, accepting the plain `string[]` written before sync existed.
 * A legacy list carries no times, so every entry starts at zero and loses any
 * merge against a stamped one.
 */
export async function loadBookmarkRecords(): Promise<BookmarkMap> {
  const stored = await readJson<unknown>(STORAGE_KEYS.bookmarks);

  if (Array.isArray(stored)) {
    const out: BookmarkMap = {};
    for (const id of stored) {
      if (typeof id === 'string') {
        out[id] = { bookmarked: true, updatedAt: 0 };
      }
    }
    return out;
  }

  if (!isRecord(stored)) {
    return {};
  }

  const out: BookmarkMap = {};
  for (const [id, value] of Object.entries(stored)) {
    if (isRecord(value) && typeof value.bookmarked === 'boolean') {
      out[id] = {
        bookmarked: value.bookmarked,
        updatedAt: parseUpdatedAt(value.updatedAt, null),
      };
    }
  }
  return out;
}

export async function saveBookmarkRecords(map: BookmarkMap): Promise<boolean> {
  return writeJson(STORAGE_KEYS.bookmarks, map);
}

/**
 * Just the saved ids, which is all the store and every screen want.
 *
 * Insertion order, not sorted: the list has always been the order things were
 * saved in, and a map preserves that for string keys. Sorting would have been a
 * quiet change to what the user sees for no reason sync needs.
 */
export async function loadBookmarks(): Promise<string[]> {
  const records = await loadBookmarkRecords();
  return Object.entries(records).flatMap(([id, record]) =>
    record.bookmarked ? [id] : [],
  );
}

/**
 * Persists the saved list, turning a removal into a tombstone rather than a
 * missing entry. The caller passes what the user now has saved; anything that
 * was saved before and is not in that list is recorded as un-saved, stamped
 * now, so the removal can win a merge later.
 */
export async function saveBookmarks(
  ids: readonly string[],
  now: number = Date.now(),
): Promise<boolean> {
  const existing = await loadBookmarkRecords();
  const wanted = new Set(ids);
  const next: BookmarkMap = { ...existing };

  for (const id of wanted) {
    if (existing[id]?.bookmarked !== true) {
      next[id] = { bookmarked: true, updatedAt: now };
    }
  }
  for (const [id, record] of Object.entries(existing)) {
    if (record.bookmarked && !wanted.has(id)) {
      next[id] = { bookmarked: false, updatedAt: now };
    }
  }

  return saveBookmarkRecords(next);
}

/** When settings and the profile name last changed. See `STORAGE_KEYS.syncMeta`. */
export interface SyncMeta {
  settingsUpdatedAt: number;
  profileUpdatedAt: number;
}

export const emptySyncMeta: SyncMeta = {
  settingsUpdatedAt: 0,
  profileUpdatedAt: 0,
};

export async function loadSyncMeta(): Promise<SyncMeta> {
  const stored = await readJson<unknown>(STORAGE_KEYS.syncMeta);
  if (!isRecord(stored)) {
    return { ...emptySyncMeta };
  }
  return {
    settingsUpdatedAt: parseUpdatedAt(stored.settingsUpdatedAt, null),
    profileUpdatedAt: parseUpdatedAt(stored.profileUpdatedAt, null),
  };
}

/** Merged onto what is stored, so stamping one does not clear the other. */
export async function saveSyncMeta(patch: Partial<SyncMeta>): Promise<boolean> {
  const current = await loadSyncMeta();
  return writeJson(STORAGE_KEYS.syncMeta, { ...current, ...patch });
}

/**
 * Sittings kept per install. An exam history is a trend, not a ledger, and the
 * screen that reads it shows a handful — so old sittings are dropped on write
 * rather than accumulating without bound for the life of the install.
 */
export const MAX_EXAM_RESULTS = 50;

function parseExamResult(value: unknown): ExamResult | null {
  if (
    !isRecord(value) ||
    typeof value.takenOn !== 'string' ||
    typeof value.scopeId !== 'string' ||
    typeof value.correct !== 'number' ||
    typeof value.total !== 'number' ||
    typeof value.scorePct !== 'number' ||
    typeof value.passed !== 'boolean'
  ) {
    return null;
  }
  return {
    // A sitting stored before v3 has no id. One is minted here so a caller
    // never sees a result without one; the migration writes them back, which is
    // what makes them stable rather than new on every load.
    id: typeof value.id === 'string' ? value.id : examResultId(value.takenOn),
    takenOn: value.takenOn,
    scopeId: value.scopeId,
    correct: value.correct,
    total: value.total,
    scorePct: value.scorePct,
    passed: value.passed,
    // Null is a real value here — it records a sitting that ran out of time —
    // so anything non-numeric reads as that rather than as a default.
    durationMs: typeof value.durationMs === 'number' ? value.durationMs : null,
  };
}

/**
 * Exam results arrived after schema v2 without a version bump, because an
 * absent key already loads as an empty history. v3 bumps it for a different
 * reason — see `migrateExamResultIds`.
 */
export async function loadExamResults(): Promise<ExamResult[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.examResults);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored
    .map(parseExamResult)
    .filter((result): result is ExamResult => result !== null);
}

export async function saveExamResults(
  results: readonly ExamResult[],
): Promise<boolean> {
  // Trimmed from the front: the newest sittings are the ones worth keeping.
  const trimmed =
    results.length > MAX_EXAM_RESULTS ? results.slice(-MAX_EXAM_RESULTS) : results;
  return writeJson(STORAGE_KEYS.examResults, trimmed);
}

/**
 * Notes are the only content the user authors, so a malformed entry is dropped
 * individually rather than failing the whole map — losing one note to a corrupt
 * write is bad, losing every note to it is worse.
 *
 * Additive like the exam history, so no schema bump: an absent key already
 * loads as an empty map.
 */
export async function loadNotes(): Promise<Record<string, Note>> {
  const stored = await readJson<unknown>(STORAGE_KEYS.notes);
  if (!isRecord(stored)) {
    return {};
  }
  const out: Record<string, Note> = {};
  for (const [productId, value] of Object.entries(stored)) {
    if (
      isRecord(value) &&
      typeof value.body === 'string' &&
      value.body.trim().length > 0 &&
      typeof value.updatedOn === 'string'
    ) {
      out[productId] = {
        body: value.body,
        updatedOn: value.updatedOn,
        updatedAt: parseUpdatedAt(value.updatedAt, value.updatedOn),
      };
    }
  }
  return out;
}

export async function saveNotes(
  notes: Readonly<Record<string, Note>>,
): Promise<boolean> {
  return writeJson(STORAGE_KEYS.notes, notes);
}

export async function loadAchievements(): Promise<string[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.achievements);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored.filter((id): id is string => typeof id === 'string');
}

export async function saveAchievements(ids: readonly string[]): Promise<boolean> {
  return writeJson(STORAGE_KEYS.achievements, ids);
}

// ---------------------------------------------------------------------------
// Migration

/**
 * v1 stored a flat array of completed product ids under its own key. v2 stores
 * a mastery record per product, so each completed id becomes a record at the
 * completion threshold: v1 marked a product complete for *finishing* a quiz
 * regardless of score, so its true mastery is unknown, and the threshold is the
 * only figure that both honours the badge the user earned and stays honest
 * about what was actually measured.
 *
 * Returns the migrated map, or null when there was nothing to migrate.
 */
export async function migrateV1Progress(): Promise<Record<
  string,
  ProductProgress
> | null> {
  const legacy = await readJson<unknown>(STORAGE_KEYS.completedProducts);
  if (!Array.isArray(legacy)) {
    return null;
  }

  const ids = legacy.filter((id): id is string => typeof id === 'string');
  const migrated: Record<string, ProductProgress> = {};
  for (const id of ids) {
    migrated[id] = {
      ...emptyProgress,
      mastery: MASTERY_COMPLETE,
      attempts: 1,
      bestScorePct: MASTERY_COMPLETE,
    };
  }
  return migrated;
}

/**
 * v2 -> v3: gives every stored sitting a stable id.
 *
 * `parseExamResult` already mints one for a record that lacks it, but a minted
 * id is only stable once it has been written back — otherwise every launch
 * invents a different one, and an upload keyed by it would record the same
 * sitting again each time. This is that write-back.
 *
 * Returns false only when there was something to write and the write failed,
 * so the caller can leave the version unstamped and try again next launch.
 */
export async function migrateExamResultIds(): Promise<boolean> {
  const stored = await readJson<unknown>(STORAGE_KEYS.examResults);
  if (!Array.isArray(stored)) {
    return true;
  }

  const needsId = stored.some(
    (value) => isRecord(value) && typeof value.id !== 'string',
  );
  if (!needsId) {
    return true;
  }

  // Parsing mints the ids; saving is what makes them stick.
  const parsed = stored
    .map(parseExamResult)
    .filter((result): result is ExamResult => result !== null);
  return saveExamResults(parsed);
}

/**
 * v3 -> v4: grants existing installs permanent access to the whole catalogue.
 *
 * The app shipped free with every asset class open, and people are studying
 * them now. Introducing a subscription that locks five of six would not be
 * putting a price on new work — it would be taking back what someone already
 * had, along with the mastery they built in it. So anyone whose install
 * predates the paywall keeps all of it, for good.
 *
 * "Predates the paywall" means any stored schema version at all: a device that
 * has run the app before has a version stamp, and a fresh install has none.
 * That is a cleaner test than looking for progress, because someone who
 * installed the app last week and has not finished a quiz yet is still an
 * existing user.
 */
export async function migrateGrandfathering(
  previousVersion: number | null,
): Promise<boolean> {
  if (previousVersion === null) {
    return true;
  }
  return writeJson(STORAGE_KEYS.grandfathered, true);
}

export async function loadGrandfathered(): Promise<boolean> {
  return (await readJson<boolean>(STORAGE_KEYS.grandfathered)) === true;
}

/**
 * Runs any pending migration and stamps the schema version.
 *
 * Idempotent: the version stamp is written last, so a crash mid-migration
 * leaves the old data in place and the next launch tries again.
 */
export async function runMigrations(): Promise<void> {
  const version = await readJson<number>(STORAGE_KEYS.schemaVersion);
  if (version === SCHEMA_VERSION) {
    return;
  }

  // Before anything else, and reading the version we arrived with rather than
  // the one we are about to write.
  if (!(await migrateGrandfathering(version))) {
    return;
  }

  const migrated = await migrateV1Progress();
  if (migrated !== null) {
    const existing = await loadProgressMap();
    // Existing v2 records win: if both exist the v2 one is newer by definition.
    const written = await saveProgressMap({ ...migrated, ...existing });

    // If the v2 write failed there is nowhere for that progress to live yet, so
    // the v1 key has to stay and the version must not be stamped — otherwise a
    // single failed write silently destroys everything the user had done.
    if (!written) {
      return;
    }

    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.completedProducts);
    } catch {
      // A stale v1 key is harmless — the version stamp stops it being re-read.
    }
  }

  // Same rule as the progress migration above: a failed write must not be
  // stamped as done, or the ids stay unstable and nothing retries.
  if (!(await migrateExamResultIds())) {
    return;
  }

  await writeJson(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION);
}

/** Clears all app-owned keys. Backs the "reset progress" action in Profile. */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch {
    // Nothing actionable — the caller is resetting state anyway.
  }
}
