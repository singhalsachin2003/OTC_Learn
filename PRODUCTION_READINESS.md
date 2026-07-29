# Production readiness

Written 2026-07-28 from a full pre-production review; updated 2026-07-29 after
working through it. **v1.0 targets Android only** — iOS config and scripts stay
in the repo but nothing iOS-specific is verified or blocking.

Current state: `npm run verify` green (137 tests across 20 suites, type-check,
lint and format), 97% statement / 79% branch coverage, CI running the same
command on every push.

---

## Done

### Mechanical fixes

- `android.versionCode` and `ios.buildNumber` removed from `app.json` — EAS owns
  both under `appVersionSource: "remote"`.
- `verify` now runs `format:check` too, and the one file that failed it
  (`__tests__/data/catalogue.test.ts`) is formatted.
- Unused path aliases (`@/`, `@screens/`, …) deleted from `babel.config.js`,
  `tsconfig.json` and `jest.config.js`, along with `babel-plugin-module-resolver`.
  Every import in the codebase is relative; three configs no longer have to stay
  in sync for nothing.
- Redundant direct `test-renderer` devDependency removed — it arrives with
  `@testing-library/react-native` anyway.
- `BackButton` takes an optional `accessibilityLabel`, so the quiz screen no
  longer announces "Back to Exit quiz".

### Failure handling

- `src/components/common/ErrorBoundary.tsx` wraps `RootNavigator`. A render
  error now shows a recovery screen rather than a blank one, and its reset
  dispatches `goHome` — the screen that threw is still selected, so remounting
  it alone would loop.
- Errors are reported through the existing `track` facade as a new `app_error`
  event, so the boundary knows nothing about the provider.
- `src/utils/errorReporting.ts` installs a Sentry sink when a DSN is configured:
  `app_error` becomes an exception with the component stack attached, every
  other event becomes a breadcrumb. With no DSN the app makes no network calls
  at all, which stays the default.
- Config is passed as an argument with `EXPO_PUBLIC_*` only as defaults, because
  Babel inlines those at build time — they are literals by the time the code
  runs, which is also why the first attempt at testing this by mutating
  `process.env` did not work.

### Deep links

- `useDeepLinks` dispatches `parseDeepLink`/`actionsForLink` results, handling
  both cold start (`getInitialURL`) and warm delivery (the `url` event), mounted
  in `RootNavigator` beside `useHardwareBack`.
- Writing the tests surfaced a real defect: `getInitialURL` is typed
  `Promise<string | null>` but resolves `undefined` when there was no launch
  link, which crashed `parseDeepLink`. The guard is now on the type.

### Quiz exit

- `useQuizExit` confirms before discarding a part-finished quiz. Both the
  on-screen control and the hardware back button route through it, so they
  cannot drift; an untouched quiz exits with no prompt, and the results screen
  is unaffected.

### Release infrastructure

- `.github/workflows/ci.yml` runs `npm run verify` on push and PR to `main`,
  Node 22, npm cache on, redundant in-flight runs cancelled.
- `expo-updates` installed, `runtimeVersion` policy `appVersion`, `updates.url`
  pointing at the existing EAS project, and one channel per build profile in
  `eas.json`. A JS-only fix can now ship with `eas update` instead of a store
  review.

### Store-facing content

- Home screen carries an "educational content only, not financial advice" line.
- `PRIVACY.md` holds policy text matching what the app actually does.

---

## Outstanding

### Blockers for submission

1. **Real artwork.** `assets/` is still the generated "OTC" wordmark placeholder
   set. Needed: `icon.png` 1024×1024 with no alpha, `adaptive-icon.png` with art
   inside the centre 66% safe zone, `splash.png` 1284×2778, plus a Play feature
   graphic (1024×500) and at least two phone screenshots, which the repo does
   not have at all. The README table is the spec.
2. **Publish the privacy policy.** `PRIVACY.md` is complete — contact address
   included — and needs a live URL. Play requires one for every app and rejects
   an unreachable link, so confirm the page loads before submitting.
   `ANDROID_DEPLOYMENT_COMPLETE.md` suggests GitHub Pages off this repo.
3. **Play Data safety form.** If the shipped build has a Sentry DSN, it must
   declare crash-log collection; if not, it declares nothing collected. Answer
   it to match the build you actually submit.

### Sentry follow-ups

4. **A DSN.** Nothing is reported until `EXPO_PUBLIC_SENTRY_DSN` is set in the
   build environment. Set it as an EAS build secret for the production profile,
   with `EXPO_PUBLIC_APP_ENV=production` alongside.
5. **Source maps are not uploaded.** The `@sentry/react-native/expo` config
   plugin handles that and needs your Sentry org and project slugs, which I did
   not have. Without it, reports arrive but stack traces are minified.
6. **Sentry adds native code**, so it only takes effect in a new build — Expo Go
   and any existing dev client will not report.

### Verification gaps

7. **Nothing here has been run on a device.** The error boundary, deep links,
   the back-button confirmation and OTA updates are covered by tests against
   mocks; none has been exercised on real Android. Before submitting: install a
   preview APK, force a crash, open `otclearn://product/irs` from a browser,
   back out of a half-finished quiz, and push an `eas update` to the preview
   channel.
8. **Font scaling.** Several styles pin `lineHeight` next to `fontSize`; text
   may clip at the largest accessibility sizes. One pass on a device.

### Deferred by choice

- **iOS.** Scripts, `bundleIdentifier` and config remain, unverified. Revisit
  after Android ships.
- **In-app progress reset.** `clearAll()` in `src/utils/storage.ts` is still
  written and unused. It would give the function a purpose and users a way to
  start over, but nothing depends on it.
