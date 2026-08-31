---
title: Privacy Policy
permalink: /privacy/
---

# Privacy Policy for OTC Learn

**Last updated: 31 August 2026**

OTC Learn is an educational app about over-the-counter derivatives. This policy
describes what the app does and does not do with your information.

## Accounts are optional, and the app works without one

OTC Learn works with no account at all, which is how it has always worked and
how it still works if you never sign in. Everything below about what stays on
your device applies in full to an app you never sign into.

If you *choose* to create an account, we ask for an email address and a password
and nothing else — no phone number, location, contacts or photos. The account
exists for one purpose: so your progress survives reinstalling the app or
changing phone. You can sign out at any time, which leaves everything on your
device untouched, and there is still no way to contact other users.

The app asks for one permission, and only when you turn the feature on:
permission to show notifications, used for the optional daily study reminder.
That reminder is scheduled by your phone and shown by your phone — nothing is
sent to us, and there is no push service involved. Decline it, or turn it off in
the app or in system settings, and the app carries on working.

## What is stored on your device

The app saves the following locally, on your device only:

- **Your mastery score for each product**, along with how many attempts you have
  made and your best result, so your progress survives a restart.
- **Which questions you have answered right and wrong**, so quizzes can bring
  back what you have missed.
- **Your review queue** — the questions due to be resurfaced, and when.
- **Your daily streak**, as a count and the days you were active.
- **Your saved products and unlocked achievements.**
- **Your settings**, and **the name you type into your profile**, if you type one.
  You are not asked for it, it is not verified, and it is only used to say hello
  on the home screen.

**Without an account, this data never leaves your device.** It is not synced,
backed up to our servers, or shared with anyone, and uninstalling the app
deletes it.

**With an account, the same list is copied to our sync service** so it can be
restored on another device. Nothing extra is collected to do it — it is the
list above and your email address, and no more. It is stored with Supabase,
which processes it on our behalf; their privacy policy is at
<https://supabase.com/privacy>. Access is restricted so that only your own
account can read or write your rows.

You can delete the account and everything synced with it by emailing the
address at the bottom of this policy. Signing out alone does not delete it —
that is the point of it.

## Crash reporting

Version 1.1 has crash reporting switched off. The app does not send us error
reports, and we have no visibility into problems you encounter.

The app contains the Sentry crash-reporting library, but it is inert without a
configuration key, which version 1.1 does not ship. If a future version turns it
on, this policy and the app's Play Store Data safety section will be updated
before that version is released. Such a report would contain technical
information only — the error and where in the code it happened, the app version,
the device model and OS version — and never your progress, your streak, or a
personal identifier.

## Purchases

The app contains Google Play Billing, through RevenueCat, so that a paid feature
can be offered in future. **No version has anything to buy yet**, and until one
does, no purchase information exists and nothing is sent.

When there is something to buy, a purchase is made by Google Play, and Google —
not us — handles your payment details. We never see or store a card number.
RevenueCat records that a purchase happened, against an identifier of its own
that is not your name or email, so the app can tell whether you are entitled to
the feature. Their privacy policy is at <https://www.revenuecat.com/privacy>.

## Checking for updates

The app contacts Expo's update service (`u.expo.dev`) when it starts, to see
whether a corrected version of the app's code is available. That request
contains a random identifier generated when you install the app, the platform
name, and the app's version. It contains no personal information, is not linked
to you or to any account, and is not used for advertising, profiling or
analytics. The identifier changes if you reinstall the app.

Expo processes this on our behalf; their privacy policy is at
<https://expo.dev/privacy>.

Apart from this update check, an app with no account signed in makes no network
requests at all. Signing in adds requests to the sync service described above,
and only while you are signed in.

## Children

OTC Learn is intended for an adult, professional audience learning about
financial products. It is not directed at children, and it collects no
information from anyone, including children.

## Advertising and analytics

The app contains no advertising, no advertising identifiers, and no third-party
analytics or tracking of any kind. The update check described above is not
analytics: it asks one question — is there a newer version of the code — and
carries nothing about how you use the app. Neither the sync service nor the
purchase service is used to profile you or to advertise to you, and neither
receives anything about how you use the app beyond the progress list above.

## Changes to this policy

If this policy changes, the "last updated" date above will change with it. Any
change that affects what leaves your device will be reflected in the app's Play
Store Data safety section as well.

## Contact

Questions about this policy: email <singhalsachin2003@gmail.com>, or file an
issue at <https://github.com/singhalsachin2003/OTC_Learn/issues>.
