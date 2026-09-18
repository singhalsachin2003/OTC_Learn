import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  loadBookmarkRecords,
  loadSyncMeta,
  saveAchievements,
  saveBookmarkRecords,
  saveExamResults,
  saveNotes,
  saveProfile,
  saveProgressMap,
  saveQuestionHistory,
  saveReviewQueue,
  saveSettings,
  saveStreak,
  saveStudyDays,
  saveSyncMeta,
  type BookmarkMap,
  type SyncMeta,
} from '../../utils/storage';
import { getSupabaseClient } from '../../utils/supabase';
import {
  bookmarkedIds,
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
import { setBookmarks } from '../slices/progressSlice';
import { setName, setSettings } from '../slices/settingsSlice';
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

/**
 * Bookmarks and the two whole-row timestamps live in storage rather than in
 * Redux — the store holds only the saved ids, which cannot express "removed
 * at" — so a snapshot needs a read before it can be built.
 */
function snapshotOf(
  state: RootState,
  bookmarks: BookmarkMap,
  meta: SyncMeta,
): LocalSnapshot {
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
    settings: state.settings.settings,
    settingsUpdatedAt: meta.settingsUpdatedAt,
    profileName: state.settings.name,
    profileUpdatedAt: meta.profileUpdatedAt,
    bookmarks,
    lastSyncedAt: state.sync.lastSyncedAt,
  };
}

/**
 * A message worth showing a user, from whatever the failure turned out to be.
 *
 * The raw text is never shown. Supabase and the fetch layer below it speak in
 * strings written for whoever is reading a stack trace — "Network request
 * failed", "Invalid login credentials", "AuthApiError" — and putting those in
 * front of somebody on a train tells them nothing they can act on. Each branch
 * below names a thing the user can actually do next.
 *
 * The fall-through is deliberately vague rather than inventive: an unfamiliar
 * failure is one this function does not understand, and guessing at a cause
 * would be worse than admitting there isn't one to give.
 */
export function messageFrom(error: unknown): string {
  // Supabase hands back plain objects carrying `message`, not Error instances,
  // so reading only `instanceof Error` silently drops the one useful field and
  // sends every auth failure down the fall-through. Found by a test that
  // expected "Invalid login credentials" and got the generic line.
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message ?? '')
        : String(error ?? '');
  const text = raw.toLowerCase();

  // Offline is by far the most common, and the only one whose fix is obvious.
  if (
    text.includes('network request failed') ||
    text.includes('failed to fetch') ||
    text.includes('networkerror') ||
    text.includes('timeout') ||
    text.includes('unable to resolve host')
  ) {
    return 'No connection. Your progress is safe on this device and will sync when you are back online.';
  }

  if (text.includes('invalid login credentials')) {
    return 'That email and password do not match an account.';
  }

  if (
    text.includes('user already registered') ||
    text.includes('already been registered')
  ) {
    return 'There is already an account with that email. Sign in instead.';
  }

  if (text.includes('email not confirmed')) {
    return 'Check your inbox and confirm your email address, then sign in.';
  }

  if (
    text.includes('password should be') ||
    text.includes('password is too short')
  ) {
    return 'Passwords need at least six characters.';
  }

  if (text.includes('invalid email') || text.includes('unable to validate email')) {
    return 'That does not look like a valid email address.';
  }

  if (
    text.includes('jwt expired') ||
    text.includes('token is expired') ||
    text.includes('refresh_token')
  ) {
    return 'Your session expired. Sign in again to keep syncing.';
  }

  if (text.includes('rate limit') || text.includes('too many requests')) {
    return 'Too many attempts. Wait a minute and try again.';
  }

  return 'Sync could not finish. Your progress is safe on this device.';
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

/**
 * How long to wait before retrying the sync that follows a sign-in.
 *
 * A token is rejected with "JWT issued at future" when its `iat` is ahead of
 * the validating server's clock, and the sync immediately after sign-in is the
 * one moment that is genuinely exposed to it: the token is milliseconds old, so
 * even sub-second skew between the auth server and Postgres is enough. Seconds
 * later the same token is accepted — which is why a manual "Sync now" always
 * appeared to work and made this look like a bug in the sync path.
 */
export const SIGN_IN_SYNC_RETRY_MS = 2500;

export const signIn = createAsyncThunk<
  boolean,
  {
    email: string;
    password: string;
    signingUp?: boolean;
    /** Injectable so a test does not sit through the delay. */
    retryDelayMs?: number;
  },
  { state: RootState }
>(
  'sync/signIn',
  async (
    { email, password, signingUp = false, retryDelayMs = SIGN_IN_SYNC_RETRY_MS },
    { dispatch },
  ) => {
    const client = getSupabaseClient();
    if (client === null) {
      dispatch(syncFailed('This build has no sync configured.'));
      return false;
    }

    dispatch(setSyncStatus('busy'));

    const credentials = { email: email.trim(), password };

    // `signInWithPassword` returns its errors, but it can also throw — a dropped
    // connection does. Without this the thunk rejects, the slice never hears
    // about it, and the button sits on "Working…" for the rest of the session.
    let userId: string;
    let userEmail: string | null;
    try {
      const { data, error } = signingUp
        ? await client.auth.signUp(credentials)
        : await client.auth.signInWithPassword(credentials);

      if (error !== null || data.user === null) {
        dispatch(syncFailed(messageFrom(error)));
        return false;
      }
      userId = data.user.id;
      userEmail = data.user.email ?? null;
    } catch (error) {
      dispatch(syncFailed(messageFrom(error)));
      return false;
    }

    dispatch(setSession({ userId, email: userEmail }));
    dispatch(setSyncStatus('idle'));
    track({ name: signingUp ? 'account_created' : 'signed_in' });

    // A first sync straight after signing in is the whole point of signing in.
    // The id is passed rather than left to be read back out of the store.
    const synced = await dispatch(syncNow({ userId }));

    // Retried once, and only here — see SIGN_IN_SYNC_RETRY_MS. Everywhere else a
    // failed sync is left failed, because the user can see it and ask again.
    if (synced.payload === false) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      await dispatch(syncNow({ userId }));
    }

    return true;
  },
);

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
    // Cleared first, and the revoke is deliberately not awaited before it.
    //
    // Awaiting the network call and clearing afterwards opened a race: sign out,
    // sign straight back in while the revoke is still in flight, and the late
    // `clearSession` lands on top of the session the new sign-in had already
    // established — leaving the app signed in with no user id, so the sync that
    // follows returns early and silently does nothing. Locally the session is
    // gone the moment the user asks; the revoke is the server's business.
    dispatch(clearSession());
    track({ name: 'signed_out' });

    const client = getSupabaseClient();
    if (client !== null) {
      try {
        await client.auth.signOut();
      } catch {
        // A failed revoke is not something to trap the user in.
      }
    }
  },
);

/**
 * Deletes the account and everything synced to it.
 *
 * Google Play requires an in-app deletion path for any app that lets people
 * create an account; the published web page satisfies the second half of that
 * rule and not the first. So this exists, and it is deliberately the bluntest
 * thing in the file.
 *
 * What it deletes is the *server's* copy. Every table cascades from the auth
 * row, so one `delete_account()` removes progress, review queue, notes,
 * bookmarks, achievements, exam results and the profile together — see
 * `supabase/schema.sql`. What it does not touch is this device: the app has
 * always worked without an account, deleting one should return the reader to
 * that state rather than punish them for having tried it, and Profile already
 * has an explicit "Reset all progress" for anyone who wants the rest gone. The
 * screen says so before asking for confirmation.
 *
 * Unlike every other thunk here it reports failure rather than swallowing it.
 * A deletion that quietly did not happen is the one failure in this file a user
 * must not be left believing succeeded.
 */
export const deleteAccount = createAsyncThunk<boolean, void, { state: RootState }>(
  'sync/deleteAccount',
  async (_arg, { dispatch }) => {
    const client = getSupabaseClient();
    if (client === null) {
      dispatch(syncFailed('This build has no sync configured.'));
      return false;
    }

    dispatch(setSyncStatus('busy'));

    try {
      const { error } = await client.rpc('delete_account');
      if (error !== null) {
        dispatch(syncFailed(messageFrom(error)));
        return false;
      }
    } catch (error) {
      dispatch(syncFailed(messageFrom(error)));
      return false;
    }

    // The rows are gone, so the session is meaningless whatever the revoke
    // does. Clearing locally first keeps the same ordering as `signOutAccount`
    // and for the same reason.
    dispatch(clearSession());
    track({ name: 'account_deleted' });

    try {
      await client.auth.signOut();
    } catch {
      // The account no longer exists; a failed revoke cannot matter.
    }

    return true;
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
  { transport?: SyncTransport; userId?: string } | undefined,
  { state: RootState }
>('sync/now', async (arg, { dispatch, getState }) => {
  const state = getState();
  // The caller may already hold the id — `signIn` does, having just been handed
  // it by Supabase. Taking it directly removes any dependence on the session
  // having propagated through the store first, which is one fewer ordering
  // assumption in a path that has already proved it can get them wrong.
  const userId = arg?.userId ?? state.sync.userId;
  if (userId === null || userId === undefined) {
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
    const [bookmarks, meta] = await Promise.all([
      loadBookmarkRecords(),
      loadSyncMeta(),
    ]);
    const merged = mergeSnapshot(
      snapshotOf(state, bookmarks, meta),
      await transport.pull(),
    );

    dispatch(setProgress(merged.progress));
    dispatch(setQuestionHistory(merged.questionHistory));
    dispatch(setReviewQueue(merged.reviewQueue));
    dispatch(setNotes(merged.notes));
    dispatch(setAchievements(merged.achievements));
    dispatch(setExamResults(merged.examResults));
    dispatch(setStudyDays(merged.studyDays));
    dispatch(setStreak(merged.streak));
    dispatch(setSettings(merged.settings));
    dispatch(setName(merged.profileName));
    dispatch(setBookmarks(bookmarkedIds(merged.bookmarks)));

    await Promise.all([
      saveProgressMap(merged.progress),
      saveQuestionHistory(merged.questionHistory),
      saveReviewQueue(merged.reviewQueue),
      saveNotes(merged.notes),
      saveAchievements(merged.achievements),
      saveExamResults(merged.examResults),
      saveStudyDays(merged.studyDays),
      saveStreak(merged.streak),
      saveSettings(merged.settings),
      saveProfile({ name: merged.profileName }),
      saveBookmarkRecords(merged.bookmarks),
      saveSyncMeta({
        settingsUpdatedAt: merged.settingsUpdatedAt,
        profileUpdatedAt: merged.profileUpdatedAt,
      }),
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
