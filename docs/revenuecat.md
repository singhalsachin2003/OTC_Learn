# RevenueCat setup

What has to exist in the RevenueCat dashboard for the paywall to work, written
down because the app reads three identifiers **by exact string** and a typo in
any of them fails silently — the app carries on as a free app and nobody sees an
error.

The code is `src/utils/purchases.ts`; the rules it feeds are `src/utils/access.ts`.

## Nothing here is urgent, and the order does not matter

The paywall stays off until _all_ of these are true: a key is configured, the
Play product exists, and RevenueCat is serving an offering that contains it.
Miss any one and `paywallApplies` is false and the app behaves exactly as it
does today. That is deliberate — see "Never lock what cannot be bought" in
`access.ts`. So the account can be created now and finished whenever the Play
Console lets it be finished.

## Account

Created, and the project is configured. Confirmed 2026-09-01 by fetching
`/v1/subscribers/<id>/offerings` with the publishable key:

```
current_offering_id: default
  $rc_monthly   -> monthly
  $rc_annual    -> yearly
  $rc_lifetime  -> lifetime
```

That is the offering the app reads, and all three package slots are RevenueCat's
standard ones, so `periodOf` types them correctly without further work.

## Getting the `goog_` production key

The key supplied on 2026-09-01 was `test_…`, which is a **Test Store** key —
RevenueCat's sandbox. It serves offerings and is fine for wiring, but it cannot
transact through Google Play. Confirmed in the dashboard: the project's only app
is the Test Store one.

A `goog_` key is **generated automatically when a Google Play app configuration
is added to the project** — it is not requested or issued separately.

1. **Apps → New app configuration → Google Play Store**, package name
   `com.otclearn.app`. The key then appears under **API keys**. ✅ Done
   2026-09-01.
2. Give RevenueCat a **Play service account JSON** — **still outstanding as of
   2026-09-01**. Without it the app entry cannot verify a purchase server-side,
   so an entitlement will not be granted reliably even though Play takes the
   money. Nothing may be sold until this is done:
   - Google Cloud → enable the **Android Publisher API**, **Google Play
     Developer Reporting API** and **Pub/Sub API**.
   - IAM → create a service account with **Pub/Sub Editor** and **Monitoring
     Viewer**, and download its JSON key.
   - Play Console → **Users and permissions** → invite the service account's
     email and grant: view app information, view financial data, manage orders
     and subscriptions, manage store presence.
   - RevenueCat → **Project settings → Google Play App Settings** → upload the
     JSON. RevenueCat has a validator for checking it took.
3. **Allow up to 36 hours** for the credentials to propagate to the Play
   Developer API.

**Start this early.** None of it waits on BillDesk or on the AAB, and the 36-hour
propagation is the longest lead time in the whole billing setup. The same JSON
is what `eas submit` needs, so obtaining it once also makes the AAB upload
scriptable instead of manual.

**Setting the `goog_` key before the Play products exist is safe**, and this was
measured rather than assumed. The same offering, fetched with each key on
2026-09-01:

```
test_… -> offering "default", 3 packages (monthly, yearly, lifetime)
goog_… -> offering "default", packages: []
```

So `availablePackages` is empty under Google Play, `hasPurchasableOffer` is
false, and the paywall stays off — the third guard in `access.ts`, doing exactly
what it is for.

**The reason it is empty is worth knowing: packages are attached per store.**
The three products live in the **Test Store**, not in the Google Play app. When
the Play products are eventually created they have to be attached to the same
packages in the RevenueCat product catalogue for the Play app — creating them in
the Play Console alone will not populate this offering.

### Which key to run locally

`.env` holds the `goog_` key with the `test_` one commented out beneath it. Swap
to `test_` when you want to **see** the paywall on a device: the Test Store has
the packages, so offers render and the locked states appear. With `goog_` the
app is, correctly, indistinguishable from a free build.

## The three strings the app reads

| What                   | Value                          | Read at                              |
| ---------------------- | ------------------------------ | ------------------------------------ |
| Entitlement identifier | `otc_learn_pro`                | `PREMIUM_ENTITLEMENT_ID`             |
| Offering               | `default` (marked **current**) | `offerings.current`                  |
| Android SDK key        | `goog_…`                       | `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` |

- **The entitlement must be called `otc_learn_pro`.** This is the one value
  above that the offerings endpoint cannot confirm — entitlements are only
  visible against a subscriber who holds one. If it is wrong, a purchase
  succeeds, grants nothing, and `purchaseOffer` reports that the purchase did
  not complete. Worth checking in the dashboard before the first real sale.
- **The offering must be set as `current`.** The app reads only
  `offerings.current`; an offering that exists but is not current is invisible
  to it, and the app reads that as "nothing on sale" and unlocks everything.
- **Both products must be attached to the `premium` entitlement**, or a
  successful purchase grants nothing and `purchaseOffer` reports that the
  purchase did not complete.

## Packages

Two, in the current offering:

| Package        | Product    | Type       | Shown as                                           |
| -------------- | ---------- | ---------- | -------------------------------------------------- |
| `$rc_monthly`  | `monthly`  | `MONTHLY`  | "Monthly", _per month_                             |
| `$rc_annual`   | `yearly`   | `ANNUAL`   | "Annual", _per year_, with a computed saving badge |
| `$rc_lifetime` | `lifetime` | `LIFETIME` | "Lifetime", _once_, no saving badge                |

The **package type** matters, not the identifier — `periodOf` switches on
`PACKAGE_TYPE`. Anything it does not recognise renders as "Subscription" with
no period suffix and no saving badge, which is a safe but uninformative
fallback. The standard `$rc_*` slots all type correctly.

**Lifetime is a one-off, and the screen says different things about it**: no
"per month", no saving comparison, and the renew-until-cancelled small print is
suppressed unless a subscription is also on sale — it would be untrue of a
single payment. Note this cuts across the decision recorded on 2026-08-31 that
the product would be _"monthly and annual, not a one-time unlock"_; the
dashboard now has all three, and the app renders whatever the offering
contains.

## Prices

Chosen on **2026-09-01**, and set in the **Play Console** — not here, and not in
RevenueCat, which only reads what Play returns.

| Product    | India (INR) | Notes                                     |
| ---------- | ----------- | ----------------------------------------- |
| `monthly`  | ₹29         | base plan on the subscription             |
| `yearly`   | ₹199        | base plan; the paywall shows **SAVE 43%** |
| `lifetime` | ₹399        | one-time in-app product, does not renew   |

The 43% is computed at runtime from the two figures Play returns — 29 × 12 =
348, against 199 — so it stays correct per country and disappears if only one
term is on sale. `annualSavingPercent` is pinned to these numbers by a test, so
changing a price and quietly breaking the badge shows up as a failure.

Two things to weigh before entering them, both consequences of the ratios
rather than objections to the plan:

- **₹399 lifetime is 2.0× the annual and 13.8 months of the monthly.** Anyone
  who expects to stay much beyond a year is better off buying lifetime, so
  lifetime will be the common choice and revenue per user is effectively capped
  at ₹399. That is a fine outcome if the goal is reach; it is worth knowing it
  is the outcome.
- **These are the India prices.** Play will generate the other 176 countries by
  conversion unless each is set. ₹29 converts to roughly a third of a US dollar,
  which is likely below what the same content would sell for elsewhere — worth
  reviewing the auto-converted table rather than accepting it wholesale.

Prices cannot be entered yet: the Play Console will not create a product until
an uploaded binary declares `BILLING`, and nothing can be sold until BillDesk
merchant verification completes. Confirmed 2026-09-01 — the subscriptions route
in the Console still bounces back to the app list.

**Prices are not set in the app and are not in this repo.** They are set per country
in the Play Console; RevenueCat passes through Play's localised, tax-inclusive
`priceString`, which is what the paywall renders. The annual saving is computed
from the two prices at runtime, so it stays correct per country and disappears
if only one term is on sale.

## What blocks what

1. **A Play product must exist first**, and the Play Console refuses to create
   one until an uploaded binary declares `com.android.vending.BILLING` — and
   nothing can be _sold_ until BillDesk merchant verification completes. See
   `PRODUCTION_READINESS.md`.
2. **Linking Play to RevenueCat needs a Google Play service account JSON** with
   access to the Play Developer API. Worth doing once and keeping: `eas submit`
   needs the same credential, which is why the AAB upload is currently manual.
   It is a **server credential** — it must never go in this repo or in a build.
3. The **Android SDK key is publishable.** It identifies the app to RevenueCat
   and grants nothing on its own, so shipping it in the bundle is expected. The
   `sk_` secret key is not, and must never appear here.

## Customer Center

`react-native-purchases-ui` is installed, pinned to the **exact** version of
`react-native-purchases` — the two are a matched pair and a drift between them
is a native crash, not a type error. It deduped against the existing install, so
there is still only one copy of the native SDK.

Profile's **Subscription** row leads to RevenueCat's Customer Center for anyone
holding the entitlement, and to the paywall for everyone else. A subscriber
wants to manage what they have, not be sold it again — and the cancellation and
refund wording has to track store policy, which is a poor thing to hand-write.

It has to be **configured in the RevenueCat dashboard** before it will open, and
nothing in the app can check whether it has been. `presentCustomerCenter`
returns whether it opened and the row falls back to the paywall when it did not,
so an unconfigured dashboard is a slightly wrong destination rather than a dead
control.

This is a native module: it reaches users in a **store build**, not an
`eas update`.

## Turning it on

Set `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` as an EAS secret and rebuild —
`EXPO_PUBLIC_*` is inlined by Babel at build time, so this is a new build, not
an `eas update`.

Then, in the same release, three documents stop being true. They are listed in
`PRODUCTION_READINESS.md`: the privacy policy still says no version has anything
to buy, the store listing's content-rating answers say the app has no purchases,
and Play's Data safety form does not declare them.

## Verified end to end, 2026-09-01

Against the Test Store on a Pixel 7 emulator, with `react-native-purchases-ui`
in the build. The Test Store's purchase dialog offers **TEST VALID PURCHASE**,
**TEST FAILED PURCHASE** and **CANCEL**, which is all three branches the code
has:

- **Cancel** — silent. No error, no message, nothing said about a decision the
  reader made deliberately.
- **Failed** — shows the store's own message, passed through rather than
  rewritten.
- **Valid** — entitlement granted, the paywall flips to "You are subscribed",
  the catalogue unlocks, and Profile's Subscription row reads **Active** and
  opens the Customer Center.

**This is what confirmed `otc_learn_pro` is right.** It is the one identifier
the offerings endpoint cannot show, and a wrong value fails silently — a real
purchase granting the entitlement and the app seeing it is the only proof
available short of selling something.

Two things to fix in the dashboard before this ships:

1. **The Customer Center does not look like this app.** It renders in
   RevenueCat's default light-purple theme against a cream and near-black
   palette. Its appearance is dashboard-configurable; nothing in the repo
   changes it.
2. **No cancel or manage option appeared**, only "Restore past purchases" —
   expected of a Test Store subscription, which has nothing to manage. Worth
   re-checking against a real Play subscription rather than assuming it
   appears.

## Checking it without a store

`src/utils/access.ts` and the screens are covered by tests, but the purchase
sheet itself cannot be exercised on an emulator — there is no Play Billing there
(`BILLING_UNAVAILABLE`). To see the paywall's locked states locally, put a junk
key in `.env` and reinstall; the memory note "Seeing the paywall on the
emulator" has the exact steps and the traps.
