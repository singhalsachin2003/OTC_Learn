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

**Prices are not set here and are not in this repo.** They are set per country
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

## Turning it on

Set `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` as an EAS secret and rebuild —
`EXPO_PUBLIC_*` is inlined by Babel at build time, so this is a new build, not
an `eas update`.

Then, in the same release, three documents stop being true. They are listed in
`PRODUCTION_READINESS.md`: the privacy policy still says no version has anything
to buy, the store listing's content-rating answers say the app has no purchases,
and Play's Data safety form does not declare them.

## Checking it without a store

`src/utils/access.ts` and the screens are covered by tests, but the purchase
sheet itself cannot be exercised on an emulator — there is no Play Billing there
(`BILLING_UNAVAILABLE`). To see the paywall's locked states locally, put a junk
key in `.env` and reinstall; the memory note "Seeing the paywall on the
emulator" has the exact steps and the traps.
