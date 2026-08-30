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

On launch after `hydrateApp` resolves, and after a session completes — the two
moments where the local state has just changed meaningfully and the user is not
mid-task. Not on every write: quiz answers land in bursts, and a request per
answer would be a great deal of traffic to protect a few bytes that the next
session's sync would carry anyway.

## Auth

**Email and password only, to begin with.** Google sign-in on Android needs the
release keystore's SHA-1 fingerprint registered against an OAuth client, and EAS
owns the keystore rather than this repo — so it is extra setup that cannot be
done from here, for a convenience rather than a capability. It can be added
later without touching any of the above, because the schema keys off
`auth.users.id` regardless of how the user got there.

## Before any of this can be written

- ~~**`ExamResult` has no id.**~~ Done. `ExamResult.id` is minted by
  `examResultId` when a sitting is recorded, and schema v3 backfills every
  sitting stored before it. The write-back is the point: `parseExamResult` mints
  an id for a record that lacks one, so without persisting it every launch would
  invent a different one and an upload keyed by it would record the same sitting
  again each time.
- **`updated_at` is not tracked locally.** The tables above resolve conflicts by
  it, but the device records only date keys such as `lastStudiedOn`, which are a
  day's resolution and cannot order two sessions on the same day. This is
  deliberately **not** done yet: it touches mastery, the review queue, notes,
  bookmarks, settings and the profile, and exactly which records need a
  timestamp is decided by the sync client that reads them. A wide change to the
  persistence layer of an app with live installs should land next to the code
  that proves it, not months ahead of it.
- **The project itself.** The URL and anon key go in `EXPO_PUBLIC_SUPABASE_URL`
  and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Both are inlined by Babel at build time
  rather than read at runtime, so — exactly as `initErrorReporting` already does
  — the client must take its configuration as an argument with the env values
  only as defaults, or it cannot be tested.
