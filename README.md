# OTC Learn

A mobile learning app for OTC derivatives. Five asset classes, twenty products,
each with a five-step lesson and a five-question true/false quiz. Progress and
day streaks persist locally; there is no sign-up, and all content is bundled, so
the app works offline apart from a launch-time check for OTA updates.

React Native 0.86 · Expo SDK 57 · Redux Toolkit · TypeScript (strict)

## Getting started

```bash
npm install
cp .env.example .env

npm start          # Metro — press i / a for a simulator, or scan with Expo Go
npm run ios        # iOS simulator (requires Xcode)
npm run android    # Android emulator
npm run web        # browser preview, no Xcode needed
```

If the Android emulator cannot reach Metro, forward the port instead of relying
on your machine's LAN address, which changes between networks:

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

Current state: 137 tests across 20 suites, no TypeScript errors, no ESLint
warnings. Verified running on an Android emulator (Pixel 7, API 35), and a
signed production AAB builds on EAS. **iOS is unverified** — v1.0 targets
Android; the iOS scripts and config are present but no iOS build has been run.

## Content

Twenty products, four per asset class:

| Asset class | Products |
| --- | --- |
| Interest Rate | Interest Rate Swap · Swaption · Forward Rate Agreement · Cap and Floor |
| FX | FX Forward · FX Option · FX Swap · Non-Deliverable Forward |
| Credit | Credit Default Swap · CDX Index · Total Return Swap · Credit-Linked Note |
| Equity | Equity Swap · OTC Equity Option · Variance Swap · Contract for Difference |
| Commodity | Commodity Swap · Commodity Option · Commodity Forward · Crack Spread Swap |

Every product follows the same arc — what it is, how it works, why it's used,
key terms, risks to watch — for 100 lesson steps and 100 quiz questions in
total.

Content lives in `src/data/catalogue/`, one file per asset class, with
`src/data/products.ts` as the barrel that composes them. **Product ids are part
of the persisted schema**: completed products are stored in AsyncStorage keyed
by id, so renaming one silently discards a user's progress for it. Add freely;
rename only with a migration.

`__tests__/data/catalogue.test.ts` guards the structural invariants — unique
ids, resolvable category references, consecutive step numbering, uniform lesson
and quiz lengths, non-empty text, and a mix of true and false answers in every
quiz.

## Architecture

```
src/
  store/       Redux Toolkit slices (app, progress, quiz, streak) + thunks
  screens/     Home, Category, Lesson, Quiz — each with local components/
  components/  ui/ (Button, Card, Badge, ProgressBar, …) and common/
  theme/       colours, typography, spacing, radius, shadows
  data/        categories.ts, products.ts, catalogue/ (lesson + quiz content)
  hooks/       typed Redux hooks, navigation, hardware back, deep links, quiz, progress, fonts
  navigation/  RootNavigator, deep-link parsing
  utils/       AsyncStorage wrappers, formatters, analytics facade, crash reporting
```

### Navigation lives in Redux

`app.currentScreen` is the single source of truth, and `RootNavigator` is a
switch over it. The spec defines navigation entirely through `appSlice`
(`navigateToHome`, `navigateToCategory`, …) and has every screen read
`currentScreen` / `selectedCategoryId` / `selectedProductId`, so layering React
Navigation on top would duplicate that state in two places. The flow is five
flat screens with no nested stacks, so nothing needs a stack navigator.
`navigation/linking.ts` resolves `otclearn://category/<id>` and
`otclearn://product/<id>` into the same actions, and `useDeepLinks` dispatches
them — on a cold start via `getInitialURL`, and while running via the `url`
event. Ids are validated against the catalogue, so an unrecognised link leaves
the user where they were rather than on a broken screen.

### Screens are data-driven

Nothing hardcodes how many lesson steps or quiz questions a product has —
`LessonScreen` reads `product.lessons.length` and `useQuiz` reads
`questions.length`. Adding content is a data change alone, which is why the
journey tests derive their expected counts from the catalogue rather than from
literals.

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
reporting, which is the default and what **v1.0 ships** — the Sentry native SDK
sets `io.sentry.auto-init` to `false`, so an unset DSN leaves it genuinely
dormant rather than merely quiet. Turning it on for a release means updating
`PRIVACY.md` and the Play Data safety form first.

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

`PRIVACY.md` is the policy text to publish at the URL Play requires. It needs a
contact email filling in, and it describes crash reporting as conditional — keep
it in step with whether the shipped build actually has a DSN.

## Placeholder artwork

`assets/` holds generated placeholder art — an "OTC" wordmark over the five
asset-class accent colours — produced by
`node scripts/generate-placeholder-assets.js`:

| File | Size | Alpha | Notes |
| --- | --- | --- | --- |
| `icon.png` | 1024×1024 | **no** | App Store Connect rejects icons with an alpha channel, even a fully opaque one |
| `adaptive-icon.png` | 1024×1024 | yes | Android foreground; art sits inside the centre 66% mask safe zone |
| `splash.png` | 1284×2778 | no | Shown on `#EAE8E0` |
| `favicon.png` | 48×48 | yes | Web build |

`android.adaptiveIcon.backgroundColor` is `#181611`, not the app background —
the cream foreground would be invisible on a light background.

**Replace these before submitting to the stores.** They are legible and
correctly formatted, but they are blocky pixel letterforms, not designed
artwork. Re-running the script overwrites them.

## Licence

MIT — see [LICENSE](LICENSE).
