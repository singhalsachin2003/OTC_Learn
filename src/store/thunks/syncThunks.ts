import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  saveAchievements,
  saveExamResults,
  saveNotes,
  saveProgressMap,
  saveQuestionHistory,
  saveReviewQueue,
  saveStreak,
  saveStudyDays,
} from '../../utils/storage';
import { getSupabaseClient } from '../../utils/supabase';
import {
  mergeSnapshot,
  type LocalSnapshot,
  type SyncTransport,
} from '../../utils/sync';
import { supabaseTransport } from '../../utils/syncTransport';
import { track } from '../../utils/analytics';
import type { RootState } from '../index';
import { setNotes } from '../slices/notesSlice';
import {
  setAchievements,
  setExamResults,
  setProgress,
  setQuestionHistory,
} from '../slices/progressSlice';
import { setReviewQueue } from '../slices/reviewSlice';
import { setStreak, setStudyDays } from '../slices/streakSlice';
import {
  clearSession,
  setSession,
  setSyncStatus,
  syncFailed,
  syncSucceeded,
} from '../slices/syncSlice';

/**
 * Progress sync.
 *
 * Every thunk here resolves rather than rejects, and none of them is awaited by
 * anything a screen renders. That is the offline-first contract kept honestly:
 * the app worked with no server before any of this existed, and a device with
 * no signal, an expired token or a paused free-tier project has to behave
 * exactly like that app rather than like a broken one.
 */

/** When the streak figures last changed. See `mergeStreak`. */
function streakUpdatedAt(lastActivityDate: string | null): number {
  if (lastActivityDate === null) {
    return 0;
  }
  const parsed = Date.parse(`${lastActivityDate}T00:00:00`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function snapshotOf(state: RootState): LocalSnapshot {
  return {
    progress: state.progress.byProduct,
    questionHistory: state.progress.questionHistory,
    reviewQueue: state.review.queue,
    notes: state.notes.byProduct,
    studyDays: state.streak.studyDays,
    achievements: state.progress.unlockedAchievementIds,
    examResults: state.progress.examResults,
    streak: {
      currentStreak: state.streak.currentStreak,
      longestStreak: state.streak.longestStreak,
      lastActivityDate: state.streak.lastActivityDate,
    },
    streakUpdatedAt: streakUpdatedAt(state.streak.lastActivityDate),
  };
}

/** A message worth showing a user, from whatever the failure turned out to be. */
function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : 'Sync failed';
}

/**
 * Picks up a session left by a previous launch.
 *
 * Runs on launch and is allowed to find nothing, which is the common case: most
 * installs have never signed in, and that is not a failure worth reporting.
 */
export const restoreSession = createAsyncThunk<void, void, { state: RootState }>(
  'sync/restore',
  async (_arg, { dispatch }) => {
    const client = getSupabaseClient();
    if (client === null) {
      return;
    }

    try {
      const { data } = await client.auth.getSession();
      const user = data.session?.user;
      if (user !== undefined) {
        dispatch(setSession({ userId: user.id, email: user.email ?? null }));
      }
    } catch {
      // A session that cannot be read is a session the user does not have.
    }
  },
);

export const signIn = createAsyncThunk<
  boolean,
  { email: string; password: string; signingUp?: boolean },
  { state: RootState }
>('sync/signIn', async ({ email, password, signingUp = false }, { dispatch }) => {
  const client = getSupabaseClient();
  if (client === null) {
    dispatch(syncFailed('This build has no sync configured.'));
    return false;
  }

  dispatch(setSyncStatus('busy'));

  const credentials = { email: email.trim(), password };
  const { data, error } = signingUp
    ? await client.auth.signUp(credentials)
    : await client.auth.signInWithPassword(credentials);

  if (error !== null || data.user === null) {
    dispatch(syncFailed(error?.message ?? 'Could not sign in.'));
    return false;
  }

  dispatch(setSession({ userId: data.user.id, email: data.user.email ?? null }));
  dispatch(setSyncStatus('idle'));
  track({ name: signingUp ? 'account_created' : 'signed_in' });

  // A first sync straight after signing in is the whole point of signing in.
  await dispatch(syncNow());
  return true;
});

/**
 * Signs out without touching a single study record.
 *
 * Deliberately not a reset: the device's own copy is the one the app has always
 * run on, and wiping it on sign-out would make signing in a risk rather than a
 * safety net. Clearing progress remains its own explicit, confirmed action in
 * Profile.
 */
export const signOutAccount = createAsyncThunk<void, void, { state: RootState }>(
  'sync/signOut',
  async (_arg, { dispatch }) => {
    const client = getSupabaseClient();
    if (client !== null) {
      try {
        await client.auth.signOut();
      } catch {
        // The local session is gone either way; a failed revoke is the
        // server's problem, not something to trap the user in.
      }
    }
    dispatch(clearSession());
    track({ name: 'signed_out' });
  },
);

/**
 * Pulls, merges, saves, pushes.
 *
 * The merged snapshot is what gets pushed rather than what the device started
 * with, so one round trip converges both sides. Local state and AsyncStorage
 * are written *before* the push: if the upload fails, the device still keeps
 * everything the server had, and the next sync retries the push alone.
 */
export const syncNow = createAsyncThunk<
  boolean,
  { transport?: SyncTransport } | undefined,
  { state: RootState }
>('sync/now', async (arg, { dispatch, getState }) => {
  const state = getState();
  const userId = state.sync.userId;
  if (userId === null) {
    return false;
  }

  const client = getSupabaseClient();
  const transport =
    arg?.transport ?? (client === null ? null : supabaseTransport(client, userId));
  if (transport === null) {
    return false;
  }

  dispatch(setSyncStatus('busy'));

  try {
    const merged = mergeSnapshot(snapshotOf(state), await transport.pull());

    dispatch(setProgress(merged.progress));
    dispatch(setQuestionHistory(merged.questionHistory));
    dispatch(setReviewQueue(merged.reviewQueue));
    dispatch(setNotes(merged.notes));
    dispatch(setAchievements(merged.achievements));
    dispatch(setExamResults(merged.examResults));
    dispatch(setStudyDays(merged.studyDays));
    dispatch(setStreak(merged.streak));

    await Promise.all([
      saveProgressMap(merged.progress),
      saveQuestionHistory(merged.questionHistory),
      saveReviewQueue(merged.reviewQueue),
      saveNotes(merged.notes),
      saveAchievements(merged.achievements),
      saveExamResults(merged.examResults),
      saveStudyDays(merged.studyDays),
      saveStreak(merged.streak),
    ]);

    await transport.push(merged);

    dispatch(syncSucceeded(Date.now()));
    track({ name: 'sync_completed' });
    return true;
  } catch (error) {
    dispatch(syncFailed(messageFrom(error)));
    return false;
  }
});
