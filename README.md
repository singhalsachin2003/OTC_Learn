# OTC Learn

A mobile learning app for OTC derivatives. Six categories, thirty-six products,
each with a product page, a five-step lesson and a twelve-question bank that
every quiz draws a different paper from. Mastery, day streaks and a
spaced-repetition review queue persist locally; there is no sign-up, and all
content is bundled, so the app works offline apart from a launch-time check for
OTA updates and an optional local daily reminder.

React Native 0.86 · Expo SDK 57 · Redux Toolkit · TypeScript (strict)

## Getting started

```bash
npm install
cp .env.example .env

npm start          # Metro on its own
npm run android    # prebuild + native debug build, installs on a device/emulator
npm run web        # browser preview
```

**Expo Go will not run this app.** It carries native modules Expo Go does not
bundle — `expo-updates`, `@sentry/react-native`, `react-native-svg`,
`react-native-reanimated`, `expo-haptics` and `expo-notifications` — so
`npm run android` builds and installs a real APK via `expo run:android`. First
run takes a few minutes; later runs are incremental.

Gradle needs the Android SDK location. If you see "SDK location not found",
export it before building:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"
```

If the emulator cannot reach Metro, forward the port instead of relying on your
machine's LAN address, which changes between networks:

```bash
adb reverse tcp:8081 tcp:8081
```

## Verification

```bash
npm run verify         # type-check + lint + format:check + tests
npm run test:coverage  # coverage report (threshold: 70% lines)
```

`verify` is what CI runs on every push and pull request
(`.github/workflows/ci.yml`).

Current state: 529 tests across 31 suites, no TypeScript errors, no ESLint
warnings, 91% statement coverage. The dashboard, category, product page, lesson,
quiz (both question kinds, with option shuffling), review, glossary and profile
were verified on an Android emulator (Pixel 7, API 35), and a
signed production AAB builds on EAS. **iOS is unverified** — v1.1 targets
Android; the iOS scripts and config are present but no iOS build has been run.
See `PRODUCTION_READINESS.md` for what has not been exercised on a device.

## Content

Thirty-six products, six per category — five asset classes plus the market
infrastructure they all sit on:

| Category | Products |
| --- | --- |
| Interest Rate | Interest Rate Swap · Swaption · Forward Rate Agreement · Cap and Floor · Inflation Swap · Basis Swap |
| FX | FX Forward · FX Option · FX Swap · Non-Deliverable Forward · Cross-Currency Swap · Risk Reversal |
| Credit | Credit Default Swap · CDX Index · Total Return Swap · Credit-Linked Note · Asset Swap · Credit Index Option |
| Equity | Equity Swap · OTC Equity Option · Variance Swap · Contract for Difference · Dividend Swap · Autocallable Note |
| Commodity | Commodity Swap · Commodity Option · Commodity Forward · Crack Spread Swap · Weather Swap · Swing Option |
| Market Foundations | Collateral and the CSA · Central Clearing · Valuation and Marking · The ISDA Architecture · XVA and Counterparty Risk · Execution and Reporting |

Every product follows the same arc — what it is, how it works, why it's used,
key terms, risks to watch — and carries, beyond the five lesson steps:

- a **summary** and a difficulty rating,
- **callouts** on the steps with a concrete fact to add,
- six **key terms**, which also feed a catalogue-wide glossary,
- a **worked example** with real numbers that compute,
- an **in practice** note naming who trades it and why,
- **related products** to read next,
- a bank of **twelve questions**, mixing true/false and four-option multiple
  choice, each tagged with the lesson step it tests and a difficulty.

That is 100 lesson steps, 120 key terms and 240 questions.

Content lives in `src/data/catalogue/`, one file per asset class, with
`src/data/products.ts` as the barrel that composes them. **Product and question
ids are part of the persisted schema**: mastery is keyed by product id and the
review queue by question id, so renaming either silently discards a user's
progress for it. Add freely; rename only with a migration.

`__tests__/data/catalogue.test.ts` guards the structural invariants — unique
ids, resolvable category and related-product references, consecutive step
numbering, uniform lesson and bank sizes, non-empty text, four distinct options
per choice question with `correctIndex` in range, coverage of all five lesson
steps, and a spread of both answer kinds and difficulty in every bank.

## Architecture

```
src/
  store/       Redux Toolkit slices (app, progress, quiz, review, settings, streak) + thunks
  screens/     Home, Products, Category, Product, Lesson, Quiz, Review, Profile,
               Glossary, Achievements — each with local components/
  components/  ui/ (Button, Card, Ring, Toggle, StatTile, WeekStrip, …) and common/
  theme/       colours, typography, spacing, radius, shadows
  data/        categories.ts, products.ts, achievements.ts, catalogue/
  hooks/       typed Redux hooks, navigation, hardware back, deep links, quiz,
               review, progress, fonts
  navigation/  RootNavigator, deep-link parsing
  utils/       storage, mastery, review scheduling, quiz selection, shuffling,
               formatters, haptics, notifications, analytics, crash reporting
```

### Navigation lives in Redux

`app.currentScreen` is the single source of truth, and `RootNavigator` is a
switch over it. The spec defines navigation entirely through `appSlice`
(`navigateToHome`, `navigateToCategory`, …) and has every screen read
`currentScreen` / `selectedCategoryId` / `selectedProductId`, so layering React
Navigation on top would duplicate that state in two places.

Adding tabs did not change that. The bar is a control over the same state rather
than a second navigator with its own history: `currentTab` records which tab a
detail screen was reached from, so the bar keeps highlighting where you came
from, and `showsTabBar()` hides it on the lesson, quiz and results screens —
those are tasks with their own exit, and leaving the bar up invites a mis-tap
that discards a part-finished quiz.

`navigation/linking.ts` resolves `otclearn://` links — `category/<id>`,
`product/<id>` (the product page), `lesson/<id>`, `review`, `profile` and
`glossary` — into the same actions, and `useDeepLinks` dispatches them: on a
cold start via `getInitialURL`, and while running via the `url` event. Ids are
validated against the catalogue, so an unrecognised link leaves the user where
they were rather than on a broken screen.

### Progress is mastery, not a tick

A quiz score is noisy: someone can guess their way to 5/6 once, or misread two
questions on a product they know well. So mastery moves *toward* each new score
at a 0.35 learning rate rather than being replaced by it (`utils/mastery.ts`),
which means one good run cannot mark a product learned and one bad run cannot
undo weeks of work. Every product starts at zero — nothing is seeded. 70% is the
threshold at which a product counts as mastered.

The category rings, the headline percentage, the achievements and the resume
card all derive from that one number, so there is no second source of truth to
drift out of step with it.

### Every quiz is a different paper

Each product has twelve questions and a sitting draws six (configurable, 4–12).
Selection is weighted rather than sorted (`utils/quizSession.ts`): a question you
have missed outranks one you have never seen, which outranks one you have already
answered correctly — but every weight stays above zero, so nothing is permanently
retired and two consecutive attempts with identical history still differ.

Multiple-choice options are shuffled too, with `correctIndex` moved along with
them, so a repeat visitor learns the content rather than the position of the
answer. Option sets that read as a sequence — all numeric, all percentages, all
money — are left in their authored order, because reordering those makes a
question harder to read without making it harder to answer.

### Missed questions come back

`utils/review.ts` implements the schedule the app promises: tomorrow, then in
four days, then in ten, and after that on an SM-2 style ease factor capped at 120
days. A wrong answer sends an item back to the start and increments its lapse
count; three clean passes retire it. The Review tab shows what is due, and the
tab bar carries the count.

A review sitting deliberately does **not** move product mastery. Mastery measures
how a full paper on one product went, and four scattered questions across four
products is not that measurement — getting them right still shows up, by
emptying the queue and changing what future papers draw.

### Screens are data-driven

Nothing hardcodes how many lesson steps or quiz questions a product has —
`LessonScreen` reads `product.lessons.length` and `useQuiz` reads
`questions.length`. Adding content is a data change alone, which is why the
journey tests derive their expected counts from the catalogue rather than from
literals.

### Storage is versioned, and v1 progress survives

`utils/storage.ts` owns every key, and `runMigrations()` runs before anything
reads them. v1 stored a flat array of completed product ids; v2 stores a mastery
record per product, plus question history, the review queue, settings, bookmarks,
study days and unlocked achievements.

Each v1 completed id becomes a record at the completion threshold. v1 marked a
product complete for *finishing* a quiz regardless of score, so its true mastery
is unknown, and the threshold is the only figure that both honours the badge the
user earned and stays honest about what was actually measured. The version stamp
is written last, so a crash mid-migration leaves the old data in place and the
next launch tries again.

Every read swallows failures and malformed payloads — a corrupt cache should cost
a user their streak, not their ability to open the app.

### The daily reminder answers to the OS, not to us

`utils/notifications.ts` schedules one local notification, off by default so the
permission prompt appears when the user asks for reminders rather than ambushing
them on first launch. Permission can be revoked in system settings at any time,
so `syncReminder` reconciles on every launch: a stored "on" with nothing actually
scheduled — a reinstall, a restore to a new device, a revoked permission — is
either repaired by rescheduling or reported back so the toggle switches itself
off rather than lying.

### Colour

Every colour in the design handoff is specified in OKLCH, which React Native's
`StyleSheet` cannot parse. `theme/colors.ts` holds the sRGB hex conversion of
each value with the source OKLCH kept in a comment beside it, so the tokens stay
traceable back to the design.

### Streaks

`streakSlice` applies the rules (same day → unchanged, next day → +1, longer gap
or a backwards clock → reset to 1) against a local `YYYY-MM-DD` key, so streaks
roll at the user's midnight rather than UTC. The app hydrates from storage on
launch and then records the day's activity, so the rules always see the stored
`lastActivityDate`.

### Hardware back

A stack navigator would have given us the Android back button for free; a Redux
switch does not, so `useHardwareBack` supplies it. Mounted once in
`RootNavigator`, it maps each screen to the destination its on-screen back
control already uses — category → home, lesson/quiz/results → the product's
asset class — and returns `false` on home so the OS default closes the app at
the root of the flow. `BackHandler` is inert outside Android, so the hook is
mounted unconditionally.

Leaving a quiz always discards it, so `useQuizExit` confirms first when at least
one question has been answered. Both the on-screen control and the hardware
button go through that hook, so the two cannot drift apart; an untouched quiz
has nothing to lose and exits without a prompt.

### Failure handling

`ErrorBoundary` wraps `RootNavigator`, so a render error shows a recovery screen
instead of a blank one, and its "Back to home" action resets navigation — the
screen that threw is still the selected one, so remounting it alone would loop.

Errors are reported through the `track` facade in `utils/analytics.ts` rather
than to a provider directly. `utils/errorReporting.ts` installs a Sentry sink
when `EXPO_PUBLIC_SENTRY_DSN` holds a value, forwarding `app_error` as an
exception and every other event as a breadcrumb for context. No DSN means no
reporting, which is the default and what **v1.1 ships** — the Sentry native SDK
sets `io.sentry.auto-init` to `false`, so an unset DSN leaves it genuinely
dormant rather than merely quiet. Turning it on for a release means updating
`docs/privacy.md` and the Play Data safety form first.

`EXPO_PUBLIC_*` values are inlined by Babel at build time, not read at runtime,
which is why `initErrorReporting` takes its config as an argument with the env
values only as defaults.

## Building and releasing

```bash
npm run build:android          # production AAB via EAS
npm run build:android:preview  # installable APK, useful for screenshots
npm run submit:android         # upload the latest build to Play
```

Signing is handled by EAS-managed credentials — there is no keystore in this
repo, and there should never be one. `expo prebuild` regenerates `android/` and
`ios/`, both of which are gitignored.

`expo-updates` is configured with a `runtimeVersion` policy of `appVersion` and
one EAS Update channel per build profile, so a JS-only fix can ship with
`eas update --channel production` instead of a store review. Anything touching
native code still needs a new build, and bumping `version` in `app.json` starts
a new runtime version — older installs stop receiving updates until they
upgrade.

`ANDROID_DEPLOYMENT_COMPLETE.md` walks the full path from testing to a live Play
Store listing. Note that its Phase 4 describes a bare-workflow keystore setup
that does not apply here.

`docs/privacy.md` is the policy text to publish at the URL Play requires. It needs a
contact email filling in, and it describes crash reporting as conditional — keep
it in step with whether the shipped build actually has a DSN.

## Artwork

`assets/` is generated by `node scripts/generate-assets.js` — no design tool and
no native image dependency. The "OTC" wordmark is drawn from geometry rather
than a font (O is a ring, T two bars, C a ring with a wedge removed), every
shape is tested analytically per sub-sample, and the result is downsampled, so
the curves stay smooth at any size.

| File | Size | Alpha | Notes |
| --- | --- | --- | --- |
| `icon.png` | 1024×1024 | **no** | App Store Connect rejects icons with an alpha channel, even a fully opaque one. Lockup takes 60% of the width so launcher masks have room |
| `icon-play-512.png` | 512×512 | yes | Play store listing icon — a separate upload from the launcher icon above |
| `adaptive-icon.png` | 1024×1024 | yes | Android foreground; drawn at 45% width to stay inside the centre 66% mask safe zone |
| `splash.png` | 1284×2778 | no | Shown on `#EAE8E0`, so the mark is dark rather than cream |
| `favicon.png` | 48×48 | yes | Web build; wordmark only — the accent bar cannot read at that size |
| `feature-graphic.png` | 1024×500 | no | Play store listing header |

`android.adaptiveIcon.backgroundColor` is `#181611`, not the app background —
the cream foreground would be invisible on a light background.

Re-running the script overwrites all five. Swap in commissioned artwork any
time; nothing depends on these being generated.

## Store assets

`store-assets/screenshots/` holds phone screenshots captured from a Pixel 7
emulator at 1080×2400 by `scripts/capture-screenshots.sh`. That script drives
the app through `otclearn://` deep links rather than synthetic taps, so it stays
stable against layout changes. `STORE_LISTING.md` holds the listing copy.

## Licence

MIT — see [LICENSE](LICENSE).

Third-party material redistributed by the app is listed in [NOTICE.md](NOTICE.md).
The embedded Plus Jakarta Sans weights are under the SIL Open Font License,
which asks that its notice ships with the font.
