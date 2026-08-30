---
name: run-otc-learn
description: Build, launch, screenshot and drive the OTC Learn app on an Android emulator. Use when asked to run, start, build, install, screenshot, or manually test the app, verify a screen renders, or check sync against the live Supabase project.
---

# Running OTC Learn

React Native 0.86 / Expo SDK 57, Android only. **Expo Go cannot run this app** —
`expo-updates`, `react-native-svg`, `react-native-reanimated`, `expo-haptics`
and `expo-notifications` are native modules it does not bundle, so this is a
real `expo run:android` build.

The app has no programmatic surface of its own: navigation is Redux state
(`app.currentScreen`), not a navigator, and every screen is a React Native view.
The only handle on a running build is `adb`, wrapped by
`.claude/skills/run-otc-learn/driver.sh`.

All paths are relative to the repo root.

## Prerequisites

Already present on this machine; `doctor` tells you if not.

```bash
.claude/skills/run-otc-learn/driver.sh doctor
```

```
✓ adb            /Users/sachin/Library/Android/sdk/platform-tools/adb
✓ emulator       Pixel_7_API_33 Pixel_7_API_35
✓ device         emulator-5554
✓ metro          pid 27196, up 07:52
✓ .env           Supabase configured — sync will be live
```

**Run `doctor` first, every time.** It is the only thing that catches a stale
Metro, which is the single most expensive failure here — see Gotchas.

## Build and launch

```bash
.claude/skills/run-otc-learn/driver.sh boot          # skips if already booted
.claude/skills/run-otc-learn/driver.sh install
```

`install` kills any Metro on 8081, runs `adb reverse tcp:8081 tcp:8081`, then
`npx expo run:android`. A warm Gradle daemon builds in about 30 seconds; the
first build of a session is several minutes.

Installing **over** an existing build rather than uninstalling is deliberate: it
keeps the previous install's AsyncStorage, which is the only way to exercise a
storage migration against real data.

## Drive it (agent path)

```bash
D=.claude/skills/run-otc-learn/driver.sh

$D link account            # deep link — the fast way to any screen
$D screen                  # current screen as plain text
$D shot after-signin       # screenshot -> /tmp/otc-learn-shots/after-signin.png
$D tap "Sync now"          # tap the node whose text or content-desc matches
$D type "someone@example.com"
$D errors                  # E/F-level logcat for this app only
$D restart                 # cold restart, waits out the splash hold
```

**Prefer `screen` over `shot` for assertions.** It returns every text node, so
you can grep for what you expect without reading an image:

```bash
$ .claude/skills/run-otc-learn/driver.sh link account
opened otclearn://account
$ .claude/skills/run-otc-learn/driver.sh screen | head -4
Profile
Account
Signed in as otc-sync-test@example.com. Your progress is backed up, and will come back if you reinstall or change phone.
Last synced 8/30/2026, 8:53:33 PM
```

Take a screenshot when layout or styling is the point, and **look at it**.

`tap` finds the node by text and taps the centre of its bounds, which is far
more reliable than reading coordinates off a screenshot. It matches
`content-desc` too, so an icon with an `accessibilityLabel` is reachable even
though lucide icons render to SVG primitives with no text. It refuses to tap
anything scrolled out of view rather than guessing — see Gotchas.

`link`, `tap` and `restart` all wait for the app to be drawing something before
returning, so you can chain them without inserting sleeps.

### Deep links

`linking.ts` is the fastest way in — every one of these is verified:

```
otclearn://              home            otclearn://review
otclearn://account       glossary        otclearn://profile
otclearn://notes         insights        otclearn://exam
otclearn://category/<id>                 otclearn://product/<id>
otclearn://lesson/<id>
```

There is **no** deep link for achievements or the products tab. Reach those with
`tap` from Profile or the tab bar.

Ids are in `src/data/catalogue/` — e.g. `irs`, `fxfwd`, `cds`, `collateral`.

## A full sync round trip

The flow worth re-running after touching `utils/sync*` or `syncThunks`, because
it is the one thing the test suite cannot cover — it needs a real server.

```bash
D=.claude/skills/run-otc-learn/driver.sh
$D link account
$D tap "Email";    $D type "otc-sync-test@example.com"
$D tap "Password"; $D type "<password>"
$D tap "Sign in"
sleep 8
$D screen | head -4      # expect "Signed in as …" and a "Last synced" time
```

Then check the other half actually moved, with the values from `.env`:

```bash
set -a; source .env; set +a
curl -s "$EXPO_PUBLIC_SUPABASE_URL/rest/v1/review_queue?select=question_id,due_on" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer <access-token>"
```

Get an access token without the app:

```bash
curl -s -X POST "$EXPO_PUBLIC_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"otc-sync-test@example.com","password":"<password>"}'
```

**A screen showing "Signed in" is not proof sync worked.** Check the server.

## Human path

`npm run android` builds and leaves Metro in the foreground; `npm run web` is
the fastest loop for pure UI work but cannot exercise any native module, so it
proves nothing about notifications, haptics or the storage migration.

## Test

```bash
npm run verify        # type-check + lint + format:check + test — the CI gate
```

## Gotchas

- **A stale Metro looks exactly like broken code.** One here had been running
  15 days and predated every file added since, so it could not resolve the new
  screen directories and failed with import errors that pointed at perfectly
  good source. `doctor` flags any Metro whose uptime contains a day count;
  `install` kills it unconditionally. Restarting costs seconds. Not restarting
  cost an afternoon.

- **`expo run:android --device emulator-5554` silently does nothing.**
  `--device` wants an **AVD name**, not an adb serial. Given a serial it prints
  a normal-looking log, exits **0**, and never builds. With one device
  attached, pass no flag at all. This is why `install` takes no device argument.

- **A black screen after launch is usually the splash hold, not a crash.**
  `App.tsx` renders `null` until fonts and hydration both settle, and a debug
  build refetches the whole JS bundle from Metro on every cold start, so how
  long that takes varies — 15 seconds was enough once and not the next time.
  Screenshot too early and you get a black frame indistinguishable from a
  failure. This is why the driver polls for content rather than sleeping. If
  you are driving `adb` by hand, check `errors` before concluding anything.

- **`am start` briefly empties the view hierarchy.** A `uiautomator` dump taken
  immediately after a deep link returns nothing at all, which reads as "the
  screen is blank". It is not; it is mid-teardown.

- **uiautomator reports inverted bounds for anything scrolled out of view**, and
  this is the nastiest trap here. Profile's "Insights" row came back as
  `bounds="[53,2181][1028,2125]"` — note `y2 < y1`. Averaging those gives
  `y=2153`, a coordinate that looks perfectly plausible, lands in the tab bar,
  and taps the wrong thing while reporting success. The driver now rejects any
  node whose rectangle has zero or negative area. **Prefer a deep link over
  `tap` for anything below the fold.**

- **`$UID` is read-only in zsh.** Assigning a Supabase user id to it fails with
  `bad math expression`. Name it something else.

- **Sign in twice in one app session and the automatic post-sign-in sync does
  not land.** Signing out then straight back in leaves "Not synced yet"; a
  manual "Sync now" then works immediately. Not yet root-caused — suspected
  race between `signOut` clearing the stored session and `signInWithPassword`
  writing the new one. Tapping "Sync now" is the workaround, and any sync error
  is now displayed on the signed-in screen (it previously was not, which is how
  this went unnoticed).

- **`errors` must filter to E/F level.** Matching `AndroidRuntime` loosely picks
  up benign debug chatter that uiautomator emits on every `screen` and `tap`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Could not find device with name: emulator-5554` | Drop `--device`. See Gotchas. |
| Import errors for files that plainly exist | Stale Metro. `driver.sh doctor`, then `install`. |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | An older, differently-signed build is present: `adb uninstall com.otclearn.app`, then `install`. Note this wipes local data, so any migration you wanted to test is gone. |
| Blank/black screenshot | Wait ~15s and re-shoot, or use `restart`. Check `errors` before assuming a crash. |
| `no node matching "…"` from `tap` | Run `screen` to see the actual text. React Native often splits a line across nodes; match a distinctive fragment. |
| Account screen says sync is unavailable | `.env` has no `EXPO_PUBLIC_SUPABASE_*`. Babel inlines those **at build time**, so editing `.env` needs a rebuild, not a reload. |
