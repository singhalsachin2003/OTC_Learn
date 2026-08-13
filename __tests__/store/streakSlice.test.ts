import reducer, {
  initialStreakState,
  resetStreak,
  setStreak,
  setStudyDays,
  updateStreak,
  type StreakState,
} from '../../src/store/slices/streakSlice';

/** A state part-way through a run, without spelling out every field inline. */
function streakOn(
  lastActivityDate: string,
  currentStreak: number,
  longestStreak = currentStreak,
): StreakState {
  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    studyDays: [lastActivityDate],
  };
}

describe('streakSlice', () => {
  it('starts at zero with no recorded activity', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialStreakState);
  });

  it('starts the streak at 1 on first activity', () => {
    const state = reducer(initialStreakState, updateStreak('2026-07-25'));

    expect(state.currentStreak).toBe(1);
    expect(state.lastActivityDate).toBe('2026-07-25');
  });

  it('leaves the streak alone for repeat activity on the same day', () => {
    const day1 = reducer(initialStreakState, updateStreak('2026-07-25'));
    const again = reducer(day1, updateStreak('2026-07-25'));

    expect(again).toEqual(day1);
  });

  it('increments on consecutive days', () => {
    let state = reducer(initialStreakState, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-26'));
    state = reducer(state, updateStreak('2026-07-27'));

    expect(state.currentStreak).toBe(3);
    expect(state.lastActivityDate).toBe('2026-07-27');
  });

  it('increments correctly across a month boundary', () => {
    const state = reducer(streakOn('2026-07-31', 9), updateStreak('2026-08-01'));

    expect(state.currentStreak).toBe(10);
  });

  it('resets to 1 after a missed day', () => {
    const state = reducer(streakOn('2026-07-20', 6), updateStreak('2026-07-25'));

    expect(state.currentStreak).toBe(1);
    expect(state.lastActivityDate).toBe('2026-07-25');
  });

  // A user who changes their device clock, or travels back across the date
  // line, must not be able to keep a run alive with a stale date.
  it('resets to 1 if the clock moves backwards', () => {
    const state = reducer(streakOn('2026-07-25', 6), updateStreak('2026-07-24'));

    expect(state.currentStreak).toBe(1);
    expect(state.lastActivityDate).toBe('2026-07-24');
  });

  it("defaults the payload to today's date key", () => {
    const action = updateStreak();

    expect(action.payload).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('streakSlice longest streak', () => {
  it('tracks the best run as it grows', () => {
    let state = reducer(initialStreakState, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-26'));

    expect(state.longestStreak).toBe(2);
  });

  // The point of the record is that a lapse still leaves something to beat.
  it('keeps the best run after the current one breaks', () => {
    let state = reducer(streakOn('2026-07-20', 6), updateStreak('2026-07-25'));

    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(6);

    state = reducer(state, updateStreak('2026-07-26'));

    expect(state.currentStreak).toBe(2);
    expect(state.longestStreak).toBe(6);
  });

  it('raises the record only once the current run overtakes it', () => {
    let state = streakOn('2026-07-25', 2, 3);
    state = reducer(state, updateStreak('2026-07-26'));

    expect(state.longestStreak).toBe(3);

    state = reducer(state, updateStreak('2026-07-27'));

    expect(state.currentStreak).toBe(4);
    expect(state.longestStreak).toBe(4);
  });
});

describe('streakSlice study days', () => {
  it('records each active day in order', () => {
    let state = reducer(initialStreakState, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-27'));

    expect(state.studyDays).toEqual(['2026-07-25', '2026-07-27']);
  });

  // Several sessions in a day each call through, and the week strip counts
  // days rather than sessions.
  it('does not record the same day twice', () => {
    let state = reducer(initialStreakState, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-25'));

    expect(state.studyDays).toEqual(['2026-07-25']);
  });

  it('records a day even when the streak itself is broken', () => {
    const state = reducer(streakOn('2026-07-20', 6), updateStreak('2026-07-25'));

    expect(state.studyDays).toEqual(['2026-07-20', '2026-07-25']);
  });

  // A long-lived install must not grow this list without bound.
  it('keeps only the most recent year of days', () => {
    const days = Array.from({ length: 365 }, (_, index) => `day-${index}`);
    const state = reducer(
      { ...initialStreakState, studyDays: days },
      updateStreak('2026-07-25'),
    );

    expect(state.studyDays).toHaveLength(365);
    expect(state.studyDays[0]).toBe('day-1');
    expect(state.studyDays[364]).toBe('2026-07-25');
  });

  it('sorts and de-duplicates a hydrated list of days', () => {
    const state = reducer(
      initialStreakState,
      setStudyDays(['2026-07-27', '2026-07-25', '2026-07-27']),
    );

    expect(state.studyDays).toEqual(['2026-07-25', '2026-07-27']);
  });
});

describe('streakSlice hydration', () => {
  it('replaces the counters from storage', () => {
    const state = reducer(
      initialStreakState,
      setStreak({
        currentStreak: 4,
        longestStreak: 11,
        lastActivityDate: '2026-07-25',
        studyDays: ['2026-07-24', '2026-07-25'],
      }),
    );

    expect(state).toEqual({
      currentStreak: 4,
      longestStreak: 11,
      lastActivityDate: '2026-07-25',
      studyDays: ['2026-07-24', '2026-07-25'],
    });
  });

  // Study days are stored under their own key, so a payload without them must
  // leave whatever was already loaded intact rather than blanking it.
  it('leaves the study days alone when the payload omits them', () => {
    const loaded = reducer(initialStreakState, setStudyDays(['2026-07-25']));

    const state = reducer(
      loaded,
      setStreak({
        currentStreak: 1,
        longestStreak: 3,
        lastActivityDate: '2026-07-25',
      }),
    );

    expect(state.studyDays).toEqual(['2026-07-25']);
  });

  it('wipes every counter on reset', () => {
    let state = reducer(initialStreakState, updateStreak('2026-07-25'));
    state = reducer(state, updateStreak('2026-07-26'));

    expect(reducer(state, resetStreak())).toEqual(initialStreakState);
  });
});
