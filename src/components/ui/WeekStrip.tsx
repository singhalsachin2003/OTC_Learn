import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../../theme';
import { toDateKey } from '../../utils/formatters';

const DAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

export interface WeekDay {
  key: string;
  label: string;
  studied: boolean;
  isToday: boolean;
  isFuture: boolean;
}

/**
 * The last seven days ending today, oldest first.
 *
 * Built by stepping a Date backwards rather than by subtracting milliseconds,
 * so the strip stays correct across a daylight-saving change where one of
 * those days is 23 or 25 hours long.
 */
export function buildWeek(
  studyDays: readonly string[],
  today: Date = new Date(),
): WeekDay[] {
  const studied = new Set(studyDays);
  const todayKey = toDateKey(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today.getTime());
    date.setDate(date.getDate() - (6 - index));
    const key = toDateKey(date);
    return {
      key,
      label: DAY_INITIALS[date.getDay()],
      studied: studied.has(key),
      isToday: key === todayKey,
      // Nothing is future in a trailing week, but the flag keeps the component
      // usable if a caller ever centres the strip on today instead.
      isFuture: key > todayKey,
    };
  });
}

export interface WeekStripProps {
  studyDays: readonly string[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Seven columns: filled where the user studied, outlined where they did not. */
export function WeekStrip({ studyDays, style, testID }: WeekStripProps) {
  const week = buildWeek(studyDays);
  const studiedCount = week.filter((day) => day.studied).length;

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`Studied on ${studiedCount} of the last 7 days`}
      style={[styles.row, style]}
    >
      {week.map((day) => (
        <View key={day.key} style={styles.column}>
          <View
            testID={`${testID ?? 'week'}-${day.studied ? 'on' : 'off'}`}
            style={[
              styles.bar,
              day.studied && styles.barStudied,
              !day.studied && day.isToday && styles.barToday,
            ]}
          />
          <Text style={styles.label}>{day.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    columnGap: 6,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  /**
   * A filled track, not an outlined box.
   *
   * Seven tall empty rectangles with 1px borders read as skeleton loaders —
   * content that has not arrived rather than days that were not studied. A
   * shorter filled bar states the same absence without looking unfinished.
   */
  bar: {
    alignSelf: 'stretch',
    height: 24,
    borderRadius: radius.xs,
    backgroundColor: colors.line.base,
  },
  barStudied: {
    backgroundColor: colors.progressFill,
  },
  /** Today, not yet studied: a step darker so it reads as "in play". */
  barToday: {
    backgroundColor: colors.line.strong,
  },
  label: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
