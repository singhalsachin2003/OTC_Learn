import reducer, {
  applyReviewResult,
  initialReviewState,
  resetReview,
  setReviewLoading,
  setReviewQueue,
  type ReviewState,
} from '../../src/store/slices/reviewSlice';
import type { ReviewItem } from '../../src/utils/review';

/**
 * Midday local time, so the date arithmetic in `addDays` cannot be nudged over
 * a boundary by a daylight-saving shift of an hour either way.
 */
const NOW = new Date(2026, 7, 12, 12, 0, 0).getTime();

function queued(...items: ReviewItem[]): ReviewState {
  return { ...initialReviewState, queue: items };
}

function item(overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    id: 'irs-q1',
    productId: 'irs',
    step: 0,
    dueOn: '2026-08-12',
    lapses: 1,
    updatedAt: 0,
    ...overrides,
  };
}

describe('reviewSlice', () => {
  it('starts with an empty queue', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialReviewState);
  });
});

describe('reviewSlice wrong answers', () => {
  it('queues a question the first time it is missed', () => {
    const state = reducer(
      initialReviewState,
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: false,
        now: NOW,
      }),
    );

    expect(state.queue).toEqual([
      {
        id: 'irs-q1',
        productId: 'irs',
        step: 0,
        dueOn: '2026-08-13',
        lapses: 1,
        updatedAt: NOW,
      },
    ]);
  });

  it('sends a queued question back to the start of the ladder', () => {
    const state = reducer(
      queued(item({ step: 2, dueOn: '2026-08-12' })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: false,
        now: NOW,
      }),
    );

    expect(state.queue).toHaveLength(1);
    expect(state.queue[0].step).toBe(0);
    expect(state.queue[0].dueOn).toBe('2026-08-13');
  });

  // The lapse count is what marks a question as persistently difficult, so it
  // survives the reset rather than starting over with the schedule.
  it('increments the lapse count on every miss', () => {
    let state = queued(item({ step: 1, lapses: 2 }));
    state = reducer(
      state,
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: false,
        now: NOW,
      }),
    );

    expect(state.queue[0].lapses).toBe(3);
  });

  it('leaves the other queued questions untouched', () => {
    const other = item({ id: 'cds-q4', productId: 'cds', step: 2, lapses: 5 });
    const state = reducer(
      queued(other),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: false,
        now: NOW,
      }),
    );

    expect(state.queue).toHaveLength(2);
    expect(state.queue[0]).toEqual(other);
    expect(state.queue[1].id).toBe('irs-q1');
  });
});

describe('reviewSlice right answers', () => {
  it('promotes a queued question to the next interval', () => {
    const state = reducer(
      queued(item({ step: 0 })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue).toHaveLength(1);
    expect(state.queue[0].step).toBe(1);
    // The second rung of the fixed ladder is four days out.
    expect(state.queue[0].dueOn).toBe('2026-08-16');
  });

  it('widens the interval further up the ladder', () => {
    const state = reducer(
      queued(item({ step: 2 })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue[0].step).toBe(3);
    // Past the fixed ladder the ease factor takes over: 10 days × 2.3 ≈ 23.
    expect(state.queue[0].dueOn).toBe('2026-09-04');
  });

  it('carries the lapse count through a promotion', () => {
    const state = reducer(
      queued(item({ step: 1, lapses: 4 })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue[0].lapses).toBe(4);
  });

  // Only mistakes put a question in the queue; getting an unqueued question
  // right must not schedule one.
  it('does nothing for a question that was never queued', () => {
    const state = reducer(
      initialReviewState,
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue).toEqual([]);
  });

  it('leaves the rest of the queue alone when an unqueued question is right', () => {
    const other = item({ id: 'cds-q4', productId: 'cds' });
    const state = reducer(
      queued(other),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue).toEqual([other]);
  });

  it('retires a question once it has run out the graduation steps', () => {
    const state = reducer(
      queued(item({ step: 5 })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue).toEqual([]);
  });

  it('removes only the graduating question from a longer queue', () => {
    const other = item({ id: 'cds-q4', productId: 'cds', step: 1 });
    const state = reducer(
      queued(other, item({ step: 5 })),
      applyReviewResult({
        questionId: 'irs-q1',
        productId: 'irs',
        correct: true,
        now: NOW,
      }),
    );

    expect(state.queue).toEqual([other]);
  });

  it('takes a question from its first miss all the way to graduation', () => {
    const miss = applyReviewResult({
      questionId: 'irs-q1',
      productId: 'irs',
      correct: false,
      now: NOW,
    });
    const hit = applyReviewResult({
      questionId: 'irs-q1',
      productId: 'irs',
      correct: true,
      now: NOW,
    });

    let state = reducer(initialReviewState, miss);
    for (let pass = 0; pass < 5; pass += 1) {
      state = reducer(state, hit);
      expect(state.queue).toHaveLength(1);
    }

    expect(reducer(state, hit).queue).toEqual([]);
  });
});

describe('reviewSlice hydration', () => {
  it('replaces the queue wholesale', () => {
    const stored = [item({ step: 3, dueOn: '2026-09-04' })];

    expect(reducer(initialReviewState, setReviewQueue(stored)).queue).toEqual(
      stored,
    );
  });

  it('tracks the hydration flag', () => {
    const loading = reducer(initialReviewState, setReviewLoading(true));

    expect(loading.loading).toBe(true);
    expect(reducer(loading, setReviewLoading(false)).loading).toBe(false);
  });

  it('empties the queue on reset', () => {
    const state = reducer(initialReviewState, setReviewQueue([item()]));

    expect(reducer(state, resetReview())).toEqual(initialReviewState);
  });
});
