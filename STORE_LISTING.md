# Play Console submission sheet

Ordered to match Play Console's own left-hand navigation, so you can work top to
bottom. Every dropdown answer is already decided; every text field is a block to
copy whole. Character counts in brackets are what the drafts actually use
against Play's limits.

The one section that deserves slow reading rather than copying is **Data
safety** — it is a binding declaration, and a wrong answer there is the main
enforcement risk in this submission.

---

## 1. Create app

Only reached once. Play does **not** ask for a package name here — it reads
`com.otclearn.app` from the first bundle you upload, and binds the listing to it
permanently.

| Field | Value |
| --- | --- |
| App name | `OTC Learn` |
| Default language | English (United Kingdom) — the copy is British-flavoured |
| App or game | App |
| Free or paid | Free — the download is free and paid access is bought inside the app, so this field stays Free. Play derives the "In-app purchases" label from the products themselves |
| Declarations | Tick both: developer programme policies, US export laws |

---

## 2. Store presence → Main store listing

### App name (30 max)

```
OTC Learn
```

[9]

### Short description (80 max)

```
Learn OTC derivatives one product at a time. Worked examples, quizzes, offline.
```

[79] — this is the line under the icon in search results, so it leads with the
subject, then how the learning works, then what makes it different.

**No count in it, deliberately.** It used to say "36 products", which was the
free catalogue and became misleading in both directions once a paid half
existed — understating the app and overstating what is free. A number in a
short description also has to be maintained forever; a sentence about how the
learning works does not.

### Full description (4000 max)

```
OTC Learn teaches the over-the-counter derivatives that sit behind institutional
finance — one product at a time, in lessons short enough to finish on a commute.

Thirty-six products across five asset classes, plus the market infrastructure
they all sit on:

• Interest Rate — Interest Rate Swap, Swaption, Forward Rate Agreement, Cap and Floor, Inflation Swap, Basis Swap
• FX — FX Forward, FX Option, FX Swap, Non-Deliverable Forward, Cross-Currency Swap, Risk Reversal
• Credit — Credit Default Swap, CDX Index, Total Return Swap, Credit-Linked Note, Asset Swap, Credit Index Option
• Equity — Equity Swap, OTC Equity Option, Variance Swap, Contract for Difference, Dividend Swap, Autocallable Note
• Commodity — Commodity Swap, Commodity Option, Commodity Forward, Crack Spread Swap, Weather Swap, Swing Option
• Market Foundations — Collateral and the CSA, Central Clearing, Valuation and Marking, The ISDA Architecture, XVA and Counterparty Risk, Execution and Reporting

Every product follows the same five-step arc: what it is, how it works, why it is
used, the key terms you will hear, and the risks to watch — plus a worked example
with real numbers, and a note on who actually trades it.

Then a quiz checks what stuck. Each product has a bank of twelve questions,
mixing true/false with multiple choice, and every sitting draws a different
paper — weighted toward the questions you have missed, with the options
reshuffled, so a retake tests the content rather than your memory of where the
answer sat. Every answer comes with an explanation, including the ones you get
right.

WHO IT IS FOR

Graduates heading into markets roles, professionals moving into a derivatives
desk from another part of the business, students covering financial instruments,
and anyone who has nodded along in a meeting about basis risk and wanted to
actually understand it.

OPTIONAL ACCOUNT, NO ADS, NO TRACKING

Everything works without an account — your progress and your day streak are
stored on your device. Sign in only if you want them to survive a reinstall or
follow you to a new phone; it is off until you ask for it. There are no adverts,
no advertising identifiers, and no analytics following you around.

WORKS OFFLINE

All 180 lesson steps, 216 key terms and 432 quiz questions in the free catalogue
ship inside the app. Use it on the underground, on a plane, or anywhere else with
no signal.

MORE BY SUBSCRIPTION, IF YOU WANT IT

Everything above is free and stays free. An optional subscription adds what came
after it: 30 products, 150 lesson steps and 360 questions across Exotics, Risk &
the Greeks, twelve Case Studies and Alternative Underlyings — barriers and
digitals, DV01 and the Greeks, Barings to Archegos, perpetual swaps to longevity.

It also adds a "Going deeper" section and a second question bank to every one of
the 36 free products, so a quiz draws from twenty-four questions instead of
twelve. What each free product shipped with stays free. You can read the app
without ever seeing a purchase screen.

TRACK WHAT YOU ACTUALLY KNOW

Progress is a mastery score per product, not a tick. It moves toward each quiz
result rather than replacing it, so one lucky run does not mark a product learned
and one bad morning does not undo weeks of work. Asset-class rings, a day streak
and a week strip show where you stand at a glance.

MISSED QUESTIONS COME BACK

Anything you get wrong joins a review queue and returns on a widening schedule —
tomorrow, then in four days, then in ten. Answer it correctly enough times and it
retires. An optional daily reminder nudges you at 7:30pm; it is off until you
turn it on.

Educational content only. Nothing in this app is financial advice, an offer to
trade, or a recommendation to buy or sell any instrument.
```

[~1750]

### Graphics

Play checks dimensions exactly and rejects anything off by a pixel.

| Play field | File | Spec |
| --- | --- | --- |
| App icon | `assets/icon-play-512.png` | 512×512 |
| Feature graphic | `assets/feature-graphic.png` | 1024×500 |
| Phone screenshots | `store-assets/screenshots/*.png` | 1080×2400 — **re-shot 2026-09-08**: home, category, product, lesson, quiz, quiz feedback, review, insights |
| Tablet screenshots | — | Optional; skip for v1.1 |
| Promo video | — | Optional; skip |

**Do not upload** `icon.png`, `adaptive-icon.png`, `splash.png` or
`favicon.png`. Those are compiled into the app; only `icon-play-512.png` is the
listing icon.

---

## 3. Store presence → Store settings

| Field | Value |
| --- | --- |
| App category | **Education** |
| Tags | From Play's fixed list — "Education" and "Reference" fit |
| Email address | `singhalsachin2003@gmail.com` |
| Phone | Leave blank (optional) |
| Website | `https://singhalsachin2003.github.io/OTC_Learn/` |
| External marketing | Leave off |

**Why Education rather than Finance.** Play applies extra scrutiny to finance
apps, and several markets require a declaration for anything touching trading or
investment. This app gives no advice, executes nothing and handles no money, so
Education is both the more accurate category and the one less likely to pull the
listing into a financial-services review. Keep the disclaimer in the app and in
the description either way.

---

## 4. App content

Play blocks the release until every item here is complete.

### Privacy policy

```
https://singhalsachin2003.github.io/OTC_Learn/privacy/
```

Verified live and rendering. Source is `docs/privacy.md` — edit and push to
update it; never paste policy text straight into the console.

### Sign-in details (formerly App access)

**Play renamed this declaration** — the Console says so on the page itself:
"This declaration was previously called 'App access'." It lives under Monitor
and improve → Policy and programmes → App content, on the **Actioned** tab once
it has been answered, not under "Need attention".

**Set on 2026-09-12 and saved**, answering **Yes** to "Is any part of your app
restricted?" — Play's own list of what counts includes "payments, such as
one-time products, memberships, subscriptions and/or access tiers" and "referral
codes", so the old answer of No was plainly false once the paywall existed.

The entry is named "Premium asset classes (promo code, no account)". Username and
password are **deliberately blank** — there is no account to demo, since buying
needs no sign-in — and the "provide full access to all the features and content,
including premium or paid content" box is ticked, which `PLAYREVIEW` does.

The free-text field is capped at **500 characters**; what was entered is 462:

```
Exotics, Risk and the Greeks, Case Studies and Alternative Underlyings need a
subscription, as does the "Going deeper" section on the free products.

To review them without paying: open Profile > Subscription > "Have a promo
code?", enter PLAYREVIEW and tap Redeem. That opens every asset class for 90
days. No payment is taken and no subscription is created.

Everything else is free and needs no account: 36 products, every quiz, the exam
and the review queue.
```

Plain `>` rather than arrows: the field is typed into, and non-ASCII characters
are a needless way for a reviewer's copy of the instructions to arrive mangled.

**Saved, not submitted.** Play stages this in Publishing overview — it only
reaches Google when "Send for review" is pressed there, which is also what makes
it a sensible thing to bundle with promoting a release rather than a separate
review round.

The code is `PLAYREVIEW` in `src/data/promoCodes.ts`. Keep the two in step: if
that entry is ever retired, this declaration stops working and the next
submission stalls on a reviewer who cannot reach the paid content. It is
redeemable until 2027-12-31 for exactly this reason — a code that expired between
two submissions would fail a release at the worst possible moment.

### Ads

**No, my app does not contain ads.**

**Corrected in the Console on 2026-09-12** — the Ads declaration now shows that
date under App content → Actioned. The public store page still carried the
"Contains ads" badge afterwards, which is propagation rather than a failed save;
the badge was wrong because:
there is no ad SDK in `package.json`, no ad code in `src/`, no `AD_ID`
permission in the merged release manifest, and the full description on that same
page promises "no adverts, no advertising identifiers, and no analytics
following you around". A listing that contradicts itself is the kind of thing
that costs a review, and the badge suppresses installs for nothing in return.

There is no API for this declaration; it is a Console answer, under
App content → Ads. **Re-check the public listing in a day** — if the badge is
still there, the save did not take.

### Content ratings

The live questionnaire was last edited **29 July 2026** and still answers that
the app has no purchases. That was true then and is not now, so it has to be
re-submitted. Re-submitting is free, needs no new binary, and takes effect
within minutes.

| Step | Answer |
| --- | --- |
| Email | `singhalsachin2003@gmail.com` |
| Category | Reference, News, or Educational |
| Violence, sexuality, profanity, drugs, gambling, horror | **No** to all |
| **Does the app allow users to purchase digital goods?** | **Yes** |
| Are purchases randomised (loot boxes)? | **No** |
| Do users interact or exchange content with each other? | **No** |
| Is user-generated content shared with other users? | **No** |
| Is the user's location shared with other users? | **No** |

Expected result: Everyone / PEGI 3. Declaring purchases does not raise the
rating; it is a disclosure, not content.

**Why Yes on purchases.** The subscription `otc_learn_pro` is live in the
Console with two active base plans, and since Exotics shipped there is a premium
asset class for it to sell, so the paywall is live rather than inert. This answer
was already Yes while the paywall was inert, on the reasoning that the rating
describes the app rather than one build; that reasoning is now moot, and the
answer is simply correct.

**Why No on interaction and user-generated content, despite the share action.**
The share sheet sends a fixed line of text and a store link out to whatever app
the reader picks. Nobody exchanges anything with another user inside this app,
there is no content anyone can author for others to see, and the account exists
only to sync one person's own progress between their own devices. The question
is about social features, and there are none.

**There is no API for this.** `androidpublisher` exposes listings, tracks,
bundles and Data safety, but not content ratings — the questionnaire is Console
only. It lives on the **App content** page.

### Target audience and content

| Field | Value |
| --- | --- |
| Target age groups | **18 and over** only |
| Appeals to children | No |

Selecting any under-13 band pulls the app into the Families policy programme,
with extra design and disclosure requirements it does not need. The content is
aimed at graduates and professionals.

### News apps

**No**, this is not a news app.

### Data safety

Read each question rather than copying blindly. **These answers are for v1.2 and
differ materially from v1.1**, which declared Device or other IDs and nothing
else. v1.2 is the first build in which Supabase and RevenueCat are actually
configured, so two data types go live that were previously dark code.

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** |
| Collected or shared? | Collected, **not** shared, for every type below |
| Processed ephemerally? | No |
| Is all user data encrypted in transit? | Yes |
| Can users request data deletion? | Yes — via the contact email |
| Privacy policy URL | as above |

| Data type | Required? | Purpose | Why |
| --- | --- | --- | --- |
| **Device or other IDs** | Required | App functionality | The `u.expo.dev` update check, plus the anonymous identifier RevenueCat mints |
| **Email address** | **Optional** | App functionality, Account management | Only when the user creates an account; the app is fully usable without one |
| **App activity** — progress | **Optional** | App functionality | Mastery scores and the review queue, synced only while signed in |
| **Purchases** | **Optional** | App functionality | Whether this device has paid access |

**Verified live on 2026-09-12** — read back from the public store page's Data
safety section (`play.google.com/store/apps/datasafety?id=com.otclearn.app`),
which is what a user actually sees. All four types are declared and the wording
matches this table:

| Declared live | Play's label |
| --- | --- |
| Device or other IDs | Device or other IDs |
| App activity | Other actions |
| **Financial info** | **Purchase history** — this is the Purchases row below |
| Personal info | Email address |

with "no data shared with third parties", "data is encrypted in transit" and
"you can request that data be deleted". **So the form is done, and done before
the products went live** — which was the trap this section was written to avoid.

Mark the last three **optional** — an account is genuinely optional, and so is
buying. Confirm the exact option labels in the Console against this list rather
than assuming: Play's taxonomy wording for the progress and purchase types is
easy to mismatch, and the form is what gets enforced.

**Why "Device or other IDs".** The app contacts `u.expo.dev` on every launch to
check for an over-the-air update, and that request carries an install-scoped
UUID plus platform and runtime version. Play's definition of that data type
covers app-scoped identifiers, and the ephemeral-processing exemption does not
apply because Expo's servers receive and retain it.

**What is deliberately not declared.** Android auto-backup is off
(`android.allowBackup: false`), so nothing reaches Drive. For a user who never
signs in, progress and the day streak still never leave the device — but that is
now a property of *not signing in* rather than of the app, which is why the
progress row above exists and is marked optional.

**This changes if crash reporting is switched on.** A build carrying a Sentry
DSN also collects **Crash logs** (App activity and performance) — update this
form before releasing such a build.

### Government apps

**No.**

### Financial features

**My app doesn't have any financial features.** The app teaches; it does not
trade, lend, transfer money, or handle crypto.

### Health

**No** health features.

### Advertising ID

**No, my app does not use advertising ID.** Verified — the merged release
manifest declares only `INTERNET`, `ACCESS_NETWORK_STATE` and an internal
AndroidX receiver permission. There is no `AD_ID` permission.

---

## 5. Test and release → Production

1. **Create new release.**
2. **App bundle:** upload the `.aab` from the EAS production build
   (`npm run build:android`, then download from the EAS dashboard).
3. **Release name:** leave Play's default — it uses the version code.
4. **Release notes** (500 max), read by `npm run promote` from the fenced block
   directly below the sentence marker — so the text here is the text that ships,
   and the count here is the count that is enforced. **Keep the marker
   version-free**: Cornerstone's said "the v1.1 text" and stopped matching on
   the first release that was not v1.1.

The current text, at 438:

```
Dark mode. Profile → Appearance offers System, Light or Dark; System follows your phone, so it dims in the evening on its own.

Also new:
• Delete your account, and everything backed up under it, from Profile → Account
• The subscription is now priced for 173 countries — outside India it could not be bought at all before
• Category labels and badges read more clearly, in both themes
• A faster engine, with the memory fix from upstream
```

### Superseded: the 1.2.0 text, at 464

```
• Four new asset classes — Exotics, Risk & the Greeks, twelve Case Studies and Alternative Underlyings: 30 more products
• Going deeper on all 36 original products — 108 new sections, and a second 12-question bank in each
• An optional account, so progress survives a reinstall or a new phone
• Share a product or a result, and open a lesson straight from a link
• Already using OTC Learn? All of it stays free for you, permanently — the new asset classes included
```

**These describe the change, not the catalogue** — which is the opposite of what
this section used to hold. Release notes are read by people who already have the
app and are being offered an update, and the previous version told them what the
app contains, which they know.

**The last line is the one that must not be dropped.** Every install that
predates the paywall is grandfathered permanently, the new asset classes
included — `migrateGrandfathering` in `utils/storage.ts` sets it for any install
with a stored schema version. Without that line, an update that adds a
subscription reads as the app going paid, to exactly the people who have been
using it for free and will say so in a review.

Derive the figures from `src/data/products.ts` rather than editing them by hand:
66 products, 36 free and 30 paid, 108 depth sections and 432 depth questions,
all counted from the catalogue on 2026-09-12. `README.md` carries overlapping
totals and they have drifted apart before.

**Internal track:** Play asks for the same field on an internal release. Use
these notes there too rather than leaving it blank, so what promotes to
production is what was reviewed.

5. **Countries and regions:** all, unless you want to limit the first release.
6. **Rollout:** consider a staged rollout rather than 100%. With no installs yet
   it makes little practical difference, but it leaves a halt option if the
   first real-device reports are bad.

---

## Before you hit submit

- Privacy policy URL opens in a browser — Play rejects an unreachable link.
- The AAB you uploaded is the **production** profile build, not the preview APK.
- Data safety answers match the build you actually uploaded, in particular
  whether it carries a Sentry DSN, and whether RevenueCat and Supabase are
  configured in it — v1.2 is the first build where both are.
- Data safety declares **Purchases** before the Play products are created. That
  step needs no new binary, so nothing else will force the form to be corrected.
- Screenshots show current content — recapture with
  `scripts/capture-screenshots.sh` if the UI or catalogue changes.

---

## Custom store listing — "Keywords"

**It already existed.** Live since 17 August 2026, reference name `Keywords`,
targeting **500 search keywords across 176 countries** at 100% rollout, no end
date. Nothing in this repo mentioned it, which is how a plan to "create a custom
store listing" got as far as the Console before hitting the create form and
finding one already there. Check Grow users → Store presence → Store listings
before drafting another.

Five hundred keywords is Play's per-listing maximum. Whoever built it went wide
rather than narrow, and that is a defensible strategy — nothing here proposes
trimming it.

### Console app ID

**`4973361652578894415`** — OTC Learn. Cornerstone's, for comparison, is
`4973277887599855563`; the two are close enough to misread, so copy rather than
retype. The store listings page is:

```
play.google.com/console/u/1/developers/8996095320563569647/app/4973361652578894415/store-listings
```

Written down because getting it cost an afternoon on 26 September. The app-list
page is the only route to it in the Console UI, that page failed to load through
a network outage, and no Play API exposes the Console's numeric app ID — the
Publisher API keys off `com.otclearn.app` instead. With the ID here, every app
page can be reached directly and the app list never has to load again.

### What was wrong with it, and what was fixed on 27 September 2026

**The copy was a frozen August snapshot, and it understated the app badly.** This
is the trap written up in Cornerstone's `docs/STORE_LISTING.md`: *a custom listing
is a copy, not an overlay*. The default listing was rewritten as the catalogue
grew; this one silently kept the old text for six weeks.

What it said, against what was true:

| | Custom listing (stale) | Default listing (current) |
| --- | --- | --- |
| Short description | `Learn OTC derivatives: 24 products, lessons and quizzes that adapt. Offline.` | no count, deliberately |
| Full description | "**Twenty** products across five asset classes" | "**Thirty-six** products … plus the market infrastructure they all sit on" |
| Length | 1,215 chars | 3,772 chars |
| Asset classes listed | five, four products each | six, six products each |
| Market Foundations | **absent entirely** | present |

The Market Foundations omission is the damaging one. That class is Collateral and
the CSA, Central Clearing, Valuation and Marking, The ISDA Architecture, XVA and
Counterparty Risk, and Execution and Reporting — and `isda`, `xva`, `collateral`
and `central clearing` are exactly the sort of terms in a 500-keyword list.
Someone searching "XVA" was shown a listing that never used the word.

The short description was independently wrong: its "24 products" is a number the
default listing deliberately removed, for the reason recorded above — a count is
misleading in both directions once a paid half exists, and has to be maintained
forever.

**The fix.** Both fields replaced. Short description (71):

```
Interest rate swaps, CDS, FX options, XVA — worked examples and quizzes
```

Full description: the current default text verbatim, with one line prepended
(3,894 of 4,000 characters):

```
Interest Rate Swaps. Credit Default Swaps. FX Options. Collateral, clearing and XVA. Thirty-six products, one at a time.
```

Both name only free-catalogue content. Leading with Exotics or the Greeks would
put the app in front of someone who then hits a paywall on the thing they
searched for, which is how you earn a one-star review.

Keywords, countries, rollout and the AI asset declaration were left untouched.
Submitted for review 27 September 2026; two changes, short and full description.

**When the default listing changes, change this one in the same sitting.** That
is the whole lesson of the six weeks above.
