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

## versionCode 8 was submitted to production on 2026-09-12

**Full rollout, in review.** Promoted from the internal track rather than
re-uploaded — Play will not take the same version code twice, so promotion is a
Console action and not a second `eas submit`. Publishing overview reads "Changes
in review"; Google quotes up to seven days, usually less, and quick checks run
first.

The release carries the 464-character notes from `STORE_LISTING.md`, including
the line that matters most to the 23 existing installs: they keep everything,
permanently, the four new asset classes included.

**Two warnings were raised and both were read before saving**, neither an error:
the bundle is significantly larger (36 products became 66, with depth on the
free ones), and there is no deobfuscation file because R8 is off — which is the
deferred item below, not a regression.

**What is live the moment it rolls out:** the paywall applies to new installs,
`OTCLAUNCH` is in the wild as a 60-day free code, and money can actually change
hands. The only money-side gap left is the payout method.

### The build itself

**versionCode 8 was built on 2026-09-12** from `eede052` — build
`c9852444-5d52-4cca-8409-826301ee856e`, runtime 1.2.0, EAS-signed. Verified on
the artifact rather than the build log:

- `goog_Kqhj…` present in the Hermes bundle and **no `test_` key anywhere**,
  which is the failure that would ship an app unable to sell anything;
- permissions exactly as documented — `INTERNET`, `POST_NOTIFICATIONS`,
  `RECEIVE_BOOT_COMPLETED`, `VIBRATE`, `com.android.vending.BILLING` and the
  AndroidX receiver permission. **No `AD_ID`**, which is also the evidence for
  answering the Ads and Advertising ID declarations "No";
- `ExpoStoreReview` present in `classes5.dex`, so the update already live on the
  `production` channel is safe for this binary — it was not for versionCode 7;
- the paid catalogue and both promo codes are in the bundle, and the corrected
  Ashanti figure ("What a 29% rally does") shipped with it.

**`eas submit` cannot upload it yet.** `eas.json` now carries
`serviceAccountKeyPath` for both submit profiles — pointing at
`~/.config/otc-learn/play-service-account.json`, which stays outside the repo —
and that half works: the key resolves and the submission schedules. Play then
rejects it:

> The service account is missing the necessary permissions to submit the app to
> Google Play Store.

The account `otc-learn-revenuecat@otc-learn-play.iam.gserviceaccount.com` was
created for the Play Developer API reads RevenueCat needs, and those are a
different grant from releasing. **Play Console → Users and permissions → that
account → App permissions → Releases → "Release to testing tracks"** (add
"Release to production" too if `eas submit --profile production` is ever wanted).
Then re-run the submit; nothing needs rebuilding.

Until then the AAB uploads by hand: Testing → Internal testing → Create new
release.

What remains is uploading it and the two Console declarations below.

**Every Console-side gate in this list is open, and what blocked a sale was the
binary.** Billing is declared, the products
exist and are priced, RevenueCat reports valid credentials, and BillDesk
merchant verification has completed. The newest build is still **versionCode 7,
cut 2026-09-01 from `e9b42e0`** — it predates all four premium asset classes, so
its paywall is inert no matter what the Console says, and production is older
still at versionCode 4. **Cutting versionCode 8 from `main` is the whole
remaining path to a first sale.** The only money-side unknown left is the payout
method in item 4, which strands earnings rather than blocking a purchase.

1. ~~Add the billing dependency.~~ **Done, 2026-08-31.** `react-native-purchases`
   is in, `com.android.vending.BILLING` is declared, and the _release_ manifest
   merge was checked rather than assumed — `expo prebuild` cannot show the real
   list, so `processReleaseMainManifest` was run and its output read. It is
   exactly v1.1's verified list plus `BILLING`:

   ```
   INTERNET · POST_NOTIFICATIONS · RECEIVE_BOOT_COMPLETED · VIBRATE
   com.android.vending.BILLING · com.otclearn.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION
   ```

   RevenueCat added nothing else, and none of the blocked FCM permissions leaked
   back in. A _debug_ build additionally carries `SYSTEM_ALERT_WINDOW` from
   React Native's dev-overlay source set — expected, and absent from release.

2. ~~**Upload a build to a test track.**~~ **Done, 2026-09-01.** versionCode 7
   (1.2.0) is on the internal testing track, which is what unblocked creating
   the products — the Console refuses until an uploaded binary declares
   `BILLING`. Note what this build is *not*: cut from `e9b42e0`, it predates
   every premium asset class and `expo-store-review`, so a newer AAB is needed
   for reasons that have nothing to do with billing.

3. ~~**Finish the merchant verification.**~~ **Done — verified in the Console on
   2026-09-12.** Settings → Developer account → Payments profile lists the same
   two accounts, and **neither carries the _"Issue with account"_ flag any
   more**:

   | Account           | Scope        | Status  |
   | ----------------- | ------------ | ------- |
   | `…0122-7525-9540` | Cross border | no flag |
   | `…7416-6616-5410` | India only   | no flag |

   Opening the India-only account shows the Console's own confirmation in place
   of the old BillDesk banner: _"Your recent merchant account verification was
   successful. Your sales and payouts will continue without interruption."_

   The PA-CB banner that used to sit here — _"Follow the instructions sent to
   the primary contact … from `onboarding@billdesk.com`"_ — is gone, and with it
   the 90-day clock. **Selling is no longer gated on the payments profile**, on
   either the cross-border or the India-only account, so the India-only pricing
   needs no workaround.

4. **A payout method may still be missing, and it is now the only money-side
   unknown.** As of 2026-09-06 the payments account read _"Add a payment method
   to receive your earnings"_, with earnings ₹0.00 against a ₹100 threshold and
   no transactions. This was always independent of BillDesk, so the
   verification clearing does not settle it, and **it could not be re-read on
   2026-09-12**: the account detail sheet renders its body lazily and the
   scraper got the verification banner but never the payout row. Confirm it by
   eye in Settings → Developer account → Payments profile → the India-only
   account. Nothing can be paid out until a bank account is there, and entering
   one is the owner's to do, not something to automate.

   Worth being precise about what this does and does not block: a missing payout
   method does **not** stop a user buying. It only strands the money at Google,
   and only above the ₹100 threshold.

5. ~~**Then** create the products and price them.~~ **Done 2026-09-02.** One
   subscription `otc_learn_pro` with two active base plans, **₹29 monthly and
   ₹199 yearly**, India only. The **₹399 lifetime was deliberately not
   created** and should not be — see "The gating model" below.

   The RevenueCat side was finished on **2026-09-06**: the Play products are
   attached to `$rc_monthly` and `$rc_annual` in the `default` offering.
   Creating them in the Play Console was never enough on its own — packages are
   attached per store, the three original products lived only in the Test
   Store, and the Play app therefore resolved an empty offering with no error
   anywhere. `$rc_lifetime` still holds only its Test Store product.

   **`docs/revenuecat.md` is the runbook**: it carries the prices and the three
   identifiers the app reads by exact string (`otc_learn_pro`, the _current_
   offering, the `goog_` key) — a typo in any of which fails silently, leaving
   the app behaving as a free app.

6. ~~Build the paywall.~~ **Done, 2026-09-01.** The rules in `utils/access.ts`
   now have a screen and every locked surface consumes them: the home grid,
   both product lists, the product page, the lesson, and the exam scopes. Two
   things worth knowing about it —

   - **What now decides whether anyone sees it is the key and the offering.**
     `paywallApplies` needs four things true. The fourth — the catalogue holding
     an asset class marked `premium` — was the binding one from 2026-09-06 and
     was satisfied by Exotics on 2026-09-08, so a build with the `goog_` key and
     a live offering locks that class for a new install. See "The gating model"
     below.
   - **No price is written anywhere in the repo.** They come from Play, per
     country, through `getOfferings`, and the annual saving is computed from
     the two figures the store returns. Setting price points in the Play
     Console is the only place they get decided.

`react-native-purchases-ui` was added on 2026-09-01 for the Customer Center, so
**the next release is a store build rather than an `eas update`** — as the
billing dependency already required.

**When the RevenueCat key is set, three things stop being true** and have to
move in the same release:

- `docs/privacy.md` says "**No version has anything to buy yet**". Correct it;
  the rest of its Purchases section is already accurate.
- `STORE_LISTING.md`'s content-rating answers say the app has no purchases.
  With a subscription live that answer changes, and the rating questionnaire
  has to be re-submitted.
- Play's Data safety form needs "Purchases" declared for what RevenueCat
  receives.

**The Play service account is done and working, 2026-09-01** — RevenueCat
reports "Valid credentials" and the Play Developer API honours the service
account on all three capabilities it needs. Details and the three misleading
error codes are in `docs/revenuecat.md`.

**The Cloud half, for reference:** — project
`otc-learn-play`, service account
`otc-learn-revenuecat@otc-learn-play.iam.gserviceaccount.com`, the three APIs
enabled and the key at `~/.config/otc-learn/play-service-account.json`. What
remains is inviting that email into the Play Console and uploading the key to
RevenueCat; see `docs/revenuecat.md`. Doing this early matters because the
credentials take **up to 36 hours** to reach the Play Developer API, and none
of it waits on BillDesk. The same key is what lets `eas submit` replace the
manual AAB upload.

Also offered in the console and worth taking: enrolment for the **15% service
fee** rather than the default 30%.

Also read while confirming this: subscription settings are enabled, real-time
developer notifications are **not** configured (no Pub/Sub topic set), and the
base64 licensing public key is available in Monetisation setup when it is needed.

### Store declarations, checked live on 2026-09-12

**Data safety is done and correct** — and this was the one genuinely
time-critical item, because publishing a Play product needs no new binary, so
nothing would have forced the form to be corrected afterwards. Read back from the
public Data safety page, it declares Device or other IDs, App activity (Other
actions), **Financial info (Purchase history)** and Personal info (Email
address), not shared, encrypted in transit, with a deletion route. That matches
`STORE_LISTING.md` exactly.

**Both declarations that were wrong are now set**, and both were Console-only —
there is no API for either.

1. ~~**Ads.**~~ Corrected 2026-09-12; App content → Actioned shows that date.
   The public store page still showed a "Contains ads" badge afterwards, which is
   propagation — re-check in a day. The badge was always wrong: no ad SDK, no ad
   code, no `AD_ID` in the merged manifest, and the description on that same page
   promises "no adverts, no advertising identifiers".

2. ~~**App access.**~~ **Now called "Sign-in details"** — the Console says so on
   the page. Set to **Yes, part of the app is restricted** on 2026-09-12, with an
   entry named "Premium asset classes (promo code, no account)": no username, no
   password, the full-access box ticked, and 462 characters of instructions
   handing the reviewer **`PLAYREVIEW`**. That is what the promo code work bought
   beyond the promotion itself — no demo account to build, no credentials in a
   form field.

   **Saved, not submitted.** It sits in Publishing overview until "Send for
   review" is pressed, so it can travel with the production promotion rather than
   as its own review round.

**The app signing fingerprint is confirmed.** Play App Signing → Classical key →
SHA-256 reads
`F4:FB:0F:1D:AC:1B:05:09:5F:5A:8B:89:9A:6B:67:FB:07:94:35:BF:BC:A8:C0:06:A5:E5:A6:FC:21:AC:02:AF`,
which is exactly what `assetlinks.json` serves. **App Links will verify.** Two
things noticed while reading it: the signing key was upgraded (a previous key is
listed, first used 29 Jul 2026, now at **0% install base**, so one fingerprint is
enough), and the upload key is a different certificate —
`74:2D:18:9F:…` — which is *not* the one App Links wants.

The page is now **Test and release → App integrity → "Go to Protected with
Play" → Play Store protection → Protect app signing key → Manage Play app
signing**. The fingerprints are copy buttons rather than text.

### The gating model

Settled **2026-09-06**, reversing what v1.2 first built.

**Everything the app has already shipped is free, permanently** — all 36
products across all six asset classes, plus exams, review, Insights, notes,
achievements and the glossary. A subscription buys the asset classes added
*after* the paywall. The first of them, Exotics, shipped on 8 Sept 2026.

The published pages follow the same line: `scripts/generate-site.js` writes a
full lesson for a free product and a **teaser** for a paid one — summary, step
titles and key terms, no lesson body and no worked example. The App Link still
resolves, which is why the page exists at all. Published figures are quoted as
free-versus-paid rather than as one total, because "42 products" reads as though
all of them were free.

The model it replaced held five of six asset classes back and left Interest Rate
open. It was wrong for a reason worth keeping written down, because it will look
like the obvious design again: **a content paywall over a finished catalogue
makes the subscriptions irrational.** Nothing renews if nothing is added, so
every rational buyer takes the cheapest one-off tier and recurring revenue
collapses. Exam mode, Insights and Notes were already built and unlocked; new
asset classes are the only thing that makes a renewal make sense.

Implementation: `Category.premium` is a **required** field, so a new asset class
cannot be added without someone deciding which side of the line it falls on. The
six that shipped before the paywall are `premium: false` and must stay that way —
flipping one takes back something people already have. `utils/access.ts` holds
the rule, and gained a fourth guard alongside the existing three: **never sell
what does not exist.**

**Exotics is the first paid asset class, shipped 8 Sept 2026** — digital,
barrier, range accrual, accumulator, target redemption forward and cliquet, six
products and 72 questions built out of the free catalogue rather than carved out
of it. The fourth guard now passes, so **the paywall is live** on any build that
has the RevenueCat key and an offering; without either, the first two guards keep
it inert exactly as before.

Three consequences:

- **The paywall is no longer inert, and the tests that said so have changed.**
  `__tests__/utils/accessShippedCatalogue.test.ts` now guards the promise rather
  than the emptiness: the six free classes are a literal list, not a filter over
  `premium`, so a diff there means a shipped class has been moved behind the
  paywall. Three suites that mocked a fake premium class use the real one now.
- **₹399 lifetime is now the dangerous tier.** Under a content pipeline it sells
  every future asset class forever for under fourteen months of monthly, and
  Play never revokes a product from someone who has bought it. Monthly and
  yearly are safe under either model. Do not create it without settling this.
- **Grandfathering is a larger promise than it was.** It used to stop asset
  classes being taken back; now that nothing is taken from anybody, it means the
  ~21 existing installs get the future paid asset classes free as well,
  permanently. The shipped build already told them so in as many words.

~~**Still to do off the back of it:** the content rating questionnaire.~~
**Re-submitted 6 Sept 2026**, and the ratings came back issued at the lowest
band on every board — ESRB Everyone, PEGI 3, USK 0, ClassInd L, IARC 3+. So
declaring digital purchases did not raise the rating, which is what the
reasoning in `STORE_LISTING.md` predicted.

Read from the Console the same day: **App content → "Need attention" is
empty** — ten actioned declarations, and Policy status reports no issues.
**Data safety** is among them, last edited 2 Sept, showing four data types and
the account-deletion URL resolving; the worry that it might be submitted but
not accepted was unfounded.

Worth keeping: there is no `androidpublisher` endpoint for content ratings —
Data safety has one (POST only), ratings do not. It is Console-only, needs no
binary, and the page is **Monitor and improve → Policy and programmes → App
content** (not under Test and release, and the `app-content` deep link bounces
to the app list).

### Growth surfaces (2026-09-06)

Five things gated the marketing push, and four of them were app-side here. All
four are built and **merged to `main` (`53acac2`, pushed)**:

- **An in-app review prompt.** Zero ratings is what caps a listing's ranking,
  and there was no `StoreReview` call anywhere. It now fires from the results
  screen when a sitting carries a product over the mastery threshold, at most
  once every 120 days, and the stamp is spent only when the request actually
  reached the OS. `expo-store-review` is native, so **this needs a store build**
  — the release already needed one for `react-native-purchases-ui`.
- **A share action**, on the product page and the results screen. It sends the
  Play listing rather than a page about the product, because until today the
  site had no product pages.
- **Cross-promotion.** Neither app has ever mentioned the other, which was the
  most qualified traffic either could send. Profile now carries a "More from
  us" card for `io.cornerstone.study`, naming the exams descriptively and
  claiming no endorsement.
- **Android App Links.** `app.json` claims `/OTC_Learn/category/…` and
  `/OTC_Learn/product/…` with `autoVerify`, the parser reads the https form,
  and `scripts/generate-site.js` publishes the 42 pages behind them so a
  claimed address resolves for a reader without the app.

The 42 pages are live: every claimed address was checked against the published
site and returns 200.

**The Digital Asset Links statement is live too**, from the user-site repo
`singhalsachin2003.github.io` created for it — the statement has to be fetched
from the **host root**, which a project Pages site cannot serve. Google's own
`statements:list` endpoint parses it back correctly.

**What is still outstanding on App Links, and it is not code:**

1. **The previous app signing key's SHA-256 is missing from the statement.** The
   key was upgraded on 29 Jul 2026 and the current one reads 0.0% install base,
   so every install in the field still runs the old certificate; with
   `minSdkVersion 28` some devices keep it through an update and will not
   verify. `sha256_cert_fingerprints` is an array — both belong in it.
2. **Nothing verifies until a build carries the intent filter.** versionCode 7
   predates it. `expo run:android` will not show you this locally either: it
   builds the existing `android/` directory and does not re-apply `app.json`, so
   the filter is simply absent and `dumpsys package` reports nothing.

The fifth item, Cornerstone's placeholder tab icons, is in the other repo and is
also done (branch `marketing-hooks`, unmerged, never run on a device).

### Verification gaps

1. **Most of this is now closed.** Verified on a Pixel 7 emulator on 2026-08-13:
   the home dashboard, category, product page, lesson, quiz (both question kinds,
   with option shuffling and feedback), review, glossary and profile.

   Closed on **2026-09-01**:

   - **The review queue across a real date change.** Six questions missed on
     1 September read "0 due · 6 in queue · next up tomorrow"; with the device
     clock moved to 2 September they read "6 due · review 6 questions".
   - **Permission revoked in system settings mid-life** — and it found a defect,
     since fixed. See "Housekeeping" below.
   - **The reminder is scheduled correctly**: `dumpsys alarm` shows an
     `RTC_WAKEUP` at exactly 19:30 against the `study-reminders` channel at
     importance 3, and refusing the permission leaves the toggle off with the
     row explaining why rather than claiming success.

   **Still open — and one of them cannot be closed on an emulator:**

   - **The reminder actually being delivered.** Scheduling is proven; firing is
     not. Moving the clock past the trigger does not deliver it: AlarmManager
     recomputes `whenElapsed` against a wall clock that does not follow
     `adb shell date`, so the alarm simply re-arms. Short of waiting six real
     hours, this needs a real device.
   - Haptics and the lesson swipe gesture, both of which need real hardware.
   - An `eas update` push, which needs a published build.
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

   **The v3→v4 grandfathering migration has now been, 2026-09-01**, which is the
   one that matters most: it protects the ~21 people already using the app. Run
   the way a real install upgrades, not simulated — the pre-paywall build
   (`22907d5`, schema v3) onto a wiped device, a quiz sat on **Credit Default
   Swap, deliberately a paid asset class**, to earn 23% mastery, then the
   current build launched over that data without clearing it.

   Mastery survived at 23% with its attempt history, the catalogue stayed open
   ("36 products to learn"), Credit Default Swap still opened its lesson, and
   the paywall screen read *"You were here before this app had a subscription,
   so all of it stays open to you — permanently, and at no cost."*

   What makes the test mean anything is Profile's Subscription row reading
   **"Full access"**. That string renders only when purchases *are* configured
   **and** the install is grandfathered, so it separates the guard working from
   the paywall merely being switched off — which is how this test would
   otherwise have passed for the wrong reason.

### Housekeeping

- ~~**The glossary renders all 216 terms eagerly.**~~ Fixed on 2026-08-31 by
  moving it to a `SectionList`. The flattened-rows shape existed only because
  `stickyHeaderIndices` on a `ScrollView` pins a header just when it is a
  sibling of its rows; a `SectionList` gives sticky headers and windowing
  together, so the workaround was no longer buying anything. Measured in the
  test renderer: **856ms with all 216 rows mounted, down to 428ms with 7**.

- **The reminder toggle lied after an out-of-app revocation.** Fixed
  2026-09-01, found by revoking `POST_NOTIFICATIONS` on a device and
  relaunching. `syncReminder` runs at launch to repair a mismatch, but a
  revoked permission is precisely what makes the repair fail, and its `false`
  return was discarded — so the row went on promising "a nudge at 7:30pm" that
  could never arrive.

  The first fix was wrong in an instructive way: it asked whether the reminder
  was still *scheduled*. Revoking permission leaves the schedule in place, so
  that check passed its unit tests and still said the wrong thing on a device.
  It asks `canNotify()` — the OS permission — now.

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
