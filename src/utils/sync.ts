import type { ExamResult } from './exam';
import type { ProductProgress } from './mastery';
import type { Note } from './notes';
import type { QuestionStat } from './quizSession';
import type { ReviewItem } from './review';
import {
  clampSessionSize,
  type BookmarkMap,
  type StoredSettings,
  type StoredStreak,
} from './storage';

/**
 * Merge rules for progress sync.
 *
 * Every function here is pure and total: local state in, remote rows in, merged
 * local state out. Nothing throws, nothing reaches the network, and nothing
 * reads a clock — which matters because these decide whose study history
 * survives, and a rule that cannot be tested exhaustively is a rule nobody
 * should trust with that.
 *
 * Two rules do most of the work, and both exist to be stable under repeat:
 *
 * - **Counters take the greater, never the sum.** Both devices count the same
 *   local history, so adding them inflates every figure each time a device
 *   re-uploads. Sync is retried far more often than it succeeds cleanly, so
 *   idempotence matters more than precision.
 * - **Last write wins, on an explicit timestamp.** A record stamped 0 — one
 *   written before schema v3 — always loses to one that carries a real time.
 *
 * The prose version, with the reasoning, is in `supabase/sync.md`.
 */

// ---------------------------------------------------------------------------
// Row shapes
//
// snake_case, mirroring `supabase/schema.sql` exactly. The mapping happens here
// rather than being smeared across callers, so a column rename breaks in one
// file.

export interface ProgressRow {
  product_id: string;
  mastery: number;
  attempts: number;
  best_score_pct: number;
  last_studied_on: string | null;
  updated_at: string;
}

export interface QuestionHistoryRow {
  question_id: string;
  right_count: number;
  wrong_count: number;
}

export interface ReviewRow {
  question_id: string;
  product_id: string;
  step: number;
  due_on: string;
  lapses: number;
  retired_at: string | null;
  updated_at: string;
}

export interface NoteRow {
  product_id: string;
  body: string | null;
  updated_on: string;
  updated_at: string;
}

export interface ExamResultRow {
  client_id: string;
  taken_on: string;
  scope_id: string;
  correct: number;
  total: number;
  score_pct: number;
  passed: boolean;
  duration_ms: number | null;
}

export interface SettingsRow {
  spaced_repetition: boolean;
  timed_quizzes: boolean;
  haptics: boolean;
  daily_reminder: boolean;
  session_size: number;
  updated_at: string;
}

export interface ProfileRow {
  display_name: string | null;
  updated_at: string;
}

export interface BookmarkRow {
  product_id: string;
  bookmarked: boolean;
  updated_at: string;
}

export interface StreakRow {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  updated_at: string;
}

/**
 * Postgres hands back `timestamptz` as an ISO string. An unparseable one reads
 * as 0 rather than `NaN`, so a malformed row loses a merge instead of poisoning
 * every comparison it takes part in — `NaN` compares false against everything,
 * which would silently make both sides lose.
 */
export function msFrom(iso: string | null): number {
  if (iso === null) {
    return 0;
  }
  const parsed = Date.parse(iso);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function isoFrom(ms: number): string {
  return new Date(ms).toISOString();
}

// ---------------------------------------------------------------------------
// Mastery

export function progressToRow(
  productId: string,
  progress: ProductProgress,
): ProgressRow {
  return {
    product_id: productId,
    mastery: progress.mastery,
    attempts: progress.attempts,
    best_score_pct: progress.bestScorePct,
    last_studied_on: progress.lastStudiedOn,
    updated_at: isoFrom(progress.updatedAt),
  };
}

/**
 * Mastery merges by timestamp; the two counters beside it do not.
 *
 * `attempts` and `bestScorePct` take the greater because both are monotonic by
 * construction — the app never decrements a count and never revises a personal
 * best down. Letting them ride on the same last-write-wins as `mastery` would
 * mean an older device could lower a best score it simply had not heard about.
 */
export function mergeProgress(
  local: Readonly<Record<string, ProductProgress>>,
  remote: readonly ProgressRow[],
): Record<string, ProductProgress> {
  const merged: Record<string, ProductProgress> = { ...local };

  for (const row of remote) {
    const mine = merged[row.product_id];
    const theirUpdatedAt = msFrom(row.updated_at);

    if (mine === undefined) {
      merged[row.product_id] = {
        mastery: row.mastery,
        attempts: row.attempts,
        bestScorePct: row.best_score_pct,
        lastStudiedOn: row.last_studied_on,
        updatedAt: theirUpdatedAt,
      };
      continue;
    }

    const theirsIsNewer = theirUpdatedAt > mine.updatedAt;
    merged[row.product_id] = {
      mastery: theirsIsNewer ? row.mastery : mine.mastery,
      attempts: Math.max(mine.attempts, row.attempts),
      bestScorePct: Math.max(mine.bestScorePct, row.best_score_pct),
      lastStudiedOn: theirsIsNewer ? row.last_studied_on : mine.lastStudiedOn,
      updatedAt: Math.max(mine.updatedAt, theirUpdatedAt),
    };
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Question history

export function questionHistoryToRows(
  history: Readonly<Record<string, QuestionStat | undefined>>,
): QuestionHistoryRow[] {
  return Object.entries(history).flatMap(([questionId, stat]) =>
    stat === undefined
      ? []
      : [
          {
            question_id: questionId,
            right_count: stat.right,
            wrong_count: stat.wrong,
          },
        ],
  );
}

/** Greater per counter — see the note at the top about summing. */
export function mergeQuestionHistory(
  local: Readonly<Record<string, QuestionStat | undefined>>,
  remote: readonly QuestionHistoryRow[],
): Record<string, QuestionStat> {
  const merged: Record<string, QuestionStat> = {};
  for (const [id, stat] of Object.entries(local)) {
    if (stat !== undefined) {
      merged[id] = { ...stat };
    }
  }

  for (const row of remote) {
    const mine = merged[row.question_id];
    merged[row.question_id] = {
      right: Math.max(mine?.right ?? 0, row.right_count),
      wrong: Math.max(mine?.wrong ?? 0, row.wrong_count),
    };
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Review queue

export function reviewToRow(item: ReviewItem): ReviewRow {
  return {
    question_id: item.id,
    product_id: item.productId,
    step: item.step,
    due_on: item.dueOn,
    lapses: item.lapses,
    retired_at: null,
    updated_at: isoFrom(item.updatedAt),
  };
}

/**
 * Last write wins, with retirement as a tombstone rather than an absent row.
 *
 * Retiring a question is a deletion in the app, and a deletion cannot be
 * represented by a missing row: the device that still holds the item would read
 * its own copy as new and put the question straight back into the queue. So a
 * retired row removes the item locally — provided the retirement is newer than
 * whatever the device has done with it since.
 */
export function mergeReviewQueue(
  local: readonly ReviewItem[],
  remote: readonly ReviewRow[],
): ReviewItem[] {
  const byId = new Map(local.map((item) => [item.id, item]));

  for (const row of remote) {
    const mine = byId.get(row.question_id);
    const theirUpdatedAt = msFrom(row.updated_at);

    if (mine !== undefined && mine.updatedAt >= theirUpdatedAt) {
      continue;
    }

    if (row.retired_at !== null) {
      byId.delete(row.question_id);
      continue;
    }

    byId.set(row.question_id, {
      id: row.question_id,
      productId: row.product_id,
      step: row.step,
      dueOn: row.due_on,
      lapses: Math.max(mine?.lapses ?? 0, row.lapses),
      updatedAt: theirUpdatedAt,
    });
  }

  return [...byId.values()];
}

// ---------------------------------------------------------------------------
// Notes

export function noteToRow(productId: string, note: Note): NoteRow {
  return {
    product_id: productId,
    body: note.body,
    updated_on: note.updatedOn,
    updated_at: isoFrom(note.updatedAt),
  };
}

/**
 * Last write wins, with a null body meaning the note was cleared.
 *
 * Notes are the one thing in the app the user writes rather than earns, so the
 * bar is higher than elsewhere: the merge must never resurrect a note somebody
 * deliberately deleted, and must never drop one they are still editing on
 * another device. A tombstone does both, where an absent row could do neither.
 */
export function mergeNotes(
  local: Readonly<Record<string, Note | undefined>>,
  remote: readonly NoteRow[],
): Record<string, Note> {
  const merged: Record<string, Note> = {};
  for (const [id, note] of Object.entries(local)) {
    if (note !== undefined) {
      merged[id] = { ...note };
    }
  }

  for (const row of remote) {
    const mine = merged[row.product_id];
    const theirUpdatedAt = msFrom(row.updated_at);

    if (mine !== undefined && mine.updatedAt >= theirUpdatedAt) {
      continue;
    }

    if (row.body === null) {
      delete merged[row.product_id];
      continue;
    }

    merged[row.product_id] = {
      body: row.body,
      updatedOn: row.updated_on,
      updatedAt: theirUpdatedAt,
    };
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Sets that only ever grow

/** Study days and achievements both union: neither is ever taken away. */
export function mergeStringSet(
  local: readonly string[],
  remote: readonly string[],
): string[] {
  return [...new Set([...local, ...remote])].sort();
}

// ---------------------------------------------------------------------------
// Exam results

export function examResultToRow(result: ExamResult): ExamResultRow {
  return {
    client_id: result.id,
    taken_on: result.takenOn,
    scope_id: result.scopeId,
    correct: result.correct,
    total: result.total,
    score_pct: result.scorePct,
    passed: result.passed,
    duration_ms: result.durationMs,
  };
}

/**
 * Union by id, oldest first — a sitting that happened cannot un-happen, and
 * nothing ever revises one. The id is what makes this idempotent; see
 * `examResultId`.
 */
export function mergeExamResults(
  local: readonly ExamResult[],
  remote: readonly ExamResultRow[],
): ExamResult[] {
  const byId = new Map(local.map((result) => [result.id, result]));

  for (const row of remote) {
    if (byId.has(row.client_id)) {
      continue;
    }
    byId.set(row.client_id, {
      id: row.client_id,
      takenOn: row.taken_on,
      scopeId: row.scope_id,
      correct: row.correct,
      total: row.total,
      scorePct: row.score_pct,
      passed: row.passed,
      durationMs: row.duration_ms,
    });
  }

  return [...byId.values()].sort((a, b) => a.takenOn.localeCompare(b.takenOn));
}

// ---------------------------------------------------------------------------
// Settings, profile and bookmarks

export function settingsToRow(
  settings: StoredSettings,
  updatedAt: number,
): SettingsRow {
  return {
    spaced_repetition: settings.spacedRepetition,
    timed_quizzes: settings.timedQuizzes,
    haptics: settings.haptics,
    daily_reminder: settings.dailyReminder,
    session_size: settings.sessionSize,
    updated_at: isoFrom(updatedAt),
  };
}

/**
 * Whole-row last write wins.
 *
 * Settings are merged together rather than field by field because they are a
 * set of choices made at one sitting, not independent facts: someone who turns
 * spaced repetition off and shortens their sessions has expressed one
 * intention, and splitting it across two devices would produce a combination
 * neither of them chose.
 *
 * `dailyReminder` is carried like the rest, but see the note in
 * `utils/notifications.ts` — the OS is the source of truth for whether a
 * notification can actually be shown, and `syncReminder` reconciles on launch.
 */
export function mergeSettings(
  local: StoredSettings,
  localUpdatedAt: number,
  remote: SettingsRow | null,
): StoredSettings {
  if (remote === null || msFrom(remote.updated_at) <= localUpdatedAt) {
    return local;
  }
  return {
    spacedRepetition: remote.spaced_repetition,
    timedQuizzes: remote.timed_quizzes,
    haptics: remote.haptics,
    dailyReminder: remote.daily_reminder,
    sessionSize: clampSessionSize(remote.session_size),
  };
}

export function profileToRow(name: string | null, updatedAt: number): ProfileRow {
  return { display_name: name, updated_at: isoFrom(updatedAt) };
}

/** Last write wins. Null is a real value — it is the unnamed state. */
export function mergeProfileName(
  local: string | null,
  localUpdatedAt: number,
  remote: ProfileRow | null,
): string | null {
  if (remote === null || msFrom(remote.updated_at) <= localUpdatedAt) {
    return local;
  }
  return remote.display_name;
}

export function bookmarksToRows(bookmarks: BookmarkMap): BookmarkRow[] {
  return Object.entries(bookmarks).map(([productId, record]) => ({
    product_id: productId,
    bookmarked: record.bookmarked,
    updated_at: isoFrom(record.updatedAt),
  }));
}

/**
 * Per product, last write wins on the flag.
 *
 * A removal is `bookmarked: false` rather than a missing row, for the same
 * reason a retired review item is a tombstone: the device that still has the
 * product saved would otherwise read its own copy as new and put it back.
 */
export function mergeBookmarks(
  local: BookmarkMap,
  remote: readonly BookmarkRow[],
): BookmarkMap {
  const merged: BookmarkMap = { ...local };

  for (const row of remote) {
    const mine = merged[row.product_id];
    const theirUpdatedAt = msFrom(row.updated_at);
    if (mine === undefined || theirUpdatedAt > mine.updatedAt) {
      merged[row.product_id] = {
        bookmarked: row.bookmarked,
        updatedAt: theirUpdatedAt,
      };
    }
  }

  return merged;
}

/** The saved ids, in the shape and order the store holds them. */
export function bookmarkedIds(bookmarks: BookmarkMap): string[] {
  return Object.entries(bookmarks).flatMap(([id, record]) =>
    record.bookmarked ? [id] : [],
  );
}

// ---------------------------------------------------------------------------
// Streak

/**
 * The longest streak takes the greater; the live figures follow the later
 * write.
 *
 * A personal best is a record of something that happened, on the same reasoning
 * as `bestScorePct` — a device that has been offline for a month must not lower
 * it. The current streak cannot be merged that way, because a streak is only
 * true relative to a date: taking the larger of two would invent a run the user
 * never had.
 */
export function mergeStreak(
  local: StoredStreak,
  localUpdatedAt: number,
  remote: StreakRow | null,
): StoredStreak {
  if (remote === null) {
    return local;
  }

  const theirsIsNewer = msFrom(remote.updated_at) > localUpdatedAt;
  const live = theirsIsNewer
    ? {
        currentStreak: remote.current_streak,
        lastActivityDate: remote.last_activity_date,
      }
    : {
        currentStreak: local.currentStreak,
        lastActivityDate: local.lastActivityDate,
      };

  return {
    ...live,
    longestStreak: Math.max(local.longestStreak, remote.longest_streak),
  };
}

// ---------------------------------------------------------------------------
// The whole picture

/** Everything sync moves, in the app's own shapes. */
export interface LocalSnapshot {
  progress: Record<string, ProductProgress>;
  questionHistory: Record<string, QuestionStat | undefined>;
  reviewQueue: ReviewItem[];
  notes: Record<string, Note | undefined>;
  studyDays: string[];
  achievements: string[];
  examResults: ExamResult[];
  streak: StoredStreak;
  /** When the streak figures last changed, since `StoredStreak` carries no time. */
  streakUpdatedAt: number;
  settings: StoredSettings;
  settingsUpdatedAt: number;
  profileName: string | null;
  profileUpdatedAt: number;
  bookmarks: BookmarkMap;
}

/**
 * The result of a merge: the same picture with the holes closed.
 *
 * `LocalSnapshot` tolerates `undefined` values because that is what a
 * `Record` in Redux genuinely holds — a deleted note leaves a hole. A merged
 * snapshot has resolved every one of those, and saying so in the type stops
 * each caller from re-proving it.
 */
export interface SyncedSnapshot extends LocalSnapshot {
  questionHistory: Record<string, QuestionStat>;
  notes: Record<string, Note>;
}

/** The same, in the shapes Postgres returns. */
export interface RemoteSnapshot {
  progress: ProgressRow[];
  questionHistory: QuestionHistoryRow[];
  reviewQueue: ReviewRow[];
  notes: NoteRow[];
  studyDays: string[];
  achievements: string[];
  examResults: ExamResultRow[];
  streak: StreakRow | null;
  settings: SettingsRow | null;
  profile: ProfileRow | null;
  bookmarks: BookmarkRow[];
}

export const emptyRemoteSnapshot: RemoteSnapshot = {
  progress: [],
  questionHistory: [],
  reviewQueue: [],
  notes: [],
  studyDays: [],
  achievements: [],
  examResults: [],
  streak: null,
  settings: null,
  profile: null,
  bookmarks: [],
};

/**
 * Applies every rule above in one pass.
 *
 * The result is what both sides should hold, which is why the caller pushes
 * *this* rather than what it started with: one round trip converges the device
 * and the server together, instead of leaving the server a version behind until
 * the next sync.
 */
export function mergeSnapshot(
  local: LocalSnapshot,
  remote: RemoteSnapshot,
): SyncedSnapshot {
  return {
    progress: mergeProgress(local.progress, remote.progress),
    questionHistory: mergeQuestionHistory(
      local.questionHistory,
      remote.questionHistory,
    ),
    reviewQueue: mergeReviewQueue(local.reviewQueue, remote.reviewQueue),
    notes: mergeNotes(local.notes, remote.notes),
    studyDays: mergeStringSet(local.studyDays, remote.studyDays),
    achievements: mergeStringSet(local.achievements, remote.achievements),
    examResults: mergeExamResults(local.examResults, remote.examResults),
    streak: mergeStreak(local.streak, local.streakUpdatedAt, remote.streak),
    streakUpdatedAt: Math.max(
      local.streakUpdatedAt,
      msFrom(remote.streak?.updated_at ?? null),
    ),
    settings: mergeSettings(
      local.settings,
      local.settingsUpdatedAt,
      remote.settings,
    ),
    settingsUpdatedAt: Math.max(
      local.settingsUpdatedAt,
      msFrom(remote.settings?.updated_at ?? null),
    ),
    profileName: mergeProfileName(
      local.profileName,
      local.profileUpdatedAt,
      remote.profile,
    ),
    profileUpdatedAt: Math.max(
      local.profileUpdatedAt,
      msFrom(remote.profile?.updated_at ?? null),
    ),
    bookmarks: mergeBookmarks(local.bookmarks, remote.bookmarks),
  };
}

/**
 * Moves a snapshot between the device and wherever it is stored.
 *
 * An interface rather than a concrete client, so the orchestration above can be
 * tested against a fake that returns exactly the rows a case needs — including
 * the ones a real server would be awkward to coax into producing, like a
 * retirement older than the local edit.
 */
export interface SyncTransport {
  pull(): Promise<RemoteSnapshot>;
  push(snapshot: SyncedSnapshot): Promise<void>;
}
