# Complete Android Deployment Guide - From Testing to Launch

## Timeline: Android to Live App
- **Today (Phase 1-3):** Test on Android + Run tests (1-2 hours)
- **Today/Tomorrow (Phase 4-5):** Build production APK + Create Play Console app (1 hour)
- **Day 2 (Phase 6-7):** Setup metadata + screenshots (1 hour)
- **Day 3 (Phase 8):** Submit for review (15 minutes)
- **Day 3-4 (Phase 9):** Google reviews (2-4 hours, automatic)
- **Day 4:** **App goes LIVE** ✅

**Total: 2-3 days from today to LIVE on Google Play**

---

## Phase 1: Test App on Android Emulator (30 Minutes)

### Step 1.1: Launch Android Emulator

```bash
cd otc-learning-app

# Start development server
npm start

# In another terminal, launch Android emulator
npm run android
```

**Wait for app to load on Android emulator (takes 30-60 seconds)**

### Step 1.2: Verify All Features Work

**Checklist - Test these on Android:**

**Home Screen:**
- [ ] App launches without crashing
- [ ] Title "OTC Learn" displays
- [ ] Streak badge shows (e.g., "4 DAYS")
- [ ] Progress bar shows (e.g., "0/10" or similar)
- [ ] 5 category cards visible (IR, FX, Credit, Equity, Commodity)
- [ ] Colors look correct

**Navigation:**
- [ ] Tap "Interest Rate" category → CategoryScreen loads
- [ ] Verify category name and description display
- [ ] See product list (e.g., "Swaps", "Swaptions")

**Lesson:**
- [ ] Tap a product (e.g., "Swaps") → LessonScreen loads
- [ ] See "STEP 1 OF 3" indicator
- [ ] See step title and content
- [ ] "Next" button works → goes to Step 2
- [ ] "Next" button works → goes to Step 3
- [ ] "Take the quiz →" button visible on Step 3
- [ ] Tap it → QuizScreen loads

**Quiz:**
- [ ] See "Question 1 of 3"
- [ ] See question text
- [ ] "True" button (green) is clickable
- [ ] "False" button (red) is clickable
- [ ] Tap True/False → feedback appears (green box for correct, red for incorrect)
- [ ] See explanation text
- [ ] "Next question" button appears
- [ ] Tap it → goes to Question 2
- [ ] Tap True/False → feedback appears
- [ ] Tap "Next question" → goes to Question 3
- [ ] Tap True/False → feedback appears
- [ ] "See results →" button appears
- [ ] Tap it → QuizResultsScreen loads

**Results:**
- [ ] See score (e.g., "You scored 2/3")
- [ ] See badge with star (★) or checkmark (✓)
- [ ] "Retry quiz" button works
- [ ] "Back to Interest Rate" button works

**Data Persistence:**
- [ ] Complete quiz (answer all 3 questions)
- [ ] Go back to HomeScreen
- [ ] Verify product shows checkmark in category
- [ ] Verify progress updated (e.g., "0/10" → "1/10")
- [ ] Force close app (or swipe up in Android)
- [ ] Reopen app (tap OTC Learn icon)
- [ ] Verify product still shows checkmark ✅
- [ ] Verify progress count still shows updated number ✅

---

### Step 1.3: If Tests Fail

**App crashes on startup:**
```bash
# Check logs
npm start
# Look for errors in terminal

# Common fixes:
# 1. Restart emulator
npm run android

# 2. Clear cache
npm start -- --reset-cache

# 3. Rebuild
rm -rf node_modules
npm install
npm run android
```

**Data doesn't persist:**
```bash
# This is critical - must work before deployment
# Verify AsyncStorage is working:
npm run test  # Run tests to check storage functionality

# If tests pass but data still doesn't persist:
# Check that you tapped "Back to [Category]" (not just navigating)
```

---

## Phase 2: Run All Tests (15 Minutes)

```bash
npm run test

# Expected output:
# PASS __tests__/store/appSlice.test.ts
# PASS __tests__/store/progressSlice.test.ts
# PASS __tests__/store/quizSlice.test.ts
# PASS __tests__/store/streakSlice.test.ts
# PASS __tests__/components/Button.test.tsx
# ...
# Test Suites: X passed, X total
```

**If tests fail:**
```bash
# Rerun with more details
npm run test -- --verbose

# Fix errors shown
# Rerun:
npm run test
```

**If all tests pass:** ✅ Continue to Phase 3

---

## Phase 3: Type Check & Lint (10 Minutes)

```bash
# Check TypeScript errors
npm run type-check
# Should show: "0 errors"

# Check code quality
npm run lint
# Should show: "0 warnings"
```

**If errors:**
```bash
# Fix errors shown in terminal
# Rerun:
npm run type-check
npm run lint
```

---

## Phase 4: Install Google Play Signing Key (5 Minutes)

### Step 4.1: Create Keystore (One-time Setup)

```bash
# Navigate to android folder
cd android/app

# Create keystore (press Enter for all prompts, remember password)
keytool -genkey -v -keystore otc-learning-app.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias otclearn

# When prompted:
# Enter password: (create strong password, e.g., MySecurePass123!)
# Confirm password: (same)
# First and last name: Your Name
# Organizational unit: Mobile
# Organization: OTC Learn
# City/Locality: Your City
# State/Province: Your State
# Country code: US (2-letter code)
```

**Result:** `otc-learning-app.keystore` file created in `android/app/`

### Step 4.2: Update gradle.properties

```bash
# Edit android/gradle.properties file
# Add these lines at the end:

MYAPP_RELEASE_STORE_FILE=otc-learning-app.keystore
MYAPP_RELEASE_STORE_PASSWORD=MySecurePass123!
MYAPP_RELEASE_KEY_ALIAS=otclearn
MYAPP_RELEASE_KEY_PASSWORD=MySecurePass123!
```

**Replace "MySecurePass123!" with your actual password from Step 4.1**

### Step 4.3: Verify Keystore

```bash
# Go back to project root
cd ../..

# Verify keystore file exists
ls -la android/app/otc-learning-app.keystore
# Should show the file
```

---

## Phase 5: Build Production APK/AAB (30 Minutes)

### Step 5.1: Build Production App Bundle (Recommended for Google Play)

```bash
npm run build:android

# This will:
# - Compile app for Android
# - Sign with your keystore
# - Create AAB (Android App Bundle)
# - Upload to EAS servers
# Takes: 10-15 minutes

# When done, you'll see:
# "Build successful!"
```

### Step 5.2: Download or Note Build ID

**Option A: Get Build ID**
```bash
eas build:list

# Shows:
# Platform  ID                Status
# android   xxxxxxxx-xxxx...  finished
```

**Note the build ID - you'll need it!**

**Option B: Download AAB**
```bash
# Check email or EAS dashboard
# Download .aab file
# Save securely (you'll need for Play Store)
```

---

## Phase 6: Create Google Play Developer Account (5 Minutes)

### Step 6.1: Go to Google Play Console

```
Go to: https://play.google.com/console
Log in with Google account
```

### Step 6.2: Create Developer Account

1. Click **"Create account"** (if first time)
2. Pay **$25 one-time fee** (one-time, not yearly like Apple)
3. Accept terms
4. Developer account created! ✅

**You now have a Google Play Developer Account**

---

## Phase 7: Create App in Play Console (30 Minutes)

### Step 7.1: Create New App

1. In Google Play Console, click **"Create app"**
2. Fill in:
   ```
   App name: OTC Learn
   Default language: English
   App or game: App
   Free or Paid: Free
   Category: Finance (or Education)
   Content type: Application
   ```
3. Click **"Create app"**

### Step 7.2: Fill Basic Information

1. Go to **"Store listing"** (left sidebar)

2. **Title, short description and full description: copy them from
   `STORE_LISTING.md`.** That file is the single source for listing copy, with
   character counts against Play's limits.

   The text that used to live here described 10 products, 3-step lessons and
   3-question quizzes. The catalogue doubled to 20 products with 5-step lessons
   and 5-question quizzes, so pasting it would have misdescribed the app on its
   own store page. Keep the copy in one place so it cannot drift again.

3. **Support email:**
   ```
   singhalsachin2003@gmail.com
   ```

8. **Support website:** optional — the GitHub repo works if you want one:
   ```
   https://github.com/singhalsachin2003/OTC_Learn
   ```

9. **Privacy policy:** required. Publish `docs/privacy.md` and paste its URL here.
   GitHub Pages off this repo is enough:
   ```
   https://singhalsachin2003.github.io/OTC_Learn/privacy
   ```
   Confirm the page is live before submitting — Play rejects an unreachable
   policy URL.

10. **Category:** Finance (or Education)

11. **Content rating:**
    - Click "Continue to content rating questionnaire"
    - Answer questions (all "No" for educational finance app)
    - Get rating: Everyone 3+
    - Save

12. Save all changes

### Step 7.2b: Data safety form (required)

**App content → Data safety.** Mandatory for every app, and the answers are
enforceable — a declaration that does not match the shipped build is one of the
most common causes of Play enforcement. For v1.1:

| Question | Answer |
| --- | --- |
| Does your app collect or share any of the required user data types? | **Yes** |
| Data type | **Device or other IDs** — nothing else |
| Collected or shared? | Collected, not shared |
| Required or optional? | Required |
| Purpose | App functionality |
| Is all user data encrypted in transit? | Yes |
| Do you provide a way for users to request data deletion? | Yes — the contact email |

Why "Device or other IDs" and not "no data collected": the app contacts
`u.expo.dev` on every launch to check for an OTA update, and that request
carries an install-scoped UUID along with the platform and runtime version.
Play's definition of that data type covers app-scoped identifiers, and the
ephemeral-processing exemption does not apply because Expo's servers receive and
retain it. Declaring it costs almost nothing on the listing and removes the only
real enforcement risk in this submission.

What is **not** declared, because it never leaves the device: mastery per
product, question history, the review queue, the day streak, saved products,
unlocked achievements, settings, and the name typed into the profile. Android
auto-backup is disabled (`android.allowBackup: false`), so none of it reaches
Google Drive either.

### These answers are wrong for v1.2 and must be redone before it ships

v1.2 adds optional accounts and progress sync, which moves most of that list
from "never leaves the device" to "collected, and only when the user signs in".
The declaration has to change with it, or it is exactly the mismatch this
section warns about:

| Question | v1.2 answer |
| --- | --- |
| Data types collected | **Device or other IDs** (as before) · **Email address** · **App activity** — the progress list above |
| Collected or shared? | Collected, not shared |
| Required or optional? | **Optional** — the app works fully without an account |
| Purpose | App functionality |
| Encrypted in transit? | Yes |
| Way to request deletion? | Yes — the contact email, which is what `docs/privacy.md` now promises |

**Purchases: the form has to change before a product exists, not before a
build.** v1.2 is the first build carrying a live RevenueCat key, so the app now
contacts RevenueCat at launch to ask whether the device has paid access. That
request carries an anonymous identifier and is already covered by Device or
other IDs. What is not yet collected is a *purchase*, because no product is
published and the offering comes back empty.

The trap is that publishing a product needs **no new binary**. The moment the
three Play products go live, this already-uploaded build starts selling and
**Purchases** becomes a declarable type with no release to hang the form update
on. Update Data safety *before* creating the products, not after — and note
that `STORE_LISTING.md` now carries the full v1.2 table, so change it there
first and keep this section pointing at the same answers.

**The daily reminder does not change these answers.** It is a local
notification, scheduled on the device by `expo-notifications` and shown by the
device; there is no push token, no registration call and no server. The app
declares `POST_NOTIFICATIONS` (the runtime prompt), `RECEIVE_BOOT_COMPLETED` (so
a scheduled reminder survives a restart) and `VIBRATE` (haptics). None of the
three is a data-collection declaration.

`expo-notifications` bundles Firebase Cloud Messaging for remote push even
though this app never uses it, which pulls in around twenty permissions the app
has no business holding. `app.json` blocks them via `android.blockedPermissions`
— including the exact-alarm permissions, which Play requires a justification
form for and which a study reminder would not qualify for. **`expo prebuild`
cannot show you the result**: library manifests merge during the Gradle build,
so verify the artifact before submitting:

```bash
aapt2 dump permissions app-release.apk | grep uses-permission
```

**These answers change the moment crash reporting is turned on.** A build with a
Sentry DSN also collects **Crash logs** (App activity and performance),
collected but not shared, required, for app functionality and diagnostics.
Update the form *before* releasing that build, and update `docs/privacy.md` with
it.

### Step 7.3: Upload App Icon

1. Go to **"Store listing"** → **"Preview images"**
2. Find **"Icon"** section
3. Upload **512×512 PNG** image (your app logo)
4. Save

### Step 7.4: Upload Screenshots

1. Still in **"Preview images"**
2. Find **"Phone screenshots"** section
3. Take 5 screenshots from Android emulator (matching iOS screenshots):
   - Screenshot 1: Home screen
   - Screenshot 2: Category screen
   - Screenshot 3: Lesson screen
   - Screenshot 4: Quiz question
   - Screenshot 5: Results screen

4. **Screenshot specs:**
   - Size: 1080×1920 pixels (portrait)
   - Format: PNG or JPEG
   - Max 5MB each

5. Upload all 5 screenshots
6. Reorder if needed
7. Save

---

## Phase 8: Upload Build & Submit (15 Minutes)

### Step 8.1: Upload AAB Build

1. In Google Play Console, click **"Release"** (left sidebar)
2. Click **"Production"** track
3. Click **"Create release"**
4. Upload your AAB file:
   - Download AAB from EAS
   - Drag & drop to Play Console
   - Or click upload button
5. Verify: "Bundle size: X MB"
6. Continue

### Step 8.2: Add Release Notes

1. Find **"Release notes"** field
2. Enter:
   ```
   Initial launch of OTC Learn!
   
   Learn OTC derivatives through interactive lessons and quizzes:
   • 5 asset classes with 10 derivative products
   • 3-step interactive lessons per product
   • 30 true/false quiz questions
   • Progress tracking and daily streak system
   
   No sign-up required. Completely free. Offline playable.
   ```
3. Continue

### Step 8.3: Setup Staged Rollout

1. Find **"Staged rollout"** option
2. Select: **"Staged rollout"** (not full release)
3. Start with **5%** of users
4. This allows you to catch bugs before 100% rollout
5. Continue

### Step 8.4: Review & Submit

1. Review all information (should be complete)
2. Click **"Review release"**
3. Check for any red error icons (fix if needed)
4. Click **"Start rollout to production"**
5. Confirm submission

**Your app is now submitted! ✅**

---

## Phase 9: Monitor Review Process (2-4 Hours)

### Step 9.1: Track Status

```
In Google Play Console:
Click: "Release" → "Production"
Look for: Release status
```

**Status progression:**
1. **"In review"** → Google is checking app (usually 1-2 hours)
2. **"Approved"** → Ready to roll out
3. **"Live"** → Available to users

### Step 9.2: Check Email

Google sends updates to your developer email:
- "Your app has been approved!"
- Or rejection reason if issues found

**Check inbox every 30 minutes for first 4 hours**

### Step 9.3: What If Rejected?

**Common reasons:**
1. **Crashes** → Fix code, rebuild, resubmit
2. **Missing privacy policy** → Add URL, resubmit (no rebuild needed)
3. **Misleading content** → Fix description, resubmit

**If rejected:**
- Read rejection email carefully
- Fix issue mentioned
- Rebuild if code change: `npm run build:android`
- Resubmit in Play Console (same process)

---

## Phase 10: Increase Rollout to 100% (After 1-2 Hours)

### Step 10.1: Monitor Staged Rollout

After app approved and at 5% rollout:

1. In Play Console, go **"Release" → "Production"**
2. Monitor **"Crash rate"** (should be < 1%)
3. Wait 1-2 hours
4. If crash rate acceptable, increase rollout

### Step 10.2: Increase to 25%

1. Click **"Edit release"**
2. Change percentage: **5% → 25%**
3. Save
4. Wait 1-2 hours
5. Monitor crash rate

### Step 10.3: Increase to 100%

1. Click **"Edit release"**
2. Change percentage: **25% → 100%**
3. Save

**Your app is now LIVE to all users! ✅**

---

## Phase 11: App Goes LIVE! (Wait 30-60 Minutes)

### Step 11.1: Verify App is Live

After reaching 100% rollout:

1. Wait 30-60 minutes (indexing takes time)
2. Open **Google Play Store app** on Android phone
3. Search: **"OTC Learn"**
4. **App should appear!** ✅

### Step 11.2: Download & Test

1. Tap **"Install"**
2. App downloads and installs
3. Tap **"Open"**
4. Test all features:
   - [ ] App launches
   - [ ] All categories load
   - [ ] Complete a quiz
   - [ ] Results display
   - [ ] Can retry quiz
   - [ ] Restart phone, reopen app → progress persists

### Step 11.3: Celebrate! 🎉

**Your app is now LIVE on Google Play Store!**
Users can find it by searching "OTC Learn"

---

## Complete Deployment Checklist

### Phase 1-2: Testing (✅ Today)
- [ ] App tested on Android emulator
- [ ] All features work (home, category, lesson, quiz, results)
- [ ] Data persistence verified (complete quiz, restart, progress persists)
- [ ] All tests pass: `npm run test`
- [ ] No TypeScript errors: `npm run type-check`

### Phase 3-4: Setup (✅ Today)
- [ ] Google Play Developer Account created ($25 paid)
- [ ] Android keystore created
- [ ] gradle.properties updated with keystore info

### Phase 5-6: Build & Create App (✅ Today/Tomorrow)
- [ ] Production AAB built: `npm run build:android`
- [ ] Build ID noted or AAB file downloaded
- [ ] App created in Google Play Console
- [ ] All metadata filled (name, description, keywords, category)

### Phase 7: Screenshots & Icons (✅ Tomorrow)
- [ ] App icon uploaded (512×512)
- [ ] 5 screenshots taken and uploaded (1080×1920)
- [ ] Privacy policy URL added
- [ ] Support email added

### Phase 8: Submit (✅ Tomorrow)
- [ ] AAB build uploaded to Play Console
- [ ] Release notes added
- [ ] Staged rollout configured (5% → 25% → 100%)
- [ ] Submitted for review

### Phase 9-11: Wait & Launch (✅ Tomorrow-Day 4)
- [ ] Monitor review (2-4 hours)
- [ ] App approved
- [ ] Increase rollout 5% → 25% → 100%
- [ ] Verify on Google Play Store
- [ ] Download and test on real phone

---

## Key Commands Quick Reference

```bash
# Phase 1: Test
npm run android

# Phase 2: Verify tests
npm run test
npm run type-check
npm run lint

# Phase 4: Create keystore
cd android/app
keytool -genkey -v -keystore otc-learning-app.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias otclearn
cd ../..

# Phase 5: Build
npm run build:android

# After approval: Check status
eas build:list
```

---

## Timeline Summary

```
Today:
  ✅ Test on Android (30 min)
  ✅ Run tests (15 min)
  ✅ Create keystore (5 min)
  ✅ Build production (30 min)

Tomorrow (Day 1):
  ✅ Create Play Console account ($25)
  ✅ Create app in Play Console (30 min)
  ✅ Add metadata + screenshots (1 hour)

Day 1-2:
  ✅ Submit for review (15 min)

Day 2-3:
  ⏳ Google reviews (2-4 hours)

Day 3:
  ✅ App approved & LIVE

Day 3-4:
  ✅ Increase rollout to 100%

TOTAL: 2-3 days from today to LIVE on Google Play
```

---

## Next Immediate Steps

### **Right Now (Next 15 Minutes):**

```bash
# 1. Test on Android emulator
npm start
npm run android

# 2. Go through entire feature checklist above
# Make sure everything works!
```

### **After Testing Works (Today):**

```bash
# 3. Run all tests
npm run test

# 4. Create keystore (one-time setup)
cd android/app
keytool -genkey -v -keystore otc-learning-app.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias otclearn

# 5. Update gradle.properties with keystore info

# 6. Build production app
npm run build:android
```

### **After Build Succeeds (Tomorrow):**

Follow Phase 6-11 above (Play Console setup & submission)

---

**Ready to start? Run `npm run android` now and let me know once all tests pass! 🚀**
