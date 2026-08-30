#!/bin/zsh
# OTC Learn — Android emulator driver.
#
# The app has no programmatic surface of its own: navigation is Redux state and
# every screen is a React Native view, so the only handle on a running build is
# adb. This wraps the parts that are fiddly or easy to get wrong.
#
#   ./driver.sh doctor              what is and is not ready
#   ./driver.sh boot [avd]          start the emulator, wait for boot
#   ./driver.sh install             kill stale Metro, build, install, launch
#   ./driver.sh link <path>         deep link, e.g. link account
#   ./driver.sh screen              current screen as text (cheap assertions)
#   ./driver.sh shot <name>         screenshot -> $OTC_SHOT_DIR
#   ./driver.sh tap <text>          tap the node whose text/desc matches
#   ./driver.sh type <text>         type into the focused field
#   ./driver.sh errors              recent crashes and red-box errors
#   ./driver.sh restart             cold restart (proves session persistence)
#
# Screenshots land outside the repo by default so a driving session never
# shows up in `git status`.

set -u
SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ADB="$SDK/platform-tools/adb"
EMU="$SDK/emulator/emulator"
PKG=com.otclearn.app
SHOTS="${OTC_SHOT_DIR:-/tmp/otc-learn-shots}"
mkdir -p "$SHOTS"

die() { print -u2 -- "✗ $*"; exit 1; }

cmd_doctor() {
  [ -x "$ADB" ] && echo "✓ adb            $ADB" || echo "✗ adb not found — export ANDROID_HOME"
  [ -x "$EMU" ] && echo "✓ emulator       $("$EMU" -list-avds | tr '\n' ' ')" || echo "✗ emulator not found"
  local dev; dev=$("$ADB" devices | awk 'NR>1 && $2=="device" {print $1}')
  [ -n "$dev" ] && echo "✓ device         $dev" || echo "✗ no device — ./driver.sh boot"
  # A Metro older than the newest source file cannot resolve directories added
  # since it started, and fails in ways that look like broken code.
  local pid; pid=$(lsof -ti:8081 2>/dev/null | head -1)
  if [ -n "$pid" ]; then
    local started; started=$(ps -o lstart= -p "$pid" 2>/dev/null | sed 's/^ *//')
    local age; age=$(ps -o etime= -p "$pid" 2>/dev/null | tr -d ' ')
    case "$age" in
      *-*) echo "✗ metro          pid $pid, up $age since $started — STALE, ./driver.sh install kills it" ;;
      *)   echo "✓ metro          pid $pid, up $age" ;;
    esac
  else
    echo "· metro          not running (install will start it)"
  fi
  if [ -f .env ] && grep -q '^EXPO_PUBLIC_SUPABASE_URL=.' .env 2>/dev/null; then
    echo "✓ .env           Supabase configured — sync will be live"
  else
    echo "· .env           no Supabase — Account screen will say sync is unavailable"
  fi
}

cmd_boot() {
  local avd="${1:-$("$EMU" -list-avds | head -1)}"
  [ -n "$avd" ] || die "no AVD available"
  if "$ADB" devices | awk 'NR>1 && $2=="device"' | grep -q .; then
    echo "already booted"; return
  fi
  echo "booting $avd…"
  nohup "$EMU" -avd "$avd" -no-snapshot-load >/tmp/otc-emulator.log 2>&1 &
  local i
  for i in $(seq 1 60); do
    [ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ] && { echo "booted"; return; }
    sleep 5
  done
  die "emulator did not boot within 5 minutes — see /tmp/otc-emulator.log"
}

cmd_install() {
  # Kill Metro unconditionally. Restarting costs seconds; a stale one costs an
  # afternoon of debugging code that is fine.
  local pid; pid=$(lsof -ti:8081 2>/dev/null | head -1)
  [ -n "$pid" ] && { echo "killing Metro pid $pid"; kill "$pid" 2>/dev/null; sleep 2; }
  "$ADB" reverse tcp:8081 tcp:8081 >/dev/null || die "adb reverse failed — is a device attached?"
  echo "building (first run pulls a Gradle daemon; later runs are ~30s)…"
  # No --device flag. It wants an AVD name, not an adb serial, and given a
  # serial it exits 0 without building anything.
  npx expo run:android
}

# `am start` briefly tears down the view hierarchy, so a dump taken straight
# after it comes back empty. Wait for content rather than guessing at a sleep.
cmd_link() {
  "$ADB" shell am start -a android.intent.action.VIEW -d "otclearn://$1" "$PKG" >/dev/null 2>&1
  _wait_for_ui && echo "opened otclearn://$1"
}
cmd_shot()   { "$ADB" exec-out screencap -p > "$SHOTS/$1.png" && echo "$SHOTS/$1.png"; }
# Types, then checks what actually landed.
#
# `adb shell input text` drops characters. Not often, and not reproducibly —
# an email arrived as "otc-sync-test@" once, with everything after the @ simply
# missing, which then failed sign-in with "Invalid login credentials" and looked
# for all the world like an app bug. Verifying costs one dump and removes an
# entire category of false diagnosis.
cmd_type() {
  _has_focus || _wait_for_ui || return 1
  local text="$1" i
  for i in 1 2 3; do
    "$ADB" shell input text "${text// /%s}"
    sleep 1
    if cmd_screen 2>/dev/null | grep -qF -- "$text"; then
      return 0
    fi
    # Secure fields render as bullets, so there is nothing to compare against —
    # accept the first attempt rather than retyping a password three times.
    if cmd_screen 2>/dev/null | grep -q "•"; then
      return 0
    fi
    print -u2 -- "  retyping (attempt $i landed short)"
    # Clear whatever partial text arrived before trying again.
    "$ADB" shell input keyevent KEYCODE_MOVE_END >/dev/null 2>&1
    local n
    for n in $(seq 1 60); do "$ADB" shell input keyevent KEYCODE_DEL >/dev/null 2>&1; done
  done
  print -u2 -- "✗ could not type \"$text\" reliably"
  return 1
}
# Only E/F level, and only from this app. Matching "AndroidRuntime" loosely
# picks up benign debug chatter from uiautomator on every call.
cmd_errors() {
  "$ADB" logcat -d -t 600 2>/dev/null \
    | grep -E "^[0-9-]+ [0-9:.]+ +[0-9]+ +[0-9]+ [EF] " \
    | grep -iE "otclearn|ReactNative|FATAL EXCEPTION" | tail -20
}

# Waits until the app is actually drawing something.
#
# A fixed sleep is not good enough: a debug build refetches the JS bundle from
# Metro on every cold start, so the splash hold is however long that takes —
# 15 seconds was enough once and not the next time. `App.tsx` renders null until
# fonts and hydration settle, and a screenshot taken during that is a black
# frame indistinguishable from a crash. So poll for real content instead.
# Focus first, then content.
#
# Sending a tap while the app has no focused window does not fail — it queues,
# and Android eventually kills the app with "Input dispatching timed out
# (Application does not have a focused window)". An ANR raised by the harness
# looks exactly like an ANR in the app, and costs the same amount of time to
# disbelieve.
_has_focus() {
  "$ADB" shell dumpsys window 2>/dev/null | grep -q "mCurrentFocus=.*$PKG"
}

_wait_for_ui() {
  local i
  for i in $(seq 1 40); do
    if _has_focus && [ -n "$(cmd_screen 2>/dev/null | head -1)" ]; then
      return 0
    fi
    sleep 2
  done
  print -u2 -- "✗ app not focused or not drawing after 80s — ./driver.sh errors"
  return 1
}

cmd_restart() {
  "$ADB" shell am force-stop "$PKG"; sleep 2
  # Explicit component, not `monkey` — monkey exits 0 without launching often
  # enough to waste a diagnosis.
  "$ADB" shell am start -n "$PKG/.MainActivity" >/dev/null 2>&1
  echo "waiting for the app to draw…"
  _wait_for_ui && echo "up"
}

_dump() { "$ADB" shell uiautomator dump /sdcard/ui.xml >/dev/null 2>&1; "$ADB" shell cat /sdcard/ui.xml 2>/dev/null; }

cmd_screen() {
  _dump | python3 -c '
import re, sys
xml = sys.stdin.read()
seen = []
for tag in re.findall(r"<node[^>]*>", xml):
    t = re.search(r"text=\"([^\"]*)\"", tag)
    if t and t.group(1).strip() and t.group(1) not in seen:
        seen.append(t.group(1))
print("\n".join(seen))'
}

cmd_tap() {
  local needle="$1"
  _has_focus || _wait_for_ui || return 1
  _dump | python3 -c '
import os, re, subprocess, sys
needle = sys.argv[1]
xml = sys.stdin.read()
offscreen = []
for tag in re.findall(r"<node[^>]*>", xml):
    t = re.search(r"text=\"([^\"]*)\"", tag)
    c = re.search(r"content-desc=\"([^\"]*)\"", tag)
    hay = (t.group(1) if t else "") + " " + (c.group(1) if c else "")
    if needle.lower() not in hay.lower().strip():
        continue
    b = re.search(r"bounds=\"\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]\"", tag)
    if not b:
        continue
    x1, y1, x2, y2 = map(int, b.groups())
    # A node scrolled out of the viewport is reported with an inverted or
    # zero-area rectangle (y2 < y1). Averaging that yields a coordinate that
    # looks reasonable and lands on whatever is actually drawn there — which
    # is how a tap silently hits the tab bar instead of the row you asked for.
    if x2 <= x1 or y2 <= y1:
        offscreen.append((hay.strip()[:40], x1, y1, x2, y2))
        continue
    x, y = (x1 + x2) // 2, (y1 + y2) // 2
    subprocess.run([os.environ["ADB"], "shell", "input", "tap", str(x), str(y)], check=True)
    print(f"tapped \"{needle}\" at {x},{y}")
    sys.exit(0)
if offscreen:
    label, x1, y1, x2, y2 = offscreen[0]
    print(f"\"{label}\" is scrolled out of view (bounds [{x1},{y1}][{x2},{y2}] are "
          f"inverted). Use a deep link, or scroll it into view first.", file=sys.stderr)
else:
    print(f"no node matching \"{needle}\" — try ./driver.sh screen", file=sys.stderr)
sys.exit(1)' "$needle" || return 1
  _wait_for_ui
}

case "${1:-doctor}" in
  doctor)  cmd_doctor ;;
  boot)    cmd_boot "${2:-}" ;;
  install) cmd_install ;;
  link)    cmd_link "${2:?usage: link <path>}" ;;
  screen)  cmd_screen ;;
  shot)    cmd_shot "${2:?usage: shot <name>}" ;;
  tap)     cmd_tap "${2:?usage: tap <text>}" ;;
  type)    cmd_type "${2:?usage: type <text>}" ;;
  errors)  cmd_errors ;;
  restart) cmd_restart ;;
  *)       die "unknown command: $1" ;;
esac
