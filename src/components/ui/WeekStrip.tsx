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
 * This calendar week, Monday to Sunday.
 *
 * Not the trailing seven days, which is what this used to be. A rolling window
 * always had something in every column, but it started on whatever weekday it
 * happened to be yesterday-plus-one — so the strip read "T W T F S S M" and
 * nobody could tell at a glance which week they were looking at. A week that
 * always starts on Monday is a shape people already know how to read.
 *
 * The cost is real and is handled below: early in the week most of the strip
 * is days that have not happened yet, and those must not look like days that
 * were missed.
 *
 * Built by stepping a Date rather than by subtracting milliseconds, so the
 * strip stays correct across a daylight-saving change where one of those days
 * is 23 or 25 hours long.
 */
export function buildWeek(
  studyDays: readonly string[],
  today: Date = new Date(),
): WeekDay[] {
  const studied = new Set(studyDays);
  const todayKey = toDateKey(today);

  // `getDay()` is 0 for Sunday, so Sunday is six days *after* Monday rather
  // than one day before it.
  const monday = new Date(today.getTime());
  monday.setDate(monday.getDate() - ((today.getDay() + 6) % 7));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday.getTime());
    date.setDate(date.getDate() + index);
    const key = toDateKey(date);
    return {
      key,
      label: DAY_INITIALS[date.getDay()],
      studied: studied.has(key),
      isToday: key === todayKey,
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
  const elapsed = week.filter((day) => !day.isFuture).length;

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      // "of the last 7 days" stopped being true the moment this became a
      // calendar week — on a Tuesday there are only two days to have studied on.
      accessibilityLabel={`Studied on ${studiedCount} of ${elapsed} days so far this week`}
      style={[styles.row, style]}
    >
      {week.map((day) => (
        <View key={day.key} style={styles.column}>
          <View
            testID={`${testID ?? 'week'}-${
              day.isFuture ? 'future' : day.studied ? 'on' : 'off'
            }`}
            style={[
              styles.bar,
              day.isFuture && styles.barFuture,
              day.studied && styles.barStudied,
              !day.studied && day.isToday && styles.barToday,
            ]}
          />
          <Text style={[styles.label, day.isFuture && styles.labelFuture]}>
            {day.label}
          </Text>
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
  /**
   * Days that have not happened yet.
   *
   * A step *lighter* than an unstudied day, not darker. On a Monday six of the
   * seven columns are still to come, and at the same weight as a missed day the
   * strip would open the week by reporting six failures.
   */
  barFuture: {
    backgroundColor: colors.line.soft,
  },
  labelFuture: {
    color: colors.line.strong,
  },
  label: {
    ...typography.micro,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});
