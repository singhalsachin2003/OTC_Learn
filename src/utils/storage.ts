import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ExamResult } from './exam';
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
} as const;

export const SCHEMA_VERSION = 2;

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
  return stored.filter((item): item is ReviewItem => {
    return (
      isRecord(item) &&
      typeof item.id === 'string' &&
      typeof item.productId === 'string' &&
      typeof item.step === 'number' &&
      typeof item.dueOn === 'string' &&
      typeof item.lapses === 'number'
    );
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

export async function loadBookmarks(): Promise<string[]> {
  const stored = await readJson<unknown>(STORAGE_KEYS.bookmarks);
  if (!Array.isArray(stored)) {
    return [];
  }
  return stored.filter((id): id is string => typeof id === 'string');
}

export async function saveBookmarks(ids: readonly string[]): Promise<boolean> {
  return writeJson(STORAGE_KEYS.bookmarks, ids);
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
 * Added after schema v2 without a version bump: an absent key already loads as
 * an empty history, so there is nothing to migrate. Bumping the version would
 * only re-run the v1 progress migration against installs that have no v1 data
 * left to migrate.
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
