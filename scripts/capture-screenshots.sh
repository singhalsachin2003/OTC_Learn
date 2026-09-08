#!/usr/bin/env bash
#
# Captures Play Store screenshots from a connected device or emulator.
#
# Play wants at least two phone screenshots, 16:9 or 9:16, each side between
# 320px and 3840px. A Pixel 7 emulator at 1080x2400 satisfies that as-is, so
# these are used unscaled.
#
# The app must already be installed (npm run android). Screens are reached via
# the otclearn:// deep links rather than synthetic taps, which keeps this stable
# against layout changes — and exercises deep linking on a real device.
#
# Usage: scripts/capture-screenshots.sh [output-dir]

set -euo pipefail

OUT="${1:-store-assets/screenshots}"
PKG="com.otclearn.app"
# Set KEEP_DATA=1 to capture whatever progress is already on the device.
# A cleared install shows every ring at zero and "nothing due", which is honest
# and makes for weak store screenshots — the app is about progress over time and
# an empty one cannot show that. Clearing stays the default so an unattended run
# is reproducible.
KEEP_DATA="${KEEP_DATA:-0}"
MISSED=""
ADB="${ANDROID_HOME:-$HOME/Library/Android/sdk}/platform-tools/adb"

if [ ! -x "$ADB" ]; then
  echo "adb not found at $ADB — set ANDROID_HOME" >&2
  exit 1
fi

if ! "$ADB" get-state >/dev/null 2>&1; then
  echo "No device or emulator attached" >&2
  exit 1
fi

mkdir -p "$OUT"

# Deep link, confirm we actually arrived, then capture.
#
# A deep link delivered to an app that is already foregrounded is sometimes
# dropped — `am start` reports "intent has been delivered to currently running
# top-most instance" either way — and a dropped link means the next screenshot
# is of whatever was on screen before. That is how a run once produced a product
# page labelled 01-home. Each shot therefore names a string it expects to find
# in the view hierarchy, and retries the link before giving up loudly.
arrived() {
  local expect="$1"
  "$ADB" shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 || return 1
  "$ADB" shell cat /sdcard/ui.xml 2>/dev/null | grep -q "$expect"
}

shot() {
  local name="$1" url="${2:-}" expect="${3:-}"
  local attempt
  for attempt in 1 2 3; do
    if [ -n "$url" ]; then
      "$ADB" shell am start -a android.intent.action.VIEW -d "$url" "$PKG" >/dev/null
    fi
    sleep 2
    if [ -z "$expect" ] || arrived "$expect"; then
      "$ADB" exec-out screencap -p > "$OUT/$name.png"
      echo "  $OUT/$name.png"
      return 0
    fi
  done
  echo "  ! $name: never reached ${url:-current screen} (expected \"$expect\")" >&2
  MISSED="$MISSED $name"
  return 0
}

# Tap a point given as a fraction of the screen, so this survives a different
# device resolution.
tap() {
  local fx="$1" fy="$2"
  local size x y
  size=$("$ADB" shell wm size | tail -1 | awk '{print $NF}')
  x=$(echo "${size%x*} $fx" | awk '{printf "%d", $1 * $2}')
  y=$(echo "${size#*x} $fy" | awk '{printf "%d", $1 * $2}')
  "$ADB" shell input tap "$x" "$y"
  sleep 1
}

echo "Capturing to $OUT/"

# Clear progress so the home screen shows a fresh state rather than whatever
# the last manual run left behind. `monkey` is deliberately not used to launch:
# it returns non-zero on a busy device, which `set -e` turns into a silent exit.
if [ "$KEEP_DATA" != "1" ]; then
  "$ADB" shell pm clear "$PKG" >/dev/null
fi
"$ADB" shell am start -n "$PKG/.MainActivity" >/dev/null
# A debug build fetches its bundle from Metro on launch, which is slow the first
# time; a release build is ready much sooner.
sleep 25

# Dismiss the LogBox toast. A debug build shows "Open debugger to view warnings"
# over the bottom of every screen — RevenueCat's Test Store notice fires one on
# launch — and Play rejects screenshots carrying a debug overlay. Its dismiss
# control is the circled cross at the right-hand end of the toast, which sits
# just above the tab bar. Harmless on a release build, where there is no toast
# and the tap lands on empty space.
tap 0.92 0.93
sleep 1

shot 01-home "otclearn://" "one product at a time"
shot 02-category "otclearn://category/ir" "manage exposure to interest rate"
# `product` opens the product page — summary, key terms and the worked example.
# `lesson` goes straight into the five-step lesson.
shot 03-product "otclearn://product/irs" "Trade fixed for floating"
shot 04-lesson "otclearn://lesson/irs" "STEP 1 OF 5"

# Walk to the last lesson step and start the quiz. The "Next" button sits in the
# right two-thirds of the action row at the bottom of the lesson screen.
for _ in 1 2 3 4; do tap 0.70 0.93; done
tap 0.70 0.93

# Prefer a multiple-choice question for the two quiz shots.
#
# A paper is drawn at random. A true/false question is a card and two buttons
# with two-thirds of the screen empty between them — accurate, and the weakest
# thing in the app to put in front of someone deciding whether to install. So
# redraw until a choice question comes up, and answer it to show the explanation
# panel, which is the part worth advertising.
#
# Leaving a part-finished quiz raises a native confirmation dialog, which the
# text-matching helpers cannot see; its LEAVE button is dismissed by position.
quiz_shots() {
  local attempt options first
  for attempt in 1 2 3 4 5 6 7 8; do
    if "$ADB" shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1 &&
       "$ADB" shell cat /sdcard/ui.xml 2>/dev/null | grep -q 'text="A"'; then
      "$ADB" exec-out screencap -p > "$OUT/05-quiz.png"
      echo "  $OUT/05-quiz.png"
      # Answer the first option; any answer shows the explanation.
      tap 0.50 0.42
      sleep 2
      "$ADB" exec-out screencap -p > "$OUT/06-quiz-feedback.png"
      echo "  $OUT/06-quiz-feedback.png"
      return 0
    fi
    # True/false: leave, confirm, and draw another paper.
    tap 0.12 0.07
    sleep 1
    tap 0.83 0.57
    sleep 1
    "$ADB" shell am start -a android.intent.action.VIEW -d "otclearn://product/irs" "$PKG" >/dev/null
    sleep 2
    tap 0.50 0.55
    sleep 2
  done
  echo "  ! quiz: no multiple-choice question drawn in 8 attempts" >&2
  MISSED="$MISSED quiz"
}
quiz_shots

shot 07-review "otclearn://review" "widening schedule"
# Insights rather than Profile: Profile leads with an "Add your name"
# placeholder, and Play discourages placeholder content in screenshots.
shot 08-insights "otclearn://insights" "Where the gaps are"

echo
if [ -n "$MISSED" ]; then
  echo "INCOMPLETE — these never reached their screen:$MISSED" >&2
  echo "Re-run, or drive those screens by hand. A screenshot of the wrong"
  echo "screen is worse than a missing one, because it looks finished." >&2
  exit 1
fi
echo "Done. Review these before uploading — Play rejects screenshots with"
echo "debug overlays, status-bar clutter or placeholder content."
