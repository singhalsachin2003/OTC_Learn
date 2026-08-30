import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../../../theme';

export interface QuizTimerProps {
  /** Epoch ms the sitting began, or null when there is nothing to time. */
  startedAt: number | null;
  /**
   * Milliseconds allowed. When set the clock counts down and calls `onExpire`
   * as it reaches zero; when null it counts up and never fires.
   */
  limitMs?: number | null;
  /** Called once, at expiry. */
  onExpire?: () => void;
}

/** `m:ss`, counting up. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * A session clock.
 *
 * For ordinary practice it counts up: this is a study app, and a countdown
 * turns a lesson check into an exam. A practice exam is the one place that is
 * the point, so passing `limitMs` flips it to a countdown that ends the
 * sitting — the exception the original reasoning was drawing a line against,
 * now that the app has something on the other side of it.
 *
 * The interval is cleared on unmount, so leaving the quiz stops the timer
 * rather than leaving it ticking behind the results.
 */
export function QuizTimer({ startedAt, limitMs = null, onExpire }: QuizTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  // Guards the callback rather than the render: `onExpire` tears down this
  // component, but a re-render landing before that must not fire it twice and
  // record two sittings.
  const firedRef = useRef(false);

  useEffect(() => {
    if (startedAt === null) {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const elapsed = startedAt === null ? 0 : now - startedAt;
  const remaining = limitMs === null ? null : Math.max(0, limitMs - elapsed);

  useEffect(() => {
    if (remaining === null || remaining > 0 || firedRef.current) {
      return;
    }
    firedRef.current = true;
    onExpire?.();
  }, [remaining, onExpire]);

  if (startedAt === null) {
    return null;
  }

  const shown = remaining === null ? elapsed : remaining;
  return (
    <Text
      testID="quiz-timer"
      accessibilityLabel={
        remaining === null
          ? `Elapsed ${formatElapsed(elapsed)}`
          : `${formatElapsed(remaining)} remaining`
      }
      style={[styles.timer, remaining !== null && styles.countdown]}
    >
      {formatElapsed(shown)}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    ...typography.label,
    fontSize: 12,
    color: colors.text.tertiary,
    // Tabular-ish alignment: a fixed width stops the row jittering as digits
    // change width each second.
    minWidth: 42,
    textAlign: 'right',
  },
  countdown: {
    color: colors.text.primary,
  },
});
