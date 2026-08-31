import type { SupabaseClient } from '@supabase/supabase-js';

import {
  bookmarksToRows,
  emptyRemoteSnapshot,
  examResultToRow,
  isoFrom,
  noteToRow,
  profileToRow,
  progressToRow,
  questionHistoryToRows,
  reviewToRow,
  settingsToRow,
  type SyncedSnapshot,
  type RemoteSnapshot,
  type SyncTransport,
} from './sync';

/**
 * The Supabase implementation of `SyncTransport`.
 *
 * Every row carries `user_id` explicitly even though row level security would
 * reject anything else. Belt and braces is the wrong reason; the real one is
 * that `upsert` needs the full primary key, and `user_id` is half of every
 * composite key in `supabase/schema.sql`.
 */
export function supabaseTransport(
  client: SupabaseClient,
  userId: string,
): SyncTransport {
  const owned = <T extends object>(rows: T[]) =>
    rows.map((row) => ({ ...row, user_id: userId }));

  return {
    async pull(): Promise<RemoteSnapshot> {
      const [
        progress,
        questionHistory,
        reviewQueue,
        notes,
        studyDays,
        achievements,
        examResults,
        streak,
        settings,
        profile,
        bookmarks,
      ] = await Promise.all([
        client.from('product_progress').select('*'),
        client.from('question_history').select('*'),
        client.from('review_queue').select('*'),
        client.from('notes').select('*'),
        client.from('study_days').select('day'),
        client.from('achievements').select('achievement_id'),
        client.from('exam_results').select('*'),
        client.from('streaks').select('*').maybeSingle(),
        client.from('settings').select('*').maybeSingle(),
        client.from('profiles').select('*').maybeSingle(),
        client.from('bookmarks').select('*'),
      ]);

      // One failed table is a failed pull. Merging a partial picture would look
      // to every rule here like the missing rows had been deleted, and the push
      // that follows would then delete them for real.
      for (const result of [
        progress,
        questionHistory,
        reviewQueue,
        notes,
        studyDays,
        achievements,
        examResults,
        streak,
        settings,
        profile,
        bookmarks,
      ]) {
        if (result.error !== null) {
          throw new Error(result.error.message);
        }
      }

      return {
        ...emptyRemoteSnapshot,
        progress: progress.data ?? [],
        questionHistory: questionHistory.data ?? [],
        reviewQueue: reviewQueue.data ?? [],
        notes: notes.data ?? [],
        studyDays: (studyDays.data ?? []).map((row) => row.day as string),
        achievements: (achievements.data ?? []).map(
          (row) => row.achievement_id as string,
        ),
        examResults: examResults.data ?? [],
        streak: streak.data ?? null,
        settings: settings.data ?? null,
        profile: profile.data ?? null,
        bookmarks: bookmarks.data ?? [],
      };
    },

    async push(snapshot: SyncedSnapshot): Promise<void> {
      const now = isoFrom(snapshot.streakUpdatedAt);

      const writes = [
        client
          .from('product_progress')
          .upsert(
            owned(
              Object.entries(snapshot.progress).map(([id, record]) =>
                progressToRow(id, record),
              ),
            ),
          ),
        client
          .from('question_history')
          .upsert(owned(questionHistoryToRows(snapshot.questionHistory))),
        client
          .from('review_queue')
          .upsert(owned(snapshot.reviewQueue.map(reviewToRow))),
        client
          .from('notes')
          .upsert(
            owned(
              Object.entries(snapshot.notes).flatMap(([id, note]) =>
                note === undefined ? [] : [noteToRow(id, note)],
              ),
            ),
          ),
        client
          .from('study_days')
          .upsert(owned(snapshot.studyDays.map((day) => ({ day })))),
        client.from('achievements').upsert(
          owned(snapshot.achievements.map((id) => ({ achievement_id: id }))),
          // Achievements record when something was earned. Re-uploading must
          // not restamp that to now, so an existing row is left alone.
          { ignoreDuplicates: true },
        ),
        client
          .from('exam_results')
          .upsert(owned(snapshot.examResults.map(examResultToRow)), {
            ignoreDuplicates: true,
          }),
        client.from('streaks').upsert(
          owned([
            {
              current_streak: snapshot.streak.currentStreak,
              longest_streak: snapshot.streak.longestStreak,
              last_activity_date: snapshot.streak.lastActivityDate,
              updated_at: now,
            },
          ]),
        ),
        client
          .from('settings')
          .upsert(
            owned([settingsToRow(snapshot.settings, snapshot.settingsUpdatedAt)]),
          ),
        client
          .from('profiles')
          .upsert(
            owned([profileToRow(snapshot.profileName, snapshot.profileUpdatedAt)]),
          ),
        client.from('bookmarks').upsert(owned(bookmarksToRows(snapshot.bookmarks))),
      ];

      const results = await Promise.all(writes);
      const failed = results.find((result) => result.error !== null);
      if (failed?.error != null) {
        throw new Error(failed.error.message);
      }
    },
  };
}
