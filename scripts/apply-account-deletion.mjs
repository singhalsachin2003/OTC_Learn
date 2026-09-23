/**
 * Applies the `-- Account deletion` tail of `supabase/schema.sql` to the live
 * project, and proves it landed.
 *
 *   npm run apply:deletion              # says what it would do, sends nothing
 *   npm run apply:deletion -- --commit  # applies it
 *
 * Ported from Cornerstone, where it applied the same function on 2026-09-23.
 * JavaScript rather than TypeScript because this repo's scripts are, and it
 * needs no new dependency for it.
 *
 * **This project pauses.** It is on the free plan, which suspends a project
 * after a quiet week, and a paused project answers the management API but not
 * SQL. That is checked for by name below rather than left to a confusing error.
 *
 * **The function is the other half of a shipped button.** Profile → Account →
 * Delete account calls `rpc('delete_account')`, and until this runs that call
 * fails with a Postgres error for every user who taps it. Shipping the UI
 * without the function is worse than not shipping the UI.
 *
 * The block is idempotent — `create or replace` plus `revoke`/`grant` — so
 * running it twice is safe, and running it against a project that already has
 * it is a no-op rather than a mistake.
 *
 * Authentication is the same personal access token `setup:supabase` uses:
 * `SUPABASE_ACCESS_TOKEN`, or `~/.config/cornerstone/supabase-token`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.supabase.com';
const TOKEN_FILE = join(homedir(), '.config', 'cornerstone', 'supabase-token');
const HERE = dirname(fileURLToPath(import.meta.url));

/** Matched case-insensitively, as in Cornerstone's copy — the names differ in case there. */
const PROJECT_NAME = 'OTCLearn';

function token() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  if (existsSync(TOKEN_FILE)) {
    const fromFile = readFileSync(TOKEN_FILE, 'utf8').trim();
    if (fromFile) return fromFile;
  }
  throw new Error(
    'No Supabase access token.\n\n' +
      '  1. Create one at https://supabase.com/dashboard/account/tokens\n' +
      `  2. Put it in ${TOKEN_FILE}, or pass SUPABASE_ACCESS_TOKEN=sbp_…\n`,
  );
}

async function api(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `${init.method ?? 'GET'} ${path}\n${response.status}\n${text.slice(0, 500)}`,
    );
  }
  return text ? JSON.parse(text) : {};
}

async function main() {
  const commit = process.argv.includes('--commit');

  const projects = await api('/v1/projects');
  const project = projects.find(
    (p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase(),
  );
  if (!project) {
    throw new Error(
      `No project named "${PROJECT_NAME}" on this account. Found: ` +
        `${projects.map((p) => `"${p.name}"`).join(', ') || 'none'}.`,
    );
  }
  const ref = project.ref ?? project.id;

  /**
   * A paused free-tier project answers the API but not SQL, and the error for
   * that is not obvious. Say so here instead.
   */
  if (project.status !== 'ACTIVE_HEALTHY') {
    throw new Error(
      `Project "${project.name}" (${ref}) is ${project.status}, not ACTIVE_HEALTHY.\n` +
        'A paused project cannot run SQL. Restore it in the dashboard first.',
    );
  }

  const sql = (query) =>
    api(`/v1/projects/${ref}/database/query`, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

  const schema = readFileSync(join(HERE, '..', 'supabase', 'schema.sql'), 'utf8');
  const marker = schema.indexOf('-- Account deletion');
  if (marker === -1)
    throw new Error('supabase/schema.sql has no "-- Account deletion" section.');
  const block = schema.slice(marker);

  console.log(`Project "${project.name}" (${ref}), ${project.status}`);
  console.log(
    `  applying ${block.split('\n').length} lines from supabase/schema.sql\n`,
  );

  const before = await sql(
    "select proname, prosecdef from pg_proc where proname = 'delete_account';",
  );
  console.log(
    `  before   ${before.length ? JSON.stringify(before) : 'delete_account is not present'}`,
  );

  if (!commit) {
    console.log('\nDRY RUN — nothing was sent. Re-run with --commit to apply.');
    return;
  }

  await sql(block);

  /**
   * Read it back rather than trusting the write. `prosecdef` must be true — the
   * function edits `auth.users`, which the `authenticated` role cannot.
   *
   * **The grant check is about who is *absent*.** `revoke all … from public,
   * anon` does not touch `postgres` or `service_role`: those hold EXECUTE
   * through ownership and Supabase's own defaults, not through `public`, and
   * they are already trusted with the whole database. What must not appear is
   * `anon` — a signed-out caller able to invoke a `security definer` function
   * that deletes a user — or `public`, which would grant it to everyone.
   */
  const after = await sql(
    "select proname, prosecdef from pg_proc where proname = 'delete_account';",
  );
  const grants = await sql(
    `select grantee, privilege_type from information_schema.role_routine_grants
     where routine_name = 'delete_account' order by grantee;`,
  );

  console.log(`  after    ${JSON.stringify(after)}`);
  console.log(`  grants   ${JSON.stringify(grants)}`);

  const grantees = grants.map((g) => g.grantee);
  const ok =
    after.length === 1 &&
    after[0].prosecdef === true &&
    grantees.includes('authenticated') &&
    !grantees.includes('anon') &&
    !grantees.includes('public') &&
    !grantees.includes('PUBLIC');
  console.log(
    ok
      ? '\nApplied. security definer is on, `authenticated` may execute it, `anon` may not.'
      : '\nApplied, but the read-back is not what was expected — check the two lines above.',
  );
  if (!ok) process.exit(1);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
