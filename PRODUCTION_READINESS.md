# Production readiness

Written 2026-07-28 from a full pre-production review, worked through on 2026-07-29,
revised on 2026-08-13 for the v1.1 release, and updated 2026-08-16 when v1.1 was
merged to `main` and its first production build cut. **v1.1 targets
Android only** — iOS config and scripts stay in the repo but nothing iOS-specific is
verified or blocking.

v1.1 ships **without crash reporting** — the code is in place and inert. OTA updates
stay on, and the daily reminder is a local notification, so the app's only network
call is a version check against `u.expo.dev` at launch. Both choices are reflected in
`docs/privacy.md` and in the Data safety answers in
`ANDROID_DEPLOYMENT_COMPLETE.md`.

---

## Done

### Pre-production review (2026-07-29)

- `android.versionCode` and `ios.buildNumber` removed from `app.json` — EAS owns both
  under `appVersionSource: "remote"`.
- `verify` runs `format:check` too, and unused path aliases were deleted from
  `babel.config.js`, `tsconfig.json` and `jest.config.js`.
- `ErrorBoundary` wraps `RootNavigator`; errors report through the `track` facade, and
  `errorReporting.ts` installs a Sentry sink only when a DSN is configured.
- Deep links wired up (`useDeepLinks`), and `useQuizExit` confirms before discarding a
  part-finished quiz.
- CI runs `npm run verify` on push and PR; `expo-updates` configured with a channel per
  build profile.
- Artwork redrawn and screenshots captured (`f3d5d2c`), the privacy policy published
  from `/docs` (`e959058`), and the Play Data safety answers written up (`104a74b`,
  `941cf2c`). **These three closed what earlier revisions of this file listed as
  blockers.**

### v1.1 upgrade (2026-08-13)

- Content: every product gained a summary, callouts, six key terms, a worked example,
  an in-practice note and related products; question banks went from 5 to 12 each,
  mixing true/false with four-option multiple choice — 240 questions in total. An
  adversarial accuracy audit ran over all five asset-class files and 13 corrections
  were applied, including a post-LIBOR convention error, an inverted CDS accrual, a
  reversed crack-spread ratio and a question with two defensible answers.
- Quizzes draw a weighted random subset per sitting and shuffle multiple-choice
  options, so a retake is a genuinely different paper.
- Progress moved from a completed flag to mastery (0–100, 0.35 learning rate), with a
  spaced-repetition review queue for missed questions.
- New shell: bottom tabs, a dashboard with SVG rings and a week strip, a product page,
  a products tab with search, a review tab, a profile with settings, a glossary and
  achievements.
- Store screenshots re-shot from the current build on 2026-08-13 (eight screens), the
  listing copy updated, and the Data safety notes extended to cover the notification
  and haptics permissions.
- Storage moved to schema v2 with a migration that carries v1 completed products across
  as mastery records. `clearAll()` finally has a caller — the reset in Profile.
- Four native dependencies added: `react-native-svg`, `expo-haptics`,
  `expo-notifications`, `react-native-reanimated`.
- Version set to **1.1.0**. That starts a new `runtimeVersion` under the `appVersion`
  policy, so installs still on 1.0.0 stop receiving OTA updates until they upgrade —
  which is the correct outcome here rather than a cost, since the four native
  dependencies mean this release could never have shipped over the air anyway. It
  needs a store build.

### v1.1 production build (2026-08-16)

- 14-day/12-tester closed testing completed and Google granted production access —
  on the **1.0.0** build (versionCode 3), predating v1.1. This unlocks the Production
  track for the account; it is not device verification of v1.1 itself, so items 2–4
  below are still open against this specific build.
- `v1.1-mastery-and-review` merged into `main` (`dac9488`) and built: **versionCode 4**,
  `1.1.0`, signed with the existing EAS-managed keystore (`Rk8YiwiZ1s`).
- Blocker 1 verified and closed: `bundletool dump manifest` against the built `.aab`
  (an AAB has no APK for `aapt2` to inspect directly) shows exactly `INTERNET`,
  `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`, `VIBRATE`, plus the self-scoped
  `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` Android generates for a receiver
  registered with `RECEIVER_NOT_EXPORTED` — no FCM permissions leaked in.

---

## Outstanding

No submission blockers remain — see "v1.1 production build" above.

### Live in production (read from the Play Console, 2026-08-30)

`4 (1.1.0)` has been **available on Google Play, full roll-out, in 177 of 177
countries since 16 August 2026** — the console lists no staged percentage and no
policy holds. Installed audience is 21, split 85.71% on versionCode 4 and 14.29%
still on `3 (1.0.0)`, which remains on the Alpha closed-testing track. So roughly
eighteen real installs have now been running v1.1 for two weeks, which is the
first real-user exposure the storage migration and the four native modules have
had — it is not device verification (nobody has reported back), but item 1 below
is no longer entirely unexercised.

### Before anything can be sold

1. ~~Add the billing dependency.~~ **Done, 2026-08-31.** `react-native-purchases`
   is in, `com.android.vending.BILLING` is declared, and the *release* manifest
   merge was checked rather than assumed — `expo prebuild` cannot show the real
   list, so `processReleaseMainManifest` was run and its output read. It is
   exactly v1.1's verified list plus `BILLING`:

   ```
   INTERNET · POST_NOTIFICATIONS · RECEIVE_BOOT_COMPLETED · VIBRATE
   com.android.vending.BILLING · com.otclearn.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION
   ```

   RevenueCat added nothing else, and none of the blocked FCM permissions leaked
   back in. A *debug* build additionally carries `SYSTEM_ALERT_WINDOW` from
   React Native's dev-overlay source set — expected, and absent from release.

2. **Upload a build to a test track.** Not done: this is native code, so it
   needs `eas build`, and the upload is the owner's to make. Until an uploaded
   binary declares `BILLING`, the console still refuses to create products.

3. **Finish the merchant verification.** The console reports *"There is an issue
   with your payments profile"* — verification under the RBI's Payment
   Aggregator Cross Border rules, initiated with **BillDesk**, status *in
   progress*, with a **90-day clock** from when the application was begun.
   Instructions were sent from `onboarding@billdesk.com`. Nothing can be sold
   until this completes, regardless of the binary.

4. **Then** create the subscription, and wire entitlements with a RevenueCat
   account and key — still not created.

Also offered in the console and worth taking: enrolment for the **15% service
fee** rather than the default 30%.

Also read while confirming this: subscription settings are enabled, real-time
developer notifications are **not** configured (no Pub/Sub topic set), and the
base64 licensing public key is available in Monetisation setup when it is needed.

### Verification gaps

1. **Only the happy path has been seen on a device.** Verified on a Pixel 7 emulator on
   2026-08-13: the home dashboard, category, product page, lesson, quiz (both question
   kinds, with option shuffling and feedback), review, glossary and profile. Still
   unexercised on real hardware: the daily reminder actually firing, permission being
   revoked in system settings mid-life, the review queue coming due across a real date
   change, haptics, the lesson swipe gesture, and an `eas update` push. The closed test
   that unlocked production access ran the pre-v1.1 build, so none of this is covered
   by real-user testing either.
2. ~~**Font scaling.**~~ Done on 2026-08-31, on a Pixel 7 at `font_scale 2.0` —
   the largest Android offers.

   The worry as written was wrong: React Native scales `lineHeight` along with
   `fontSize` on Android, so the pinned pairs in `theme/typography.ts` were never
   the problem, and body copy reflows correctly at 2x.

   What did break was the navigation furniture. "Products" wrapped onto a second
   line and spilled out of the tab bar on every screen; the review badge, a fixed
   circle drawn over its icon, could not contain its own number; and the
   dashboard's stat row ran off the card, rendering "DUE NOW" as "DUE NO" — which
   reads as a different phrase rather than as a cut-off one.

   The rule applied: **content scales in full, chrome does not.** Tab labels cap
   at 1.3x and the badge at 1.1x; the stat row shrinks so its label wraps. Nothing
   in the type scale is capped, and a test asserts that it stays that way.
3. **Migration on a real v1 install.** The v1→v2 migration is unit-tested — including
   the case where the write fails part-way, which is where it previously lost data —
   but has not been run against an actual app upgrade on a device holding v1 data.

### Housekeeping

- **The glossary renders all 216 terms eagerly.** It is a `ScrollView`, not a
  virtualised list, because `stickyHeaderIndices` needs the rows flattened as
  siblings of their headers. Measured at ~850ms for a full render in the test
  renderer, and adding a note control per row in the term-notes work made each
  row heavier. It is fine on an emulator and the search narrows it immediately,
  but it is the obvious thing to be slow on a low-end device, and moving to a
  `SectionList` would trade the sticky-header approach for virtualisation.

- **Screen-level test coverage was thin** where the logic is thickest in components.
  Closed on 2026-08-30: `SettingsRows` 35% → 100%, `ProfileScreen` 69% → 100%,
  `ReviewScreen` 39% → 93%, `QuizTimer` → 100%, `LessonScreen` 71% → 80%. The
  project is at 95% statements overall.

  What is left in `LessonScreen` is the `PanResponder` body: driving it needs a
  fabricated touch history, and the rules it applies are pure and already covered
  in `__tests__/utils/swipe.test.ts`. `ReviewScreen`'s `whenLabel` still has an
  unreachable `'Today'` branch — both callers exclude items that are already due —
  left in place as a guard rather than deleted.
### Deferred by choice

- **Crash reporting.** Still ships dark, and deliberately so, but everything that
  does not need a Sentry account is now done.

  Confirmed dormant against the built bundle rather than assumed:
  `bundletool dump manifest` shows `io.sentry.auto-init` set to `false`, and the
  SDK contributes only its two providers. `initErrorReporting` returns early
  without a DSN, sets `sendDefaultPii: false`, and pins `tracesSampleRate: 0` —
  performance tracing is a separate product with its own quota, and enabling it
  by accident is the usual way a free account is exhausted.

  The `@sentry/react-native/expo` config plugin is now added — without it stack
  traces arrive minified and are close to useless. Two traps came with it:

  1. It needs `@expo/config-plugins` present at the top level, or `expo prebuild`
     fails with `Cannot find module`. It is a devDependency now.
  2. **It breaks the release build when no Sentry credentials exist.**
     `sentry-cli` exits non-zero trying to upload source maps, failing
     `assembleRelease` — the debug build passes, so this would only have shown up
     on the production build that matters. Every `eas.json` profile therefore
     sets `SENTRY_DISABLE_AUTO_UPLOAD=true`.

  **To switch it on**, in this order: update `docs/privacy.md`; update the Play
  Data safety form to declare **Crash logs**; then set `EXPO_PUBLIC_SENTRY_DSN`,
  `EXPO_PUBLIC_APP_ENV=production`, `SENTRY_ORG`, `SENTRY_PROJECT` and
  `SENTRY_AUTH_TOKEN` as EAS secrets and **remove `SENTRY_DISABLE_AUTO_UPLOAD`
  from `eas.json`** — leaving it in is the one way to ship a build whose stack
  traces are unreadable. Sentry is native code, so it needs a new build; an OTA
  update cannot switch it on.
- **iOS.** Scripts, `bundleIdentifier` and config remain, unverified. Revisit after
  Android ships.
- **Review mode does not move mastery.** A deliberate choice, documented in the README:
  four scattered questions across four products is not a measurement of any one
  product. Worth revisiting if users find it confusing.
