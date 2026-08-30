# Progress sync

How OTC Learn's on-device state maps onto the Supabase schema in
`supabase/schema.sql`, and what happens when two devices disagree.

Nothing here changes the app's character. It stays offline-first: every screen
reads Redux, Redux is hydrated from AsyncStorage, and the server is a backup
that the app can lose contact with indefinitely without a user noticing. Sync
failures follow the same rule the rest of `utils/storage.ts` does — they resolve
to nothing rather than throwing, because a study session must never be blocked
by a network.

## Why not one JSON blob per user

It is the obvious first design and it is wrong the moment a second device
exists. A blob is last-write-wins across the whole account, so a phone that has
not synced since yesterday will, on its next write, erase a session done on a
tablet this morning. Per-row storage lets each kind of state merge on terms that
actually fit it.

That matters most for mastery. `utils/mastery.ts` moves a score *toward* each
session's result at a 0.35 learning rate precisely so that one bad sitting
cannot undo weeks — a merge that resolved the wrong way would do exactly the
damage the learning rate exists to prevent.

## Merge rules

| State | Table | Rule when two devices differ |
| --- | --- | --- |
| Display name | `profiles` | Later `updated_at` wins. |
| Settings | `settings` | Later `updated_at` wins, as a whole row. |
| Mastery, attempts | `product_progress` | Later `updated_at` wins for `mastery`; `attempts` takes the greater. |
| Best score | `product_progress` | Takes the greater — the app never revises it down, so a merge must not either. |
| Question history | `question_history` | Each counter takes the greater. Summing would double-count on any re-sync. |
| Review queue | `review_queue` | Later `updated_at` wins. A retirement sets `retired_at`; an absent row is not a deletion. |
| Study days | `study_days` | Union. A day studied on either device was studied. |
| Streak figures | `streaks` | `longest_streak` takes the greater; the rest follow the later `updated_at`. |
| Bookmarks | `bookmarks` | Later `updated_at` wins on the `bookmarked` flag. |
| Achievements | `achievements` | Union. They are only ever unlocked. |
| Notes | `notes` | Later `updated_at` wins. A cleared note is a null `body`, not a missing row. |
| Exam results | `exam_results` | Union on `client_id`. Append-only. |

Two rules carry the weight and are worth stating plainly:

- **Counters take the greater, never the sum.** Both devices count the same
  local history, so adding them together inflates every figure each time a
  device re-uploads. Taking the greater is stable under repeated sync, which is
  the property that matters — sync will be retried far more often than it
  succeeds cleanly.
- **Deletions need a tombstone.** Retiring a review item, un-bookmarking a
  product and clearing a note are all deletions, and none of them can be
  represented by an absent row. The device that still holds the row would
  otherwise treat its copy as newer and restore it. Each of those three has an
  explicit column instead.

## When sync runs

On launch after `hydrateApp` resolves, and on demand from the Account screen.
Not on every write: quiz answers land in bursts, and a request per answer would
be a great deal of traffic to protect a few bytes the next sync carries anyway.

The launch call is fired and not awaited, and nothing that renders waits on it.
A device with no signal, an expired token or a paused free-tier project has to
behave exactly like the app did before any of this existed.

Order within one sync is pull, merge, **save**, push. Saving before the upload
is deliberate: if the push fails the device still holds everything the server
had, where losing the pull because the push failed would make a flaky network
cost the user data. What gets pushed is the merged snapshot rather than what the
device started with, so a single round trip converges both sides.

## The project as it stands

Applied on 2026-08-30 and verified from outside the dashboard, because a schema
that is believed to be applied is not the same as one that is:

- All eleven tables answer on the Data API.
- Every one of them refuses an unauthenticated insert with `42501`, "new row
  violates row-level security policy". That is the check that matters — the
  publishable key ships inside the app bundle, so anyone who installs the app
  has it. A `select` returning `[]` proves nothing on an empty database; a
  refused write proves the policy is live.
- The Security Advisor reports no errors, so splinter found no public table
  without RLS.

## Auth

**Email and password only, to begin with.** Google sign-in on Android needs the
release keystore's SHA-1 fingerprint registered against an OAuth client, and EAS
owns the keystore rather than this repo — so it is extra setup that cannot be
done from here, for a convenience rather than a capability. It can be added
later without touching any of the above, because the schema keys off
`auth.users.id` regardless of how the user got there.

### Email delivery is the blocker, not the auth code

The project's current settings are the Supabase defaults, and two of them
combine badly:

- **Confirm email is on.** Nobody can sign in until they click a link.
- **`RATE_LIMIT_EMAIL_SENT` is 2.** Two emails per hour, for the whole project,
  from Supabase's built-in sender — which is documented as being for testing
  rather than production.

So the third person to sign up in any given hour never receives a confirmation
and cannot get in, with nothing on either side reporting why. This has to be
settled before accounts are offered to anyone:

- **Custom SMTP** — Resend, SES, Postmark or similar — is needed before launch
  in any case, because password reset is an email flow and hits the same limit
  whatever confirmation is set to.
- **Turning confirmation off** unblocks development and early users immediately,
  at the cost of accepting addresses nobody has proved they own. For an app with
  no social surface and nothing sensitive stored, that is a defensible trade —
  but it is the owner's to make, so nothing has been changed.

## Before any of this can be written

- ~~**`ExamResult` has no id.**~~ Done. `ExamResult.id` is minted by
  `examResultId` when a sitting is recorded, and schema v3 backfills every
  sitting stored before it. The write-back is the point: `parseExamResult` mints
  an id for a record that lacks one, so without persisting it every launch would
  invent a different one and an upload keyed by it would record the same sitting
  again each time.
- ~~**`updated_at` is not tracked locally.**~~ Done for the three record types
  that merge by it: `ProductProgress`, `ReviewItem` and `Note` each carry an
  `updatedAt` in epoch milliseconds, set by `applySession`, `scheduleLapse` /
  `schedulePromotion` and `editNote` — all of which already took a clock, so
  none of them needed a new one invented.

  What a record written before v3 gets matters, because it decides which device
  wins the first disagreement. Rather than stamping every legacy record with the
  migration's own clock — which would make them all look equally recent, and
  would order two devices by which happened to open the app first — the stamp
  falls back to the record's own date key: `lastStudiedOn` for progress,
  `updatedOn` for a note. A queue item has no such date (`dueOn` is in the
  future by construction), so it starts at zero and loses any merge against a
  stamped item.

  Still to do: settings, the profile name, the streak and bookmarks merge as
  whole rows rather than per-field, so they need one timestamp each rather than
  one per record. Bookmarks additionally need a tombstone locally — the slice
  holds a plain `string[]`, which cannot express "removed at". Neither is
  needed until the client pushes those tables.
- ~~**The project itself.**~~ Created on 2026-08-30: `OTCLearn`, free tier,
  `ap-northeast-1` (Tokyo), project ref `sdomtcctsxtynglmxriu`. The URL and
  **publishable** key go in `EXPO_PUBLIC_SUPABASE_URL` and
  `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — see `.env.example`. Supabase has
  moved on from the `anon` key; the publishable key is its replacement and is
  equally safe to ship, because it grants only what row level security allows.
  The `sb_secret_` key is a server credential and must never reach a build.

  Both are inlined by Babel at build time rather than read at runtime, so —
  exactly as `initErrorReporting` already does — the client must take its
  configuration as an argument with the env values only as defaults, or it
  cannot be tested.

  Region is Tokyo, which is further from a UK or Indian user than it needs to
  be. It is not worth recreating the project over: sync is a background backup,
  not something a screen waits on, so a hundred milliseconds either way is
  invisible.
