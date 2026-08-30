-- OTC Learn — Supabase schema.
--
-- Paste this into the SQL editor of a new project. It is written to be run
-- whole and to be safe to run twice, so a half-applied attempt can simply be
-- re-run rather than unpicked.
--
-- Two decisions shape everything below.
--
-- First, the app stays offline-first. Nothing here is a source of truth for a
-- running app: the device already has every answer in AsyncStorage, and these
-- tables exist so that progress survives an uninstall or a new phone. A failed
-- sync must therefore never block anything, which is why no table is required
-- for the app to function and why none of them carry defaults the client
-- depends on.
--
-- Second, one row per thing rather than one JSON blob per user. A blob is
-- last-write-wins across the entire account: study on a tablet, then open a
-- phone that has not synced since yesterday, and the phone's stale blob erases
-- the tablet's session. Per-row lets each kind of state merge on the terms that
-- suit it — counters take the larger value, notes take the later edit, study
-- days union. Those rules live in `supabase/sync.md`; this file only has to make
-- them expressible.
--
-- Every table is keyed by `auth.users.id` and locked to its owner by RLS. There
-- is no shared or public data in this app, so every policy is the same shape.

-- ---------------------------------------------------------------------------
-- Identity

create table if not exists public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- The app's optional display name. Null is the unnamed state, which is
  -- distinct from an empty string — `setName` treats blank input as unnamed.
  display_name text check (display_name is null or length(display_name) <= 40),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Preferences

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  spaced_repetition boolean not null default true,
  timed_quizzes boolean not null default false,
  haptics boolean not null default true,
  daily_reminder boolean not null default false,
  -- Mirrors SESSION_SIZE_MIN/MAX in `utils/storage.ts`. Kept as a constraint
  -- rather than a comment because a value outside this range is one the user
  -- could neither have chosen nor undo through the UI.
  session_size smallint not null default 6 check (session_size between 3 and 12),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Progress
--
-- Mastery is the app's whole model of "how well do you know this" — see
-- `utils/mastery.ts`. It moves toward each session's score rather than being
-- replaced by it, so a merge that picked the wrong side would undo weeks of
-- study rather than a single sitting.

create table if not exists public.product_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- A catalogue id such as 'irs' or 'xccy'. Deliberately not a foreign key:
  -- the catalogue ships inside the app, and a server that rejected an id from
  -- a newer release would break sync for anyone who updated early.
  product_id text not null,
  mastery smallint not null check (mastery between 0 and 100),
  attempts integer not null default 0 check (attempts >= 0),
  -- Never revised down by the app, so the merge takes the greater of the two.
  best_score_pct smallint not null default 0 check (best_score_pct between 0 and 100),
  last_studied_on date,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.question_history (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- A question id such as 'irs-q7'.
  question_id text not null,
  right_count integer not null default 0 check (right_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- ---------------------------------------------------------------------------
-- Review queue
--
-- Retirement is a deletion in the app, and a deletion cannot be represented by
-- an absent row: a device that has not synced since before the retirement would
-- see its own copy as new and put the question back. `retired_at` is the
-- tombstone that stops that.

create table if not exists public.review_queue (
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id text not null,
  product_id text not null,
  -- Position on the interval ladder; 0 means due tomorrow. See `utils/review.ts`.
  step smallint not null default 0 check (step >= 0),
  due_on date not null,
  lapses integer not null default 0 check (lapses >= 0),
  retired_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists review_queue_due_idx
  on public.review_queue (user_id, due_on)
  where retired_at is null;

-- ---------------------------------------------------------------------------
-- Streak
--
-- `study_days` is the record; the streak figures are derived from it. Both are
-- stored anyway, because an install that predates sync has a longest streak it
-- can no longer prove from its own study days, and recomputing would silently
-- shorten it.

create table if not exists public.study_days (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

create table if not exists public.streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Library
--
-- A bookmark carries a boolean rather than existing or not, for the same reason
-- the review queue carries a tombstone: un-bookmarking has to survive a merge
-- with a device that still thinks the product is saved.

create table if not exists public.bookmarks (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  bookmarked boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- Achievements are only ever unlocked, never revoked, so this one is genuinely
-- insert-only and needs no tombstone.
create table if not exists public.achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- Notes
--
-- The one thing in the app the user authors rather than earns, which is why a
-- cleared note is stored as a null body rather than a deleted row: losing
-- someone's own writing to a stale device is the worst outcome here, and a
-- tombstone makes the deletion explicit and orderable.

create table if not exists public.notes (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null,
  -- Null means the note was cleared. The length cap mirrors NOTE_MAX_LENGTH.
  body text check (body is null or length(body) <= 2000),
  updated_on date not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ---------------------------------------------------------------------------
-- Practice exams
--
-- Append-only: a sitting that happened cannot un-happen. `client_id` is what
-- makes the append idempotent — without a stable id, a retry after a failed
-- request would record the same sitting twice, and two identical sittings on
-- the same day are not distinguishable by their contents alone.
--
-- The local `ExamResult` in `utils/exam.ts` has no id today, so adding one is a
-- storage migration (v2 -> v3) that has to land before this table can be
-- written to. See `supabase/sync.md`.

create table if not exists public.exam_results (
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id text not null,
  taken_on date not null,
  -- A category id, or the 'all' sentinel — see EXAM_SCOPE_ALL.
  scope_id text not null,
  correct integer not null check (correct >= 0),
  total integer not null check (total > 0),
  score_pct smallint not null check (score_pct between 0 and 100),
  passed boolean not null,
  -- Null when the sitting ran out of time rather than being submitted.
  duration_ms integer check (duration_ms is null or duration_ms >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, client_id)
);

create index if not exists exam_results_taken_idx
  on public.exam_results (user_id, taken_on desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Nothing in this app is shared between users, so every table gets the same
-- policy: you may do anything to your own rows and nothing to anyone else's.
-- `with check` as well as `using` on the write policies, or a client could
-- update a row of its own into someone else's user_id.

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'settings', 'product_progress', 'question_history',
    'review_queue', 'study_days', 'streaks', 'bookmarks', 'achievements',
    'notes', 'exam_results'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);

    execute format('drop policy if exists own_rows_select on public.%I', t);
    execute format(
      'create policy own_rows_select on public.%I for select using (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_insert on public.%I', t);
    execute format(
      'create policy own_rows_insert on public.%I for insert with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_update on public.%I', t);
    execute format(
      'create policy own_rows_update on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists own_rows_delete on public.%I', t);
    execute format(
      'create policy own_rows_delete on public.%I for delete using (auth.uid() = user_id)', t);
  end loop;
end
$$;
