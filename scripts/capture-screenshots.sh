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

# Deep link, wait for the transition to settle, then capture.
shot() {
  local name="$1" url="${2:-}"
  if [ -n "$url" ]; then
    "$ADB" shell am start -a android.intent.action.VIEW -d "$url" "$PKG" >/dev/null
  fi
  sleep 2
  "$ADB" exec-out screencap -p > "$OUT/$name.png"
  echo "  $OUT/$name.png"
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
"$ADB" shell pm clear "$PKG" >/dev/null
"$ADB" shell am start -n "$PKG/.MainActivity" >/dev/null
# A debug build fetches its bundle from Metro on launch, which is slow the first
# time; a release build is ready much sooner.
sleep 25

shot 01-home
shot 02-category "otclearn://category/ir"
# `product` opens the product page — summary, key terms and the worked example.
# `lesson` goes straight into the five-step lesson.
shot 03-product "otclearn://product/irs"
shot 04-lesson "otclearn://lesson/irs"

# Walk to the last lesson step and start the quiz. The "Next" button sits in the
# right two-thirds of the action row at the bottom of the lesson screen.
for _ in 1 2 3 4; do tap 0.70 0.93; done
tap 0.70 0.93
shot 05-quiz

# Answer the first question to show the feedback panel. A quiz draws its paper at
# random, so the first question may be true/false (buttons at the bottom) or
# multiple choice (options in the card). Tapping the first option lands on an
# answer either way: the True button and option A occupy different rows, so both
# taps are attempted and only one does anything.
tap 0.27 0.93
sleep 1
tap 0.50 0.55
sleep 1
shot 06-quiz-feedback

shot 07-review "otclearn://review"
shot 08-profile "otclearn://profile"

echo
echo "Done. Review these before uploading — Play rejects screenshots with"
echo "debug overlays, status-bar clutter or placeholder content."
