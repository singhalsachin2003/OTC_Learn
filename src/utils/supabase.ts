import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url?: string;
  publishableKey?: string;
}

/**
 * The Supabase client, or `null` when the app is not configured for sync.
 *
 * Null is a first-class state, not a failure. OTC Learn shipped with no account
 * and no server, every screen reads Redux, and Redux is hydrated from
 * AsyncStorage — so a build with no credentials is a working app, not a broken
 * one. Every caller has to handle `null`, which is what stops sync from
 * becoming load-bearing.
 *
 * The defaults come from `EXPO_PUBLIC_*`, which Babel inlines at build time —
 * they are literals by the time this runs, not lookups. That is why the config
 * is injectable rather than read at the point of use, exactly as
 * `initErrorReporting` does: a test cannot exercise this by mutating
 * `process.env`.
 *
 * The publishable key is meant to ship inside the bundle. It grants only what
 * row level security allows, and every table in `supabase/schema.sql` restricts
 * every row to `auth.uid() = user_id` — which is verified, not assumed. The
 * `sb_secret_` key is a server credential and must never appear in a build.
 */
export function createSupabaseClient({
  url = process.env.EXPO_PUBLIC_SUPABASE_URL,
  publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
}: SupabaseConfig = {}): SupabaseClient | null {
  if (
    url === undefined ||
    url === '' ||
    publishableKey === undefined ||
    publishableKey === ''
  ) {
    return null;
  }

  return createClient(url, publishableKey, {
    auth: {
      // The session has to outlive the process or the user signs in on every
      // launch, which for a study app is worse than not syncing at all.
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // There is no browser and no redirect to parse a session out of.
      detectSessionInUrl: false,
    },
  });
}

/**
 * The process-wide client.
 *
 * Built once and cached, because `createClient` starts a token-refresh timer
 * and two clients would race each other refreshing the same session. `reset` is
 * for tests, which need a fresh one per case.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  if (cached === undefined) {
    cached = createSupabaseClient(config);
  }
  return cached;
}

export function resetSupabaseClient(): void {
  cached = undefined;
}

/** Whether this build can sync at all. Screens use it to hide the sign-in UI. */
export function isSyncConfigured(config?: SupabaseConfig): boolean {
  return getSupabaseClient(config) !== null;
}
