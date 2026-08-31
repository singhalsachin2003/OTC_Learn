import { screen } from '@testing-library/react-native';

import { buildWeek, WeekStrip } from '../../src/components/ui/WeekStrip';
import { toDateKey } from '../../src/utils/formatters';
import { renderWithStore } from '../helpers/renderWithStore';

/** 2026-08-31 is a Monday; the days that follow run to Sunday the 6th. */
const MONDAY = new Date(2026, 7, 31);
const WEDNESDAY = new Date(2026, 8, 2);
const SUNDAY = new Date(2026, 8, 6);

describe('buildWeek', () => {
  it('always starts on Monday, whatever day it is', () => {
    for (const day of [MONDAY, WEDNESDAY, SUNDAY]) {
      expect(buildWeek([], day).map((d) => d.label)).toEqual([
        'M',
        'T',
        'W',
        'T',
        'F',
        'S',
        'S',
      ]);
    }
  });

  /**
   * `getDay()` is 0 for Sunday, so Sunday is six days *after* the Monday of its
   * week rather than one day before it — the off-by-one this arithmetic invites.
   */
  it('puts Sunday at the end of its own week, not the start of the next', () => {
    const week = buildWeek([], SUNDAY);

    expect(week[0].key).toBe('2026-08-31');
    expect(week[6].key).toBe('2026-09-06');
    expect(week[6].isToday).toBe(true);
  });

  it('runs seven consecutive days from the Monday', () => {
    expect(buildWeek([], WEDNESDAY).map((d) => d.key)).toEqual([
      '2026-08-31',
      '2026-09-01',
      '2026-09-02',
      '2026-09-03',
      '2026-09-04',
      '2026-09-05',
      '2026-09-06',
    ]);
  });

  it('marks today, and only today', () => {
    const week = buildWeek([], WEDNESDAY);

    expect(week.filter((d) => d.isToday)).toHaveLength(1);
    expect(week[2].isToday).toBe(true);
  });

  it('marks the days still to come, and never today or the past', () => {
    const week = buildWeek([], WEDNESDAY);

    expect(week.map((d) => d.isFuture)).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      true,
    ]);
  });

  it('marks the days studied', () => {
    const week = buildWeek(['2026-08-31', '2026-09-02'], WEDNESDAY);

    expect(week.filter((d) => d.studied).map((d) => d.key)).toEqual([
      '2026-08-31',
      '2026-09-02',
    ]);
  });

  it('ignores study days outside this week', () => {
    const week = buildWeek(['2026-08-30', '2026-09-07'], WEDNESDAY);

    expect(week.some((d) => d.studied)).toBe(false);
  });

  it('covers today when called with no clock', () => {
    expect(buildWeek([]).some((d) => d.key === toDateKey())).toBe(true);
  });
});

describe('WeekStrip', () => {
  /**
   * Early in the week most of the strip has not happened yet. Rendered at the
   * same weight as a missed day, a Monday would open by reporting six failures.
   */
  it('distinguishes days to come from days missed', async () => {
    await renderWithStore(<WeekStrip testID="week" studyDays={[]} />);

    const future = screen.queryAllByTestId('week-future');
    const missed = screen.queryAllByTestId('week-off');

    expect(future.length + missed.length).toBe(7);
    // Today is never "future", so there is always at least one elapsed column.
    expect(missed.length).toBeGreaterThan(0);
  });

  it('counts only the days that have happened', async () => {
    await renderWithStore(<WeekStrip testID="week" studyDays={[toDateKey()]} />);

    // "of the last 7 days" stopped being true when this became a calendar week.
    expect(
      screen.getByLabelText(/Studied on 1 of \d days so far this week/),
    ).toBeTruthy();
  });
});
