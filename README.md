# OTC Learn

A mobile learning app for OTC derivatives. Five asset classes, ten products,
each with a three-step lesson and a three-question true/false quiz. Progress and
day streaks persist locally; the app works fully offline.

React Native 0.73 · Expo SDK 50 · Redux Toolkit · TypeScript (strict)

## Getting started

```bash
npm install
npm start          # Metro — press i / a for a simulator, or scan with Expo Go
npm run ios        # iOS simulator (requires Xcode)
npm run android    # Android emulator
npm run web        # browser preview, no Xcode needed
```

## Verification

```bash
npm run verify         # type-check + lint + tests
npm run test:coverage  # coverage report (threshold: 70% lines)
npm run format:check   # Prettier
```

Current state: 95 tests passing, 96% line coverage, no TypeScript errors, no
ESLint warnings. Both the iOS and web bundles build (`npx expo export`).

## Architecture

```
src/
  store/       Redux Toolkit slices (app, progress, quiz, streak) + thunks
  screens/     Home, Category, Lesson, Quiz — each with local components/
  components/  ui/ (Button, Card, Badge, ProgressBar, …) and common/
  theme/       colours, typography, spacing, radius, shadows
  data/        categories.ts, products.ts (all lesson + quiz content)
  hooks/       typed Redux hooks, navigation, quiz, progress, fonts
  navigation/  RootNavigator, deep-link parsing
  utils/       AsyncStorage wrappers, formatters, analytics facade
```

### Navigation lives in Redux

`app.currentScreen` is the single source of truth, and `RootNavigator` is a
switch over it. The spec defines navigation entirely through `appSlice`
(`navigateToHome`, `navigateToCategory`, …) and has every screen read
`currentScreen` / `selectedCategoryId` / `selectedProductId`, so layering React
Navigation on top would duplicate that state in two places. The flow is five
flat screens with no nested stacks, so nothing needs a stack navigator.
`navigation/linking.ts` resolves `otclearn://category/<id>` and
`otclearn://product/<id>` into the same actions.

### Colour

Every colour in the design handoff is specified in OKLCH, which React Native's
`StyleSheet` cannot parse. `theme/colors.ts` holds the sRGB hex conversion of
each value with the source OKLCH kept in a comment beside it, so the tokens stay
traceable back to the design.

### Content

All 30 lesson steps and 30 quiz questions are transcribed verbatim from
`design_handoff_otc_learning_app/OTC Derivatives Learning App.dc.html` into
`src/data/products.ts`. The prototype's product list is authoritative and
differs from the one sketched in the spec's summary — it ships CDX Index rather
than "Default Swaps", OTC Equity Option rather than "Variance Swaps", and
Commodity Swap/Option rather than "Futures".

### Streaks

`streakSlice` applies the rules (same day → unchanged, next day → +1, longer gap
or a backwards clock → reset to 1) against a local `YYYY-MM-DD` key, so streaks
roll at the user's midnight rather than UTC. The app hydrates from storage on
launch and then records the day's activity, so the rules always see the stored
`lastActivityDate`. The prototype's hard-coded "4" is replaced by the real
count.

## Changes made to the supplied config

The scaffolding files that came with the spec had a few things that would have
broken the build:

- **`main` pointed at `expo-app.json`.** Now `index.js`, which registers the
  root component.
- **React Navigation package names were wrong** (`react-navigation-native`,
  `react-navigation-stack` — the real ones are `@react-navigation/*`). Dropped
  entirely, since navigation is Redux-driven.
- **Font files did not exist.** `assets/fonts/PlusJakartaSans-*.ttf` were
  referenced by the `expo-font` plugin but never shipped. Replaced with
  `@expo-google-fonts/plus-jakarta-sans`, which bundles the four weights, loaded
  in `hooks/useAppFonts.ts`.
- **Missing icon/splash assets** (`./assets/icon.png` and friends) were
  referenced in `app.json` but never shipped, which would fail `expo prebuild`.
  Placeholder artwork is now generated into `assets/` and wired back up — see
  below.
- **Invalid `app.json` keys**: `supportsTabletMode` → `supportsTablet`;
  `supportsLandscape` removed (`orientation: "portrait"` already covers it);
  `UIRequiredDeviceCapabilities: ["armv7"]` removed, since it would exclude
  every 64-bit-only device — that is, every iOS 13+ device.
- **Firebase, Sentry and Detox were listed but unused.** Removed to keep
  `npm install && npm start` working without native configuration or a DSN.
  `utils/analytics.ts` is a no-op facade with a `setAnalyticsSink` seam, so
  wiring a provider later touches one file.
- **Jest was unconfigured** (no preset, so RN/Expo modules would not transform).
  Now `jest-expo` with the alias map, `transformIgnorePatterns`, and a 70%
  coverage threshold.
- **`tsconfig.json` excluded `__tests__`**, so `npm run type-check` never saw
  the tests. Now extends `expo/tsconfig.base` and includes both.
- **`babel-plugin-module-resolver` was configured but not installed**, so the
  `@/*` path aliases would have failed at runtime. Added.

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

## Not yet verified

- **iOS simulator and Android emulator runs.** This machine has Command Line
  Tools but not Xcode, and no Android SDK, so neither simulator was available.
  The iOS and web bundles build via `npx expo export`; a real device run is
  still outstanding.
- **`eas build`.** Requires an Expo account and `eas init` to add the project
  id. `eas.json` is the supplied file, unmodified and not yet exercised against
  a real build.
- **Store submission metadata** — screenshots, descriptions, privacy details.
