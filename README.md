# OTC Learn

A mobile learning app for OTC derivatives. Five asset classes, twenty products,
each with a five-step lesson and a five-question true/false quiz. Progress and
day streaks persist locally; the app works fully offline with no sign-up.

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
npm run verify         # type-check + lint + tests
npm run test:coverage  # coverage report (threshold: 70% lines)
npm run format:check   # Prettier
```

Current state: 104 tests across 14 suites, no TypeScript errors, no ESLint
warnings. Verified running on an Android emulator (Pixel 7, API 35), and a
signed production AAB builds on EAS.

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

## Known issues

- **The Android hardware back button is not handled.** `RootNavigator` renders
  from Redux rather than a navigator, and nothing registers a `BackHandler`, so
  in a standalone build pressing back closes the app from any screen instead of
  navigating up. The in-app back controls work correctly. Fixing this means
  dispatching the existing `appSlice` navigation actions from a
  `hardwareBackPress` listener.
- **`android.versionCode` in `app.json` is dead config.** `eas.json` sets
  `appVersionSource: "remote"`, so EAS owns the counter and the value in
  `app.json` is ignored.

## Building and releasing

```bash
npm run build:android          # production AAB via EAS
npm run build:android:preview  # installable APK, useful for screenshots
npm run submit:android         # upload the latest build to Play
```

Signing is handled by EAS-managed credentials — there is no keystore in this
repo, and there should never be one. `expo prebuild` regenerates `android/` and
`ios/`, both of which are gitignored.

`ANDROID_DEPLOYMENT_COMPLETE.md` walks the full path from testing to a live Play
Store listing. Note that its Phase 4 describes a bare-workflow keystore setup
that does not apply here.

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
