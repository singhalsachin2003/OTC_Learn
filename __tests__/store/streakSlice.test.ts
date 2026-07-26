import reducer, {
  initialStreakState,
  updateStreak,
} from '../../src/store/slices/streakSlice';

describe('streakSlice', () => {
  it('starts at zero with no recorded activity', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialStreakState);
  });

  it('starts the streak at 1 on first activity', () => {
    const state = reducer(initialStreakState, updateStreak('2026-07-25'));

    expect(state).toEqual({ currentStreak: 1, lastActivityDate: '2026-07-25' });
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

    expect(state).toEqual({ currentStreak: 3, lastActivityDate: '2026-07-27' });
  });

  it('increments correctly across a month boundary', () => {
    const state = reducer(
      { currentStreak: 9, lastActivityDate: '2026-07-31' },
      updateStreak('2026-08-01'),
    );

    expect(state.currentStreak).toBe(10);
  });

  it('resets to 1 after a missed day', () => {
    const state = reducer(
      { currentStreak: 6, lastActivityDate: '2026-07-20' },
      updateStreak('2026-07-25'),
    );

    expect(state).toEqual({ currentStreak: 1, lastActivityDate: '2026-07-25' });
  });

  it('resets to 1 if the clock moves backwards', () => {
    const state = reducer(
      { currentStreak: 6, lastActivityDate: '2026-07-25' },
      updateStreak('2026-07-24'),
    );

    expect(state).toEqual({ currentStreak: 1, lastActivityDate: '2026-07-24' });
  });

  it("defaults the payload to today's date key", () => {
    const action = updateStreak();

    expect(action.payload).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
