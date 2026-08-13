import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { colors, typography } from '../../../theme';

export interface QuizTimerProps {
  /** Epoch ms the sitting began, or null when there is nothing to time. */
  startedAt: number | null;
}

/** `m:ss`, counting up. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * A session clock, shown only when the user has asked for one.
 *
 * It counts up rather than down: this is a study app, and a countdown turns a
 * lesson check into an exam. The interval is cleared on unmount, so leaving the
 * quiz stops the timer rather than leaving it ticking behind the results.
 */
export function QuizTimer({ startedAt }: QuizTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (startedAt === null) {
      return;
    }
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (startedAt === null) {
    return null;
  }

  return (
    <Text
      testID="quiz-timer"
      accessibilityLabel={`Elapsed ${formatElapsed(now - startedAt)}`}
      style={styles.timer}
    >
      {formatElapsed(now - startedAt)}
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
});
