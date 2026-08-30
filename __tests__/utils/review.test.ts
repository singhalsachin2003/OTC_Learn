import { toDateKey } from '../../src/utils/formatters';
import {
  addDays,
  BASE_INTERVALS,
  dueItems,
  intervalForStep,
  isDue,
  nextDueDate,
  scheduleLapse,
  schedulePromotion,
  type ReviewItem,
} from '../../src/utils/review';

/**
 * Every test pins `now` explicitly. Scheduling that silently depends on the
 * wall clock passes at 10am and fails at 11pm, which is the worst kind of
 * flake to chase in a suite this small.
 */
const NOW = new Date(2026, 7, 13, 9, 0);

function item(overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    id: 'ir-swap-3',
    productId: 'interest-rate-swap',
    step: 0,
    dueOn: '2026-08-14',
    lapses: 1,
    updatedAt: NOW.getTime(),
    ...overrides,
  };
}

/**
 * Days in `year` after which the local UTC offset changes. Used to prove that
 * `addDays` steps the calendar rather than adding 86,400,000 milliseconds;
 * a fixed-offset zone such as Asia/Kolkata has none, so the test that uses
 * this reports as skipped rather than passing on nothing.
 */
function dstTransitionEves(year: number): Date[] {
  const eves: Date[] = [];

  for (let day = 1; day <= 365; day += 1) {
    const before = new Date(year, 0, day, 12);
    const after = new Date(year, 0, day + 1, 12);
    if (before.getTimezoneOffset() !== after.getTimezoneOffset()) {
      eves.push(before);
    }
  }

  return eves;
}

const transitionEves = dstTransitionEves(2026);
const itAcrossDst = transitionEves.length > 0 ? it : it.skip;

describe('addDays', () => {
  it('returns a date key the given number of days on', () => {
    expect(addDays(1, NOW)).toBe('2026-08-14');
    expect(addDays(10, NOW)).toBe('2026-08-23');
  });

  it('returns today for a step of zero', () => {
    expect(addDays(0, NOW)).toBe('2026-08-13');
  });

  it('steps backwards for a negative count', () => {
    expect(addDays(-1, NOW)).toBe('2026-08-12');
  });

  it('rolls over a month boundary', () => {
    expect(addDays(1, new Date(2026, 7, 31, 9, 0))).toBe('2026-09-01');
  });

  it('rolls over a year boundary', () => {
    expect(addDays(2, new Date(2026, 11, 31, 9, 0))).toBe('2027-01-02');
  });

  it('handles a leap day', () => {
    expect(addDays(1, new Date(2028, 1, 28, 9, 0))).toBe('2028-02-29');
  });

  it('uses local time, so a late-evening session does not slip a day', () => {
    expect(addDays(1, new Date(2026, 7, 13, 23, 45))).toBe('2026-08-14');
  });

  it('leaves the date it was given untouched', () => {
    const from = new Date(2026, 7, 13, 9, 0);
    addDays(30, from);

    expect(from.getTime()).toBe(new Date(2026, 7, 13, 9, 0).getTime());
  });

  itAcrossDst('steps a calendar day across a daylight-saving boundary', () => {
    // A day is not always 24 hours. Adding milliseconds lands on the wrong
    // calendar day when the clocks move; stepping the day component cannot.
    for (const eve of transitionEves) {
      const year = eve.getFullYear();
      const month = eve.getMonth();
      const day = eve.getDate();
      const expected = toDateKey(new Date(year, month, day + 1, 12));

      expect(addDays(1, new Date(year, month, day, 0, 30))).toBe(expected);
      expect(addDays(1, new Date(year, month, day, 23, 30))).toBe(expected);
    }
  });
});

describe('intervalForStep', () => {
  it('walks the fixed 1/4/10 ladder first', () => {
    // These three are what the app promises the user, so they are fixed
    // rather than derived.
    expect([0, 1, 2].map(intervalForStep)).toEqual([1, 4, 10]);
    expect([0, 1, 2].map(intervalForStep)).toEqual([...BASE_INTERVALS]);
  });

  it('hands over to the ease factor beyond the ladder', () => {
    expect(intervalForStep(3)).toBe(23);
    expect(intervalForStep(4)).toBe(53);
  });

  it('caps the interval at 120 days', () => {
    expect(intervalForStep(5)).toBe(120);
    expect(intervalForStep(9)).toBe(120);
  });

  it('never shortens as the step grows', () => {
    let previous = 0;

    for (let step = 0; step <= 12; step += 1) {
      const interval = intervalForStep(step);

      expect(interval).toBeGreaterThanOrEqual(previous);
      expect(interval).toBeLessThanOrEqual(120);
      previous = interval;
    }
  });

  it('returns whole days', () => {
    for (let step = 0; step <= 8; step += 1) {
      expect(Number.isInteger(intervalForStep(step))).toBe(true);
    }
  });
});

describe('scheduleLapse', () => {
  it('queues a new miss for tomorrow', () => {
    const result = scheduleLapse(undefined, 'fx-fwd-2', 'fx-forward', NOW);

    expect(result).toEqual({
      id: 'fx-fwd-2',
      productId: 'fx-forward',
      step: 0,
      updatedAt: NOW.getTime(),
      dueOn: '2026-08-14',
      lapses: 1,
    });
  });

  it('resets a queued question to the start of the ladder', () => {
    const result = scheduleLapse(
      item({ step: 4, dueOn: '2026-10-05' }),
      'ir-swap-3',
      'interest-rate-swap',
      NOW,
    );

    expect(result.step).toBe(0);
    expect(result.dueOn).toBe('2026-08-14');
  });

  it('carries the lapse count through the reset and increments it', () => {
    // The step resets but the lapse count does not: it is the only record
    // that this question is persistently difficult, so losing it would hide
    // the user's weakest material.
    const result = scheduleLapse(
      item({ step: 3, lapses: 2 }),
      'ir-swap-3',
      'interest-rate-swap',
      NOW,
    );

    expect(result.lapses).toBe(3);
  });

  it('accumulates lapses over repeated misses', () => {
    let current = scheduleLapse(undefined, 'ir-swap-3', 'interest-rate-swap', NOW);
    current = scheduleLapse(current, 'ir-swap-3', 'interest-rate-swap', NOW);
    current = scheduleLapse(current, 'ir-swap-3', 'interest-rate-swap', NOW);

    expect(current.lapses).toBe(3);
  });

  it('leaves the existing item untouched', () => {
    const existing = item({ step: 2, lapses: 1 });
    scheduleLapse(existing, 'ir-swap-3', 'interest-rate-swap', NOW);

    expect(existing).toEqual(item({ step: 2, lapses: 1 }));
  });
});

describe('schedulePromotion', () => {
  it('moves a first-step question onto the four-day interval', () => {
    const result = schedulePromotion(item({ step: 0 }), NOW);

    expect(result).toEqual({
      id: 'ir-swap-3',
      productId: 'interest-rate-swap',
      step: 1,
      updatedAt: NOW.getTime(),
      dueOn: '2026-08-17',
      lapses: 1,
    });
  });

  it('walks the rest of the ladder', () => {
    expect(schedulePromotion(item({ step: 1 }), NOW)?.dueOn).toBe('2026-08-23');
    expect(schedulePromotion(item({ step: 2 }), NOW)?.dueOn).toBe('2026-09-05');
    expect(schedulePromotion(item({ step: 3 }), NOW)?.dueOn).toBe('2026-10-05');
  });

  it('schedules the last step at the capped interval', () => {
    const result = schedulePromotion(item({ step: 4 }), NOW);

    expect(result?.step).toBe(5);
    expect(result?.dueOn).toBe(addDays(120, NOW));
  });

  it('retires the question once it has graduated', () => {
    // `null` is the queue's "remove me" signal — the caller drops the item
    // rather than storing a sentinel.
    expect(schedulePromotion(item({ step: 5 }), NOW)).toBeNull();
  });

  it('keeps the lapse count and product across a promotion', () => {
    const result = schedulePromotion(item({ step: 2, lapses: 4 }), NOW);

    expect(result?.lapses).toBe(4);
    expect(result?.productId).toBe('interest-rate-swap');
  });

  it('takes six correct answers in a row to retire a question', () => {
    let current: ReviewItem | null = scheduleLapse(
      undefined,
      'ir-swap-3',
      'interest-rate-swap',
      NOW,
    );
    let promotions = 0;

    while (current !== null) {
      current = schedulePromotion(current, NOW);
      promotions += 1;
    }

    expect(promotions).toBe(6);
  });

  it('leaves the item it was given untouched', () => {
    const existing = item({ step: 1 });
    schedulePromotion(existing, NOW);

    expect(existing).toEqual(item({ step: 1 }));
  });
});

describe('defaulting to today', () => {
  // Every other test passes `now` explicitly. These cover the defaults the
  // app itself relies on, with the clock pinned rather than trusted — a
  // suite that passes at 10am and fails at midnight is worse than none.
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('counts days from today', () => {
    expect(addDays(4)).toBe('2026-08-17');
  });

  it('queues a fresh lapse for tomorrow', () => {
    expect(scheduleLapse(undefined, 'fx-fwd-2', 'fx-forward').dueOn).toBe(
      '2026-08-14',
    );
  });

  it('promotes from today', () => {
    expect(schedulePromotion(item({ step: 0 }))?.dueOn).toBe('2026-08-17');
  });

  it('compares the queue against today', () => {
    const queue = [
      item({ id: 'a', dueOn: '2026-08-13' }),
      item({ id: 'b', dueOn: '2026-08-20' }),
    ];

    expect(isDue(queue[0])).toBe(true);
    expect(isDue(queue[1])).toBe(false);
    expect(dueItems(queue).map((entry) => entry.id)).toEqual(['a']);
    expect(nextDueDate(queue)).toBe('2026-08-20');
  });
});

describe('isDue', () => {
  it('is due on the day itself', () => {
    expect(isDue(item({ dueOn: '2026-08-13' }), '2026-08-13')).toBe(true);
  });

  it('is due once the date has passed', () => {
    expect(isDue(item({ dueOn: '2026-08-01' }), '2026-08-13')).toBe(true);
  });

  it('is not due before the date', () => {
    expect(isDue(item({ dueOn: '2026-08-14' }), '2026-08-13')).toBe(false);
  });

  it('compares across month and year boundaries', () => {
    // Date keys are compared as strings, which only works because they are
    // zero-padded — '2026-09-01' must not read as earlier than '2026-08-31'.
    expect(isDue(item({ dueOn: '2026-08-31' }), '2026-09-01')).toBe(true);
    expect(isDue(item({ dueOn: '2026-09-01' }), '2026-08-31')).toBe(false);
    expect(isDue(item({ dueOn: '2026-12-31' }), '2027-01-01')).toBe(true);
    expect(isDue(item({ dueOn: '2026-08-10' }), '2026-08-09')).toBe(false);
  });
});

describe('dueItems', () => {
  const queue: ReviewItem[] = [
    item({ id: 'a', dueOn: '2026-08-01' }),
    item({ id: 'b', dueOn: '2026-08-13' }),
    item({ id: 'c', dueOn: '2026-08-14' }),
    item({ id: 'd', dueOn: '2026-12-01' }),
  ];

  it('keeps only what has come due', () => {
    expect(dueItems(queue, '2026-08-13').map((entry) => entry.id)).toEqual([
      'a',
      'b',
    ]);
  });

  it('preserves the queue order', () => {
    expect(dueItems(queue, '2026-12-31').map((entry) => entry.id)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });

  it('returns nothing when the queue is all in the future', () => {
    expect(dueItems(queue, '2026-07-01')).toEqual([]);
  });

  it('handles an empty queue', () => {
    expect(dueItems([], '2026-08-13')).toEqual([]);
  });

  it('leaves the queue untouched', () => {
    const before = [...queue];
    dueItems(queue, '2026-08-13');

    expect(queue).toEqual(before);
  });
});

describe('nextDueDate', () => {
  const queue: ReviewItem[] = [
    item({ id: 'a', dueOn: '2026-08-01' }),
    item({ id: 'd', dueOn: '2026-12-01' }),
    item({ id: 'c', dueOn: '2026-08-14' }),
    item({ id: 'b', dueOn: '2026-09-02' }),
  ];

  it('returns the soonest date still ahead', () => {
    expect(nextDueDate(queue, '2026-08-13')).toBe('2026-08-14');
  });

  it('skips anything already due', () => {
    // The banner it feeds says "next review on …", so an overdue item is not
    // an answer — the user can sit that one now.
    expect(nextDueDate(queue, '2026-08-14')).toBe('2026-09-02');
  });

  it('returns null when everything is already due', () => {
    expect(nextDueDate(queue, '2027-01-01')).toBeNull();
  });

  it('returns null for an empty queue', () => {
    expect(nextDueDate([], '2026-08-13')).toBeNull();
  });

  it('leaves the queue order untouched', () => {
    const before = queue.map((entry) => entry.id);
    nextDueDate(queue, '2026-08-13');

    expect(queue.map((entry) => entry.id)).toEqual(before);
  });
});
