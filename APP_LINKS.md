# Android App Links

A custom scheme is dead everywhere it matters. `otclearn://product/irs` does
nothing in a browser, an email client or a social post, so until now every link
posted anywhere could only ever land on the store page — a lesson link was not
possible at all. App Links fix that: the same `https://` address opens the
lesson for a reader who has the app and the web page for one who does not.

## What the repo now does

- `app.json` declares one `VIEW` intent filter with `autoVerify: true`,
  claiming `https://singhalsachin2003.github.io/OTC_Learn/category/…` and
  `/product/…`.
- `src/navigation/linking.ts` parses that form alongside `otclearn://`,
  tolerating the trailing slash Jekyll serves and any query string a share
  sheet appends. A test pins the parser and `app.json` to each other, because
  nothing in the build makes them agree.
- `scripts/generate-site.js` writes `docs/product/<id>.md` and
  `docs/category/<id>.md` from the catalogue — 36 and 6 pages. **Every claimed
  address has to resolve for the reader without the app**, so the claim and the
  pages have to move together. Re-run the script after any content change.

Only those two routes are claimed. `/privacy/` and `/account-deletion/` are
deliberately left to the website: swallowing them would turn the policy link on
the store listing into a dead end for anyone who has the app installed. The
`lesson` route is left out for the opposite reason — the website publishes no
lesson page, because the lesson is part of the product page there.

## What is still missing, and why it cannot be done from this repo

Verification needs a Digital Asset Links statement at the **host root**:

    https://singhalsachin2003.github.io/.well-known/assetlinks.json

Not under `/OTC_Learn/`. Android fetches the file from the origin, and a path
prefix in the intent filter does not move it. This repo publishes a *project*
Pages site, which can only ever serve `/OTC_Learn/…`, so the file cannot live
here. It needs the user-site repo — a public repo literally named
`singhalsachin2003.github.io`, which does not exist yet — with the file at
`.well-known/assetlinks.json` in its Pages source.

The statement itself, once the fingerprint below is in hand:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.otclearn.app",
      "sha256_cert_fingerprints": ["<PLAY APP SIGNING SHA-256>"]
    }
  }
]
```

**The fingerprint is the Play *app signing* key, not the upload key.** Play
re-signs every release, so the certificate a device sees is Google's, and the
one in the AAB you built is not it. `keytool -printcert -jarfile app.aab` gives
the wrong answer confidently. Read it from Play Console → Test and release →
App integrity → App signing → *SHA-256 certificate fingerprint*; the same page
offers the whole JSON above pre-filled. There is no `androidpublisher` endpoint
that returns it.

Cornerstone needs its own statement, with its own package name and its own
fingerprint. Two apps can share one file — the JSON is an array — if both are
ever served from the same host.

## One trap while checking this locally

**`expo run:android` does not re-apply `app.json`'s native config.** With an
`android/` directory already present it builds what is there, so a freshly added
intent filter is simply absent from the APK — and `dumpsys package` then reports
no filter at all, which reads exactly like a syntax error in `app.json`. Run
`npx expo prebuild -p android` first, then check the generated manifest:

```bash
grep -A 8 autoVerify android/app/src/main/AndroidManifest.xml
```

EAS builds prebuild from scratch every time, so this only bites locally. The
filter above was confirmed this way on 2026-09-06.

## Verifying it, once the file is up

Shipping the intent filter before the file is harmless: verification simply
fails and links keep opening in the browser, exactly as they do today. Nothing
regresses, which is why this half ships first.

After a build that carries the filter, on a device:

```bash
adb shell pm verify-app-links --re-verify com.otclearn.app
adb shell pm get-app-links com.otclearn.app     # want "verified"
adb shell am start -a android.intent.action.VIEW \
  -d https://singhalsachin2003.github.io/OTC_Learn/product/irs
```

`none` or `legacy_failure` against the domain means the file was not fetched or
did not match — check it is served as `application/json` over https with no
redirect. GitHub Pages serves `.well-known` fine; it is the *root* that is the
constraint, not the dot-directory.
