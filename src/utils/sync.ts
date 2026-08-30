import type { ExamResult } from './exam';
import type { ProductProgress } from './mastery';
import type { Note } from './notes';
import type { QuestionStat } from './quizSession';
import type { ReviewItem } from './review';
import type { StoredStreak } from './storage';

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
