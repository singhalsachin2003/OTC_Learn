import {
  LEARNING_RATE,
  MASTERY_COMPLETE,
  nextMastery,
} from '../../src/utils/mastery';
import {
  accuracyByCategory,
  accuracyByStep,
  masteryDistribution,
  masteryWithinOneSession,
  MIN_CONFIDENT_SAMPLE,
  rankWeakest,
  recommendations,
  studyConsistency,
  type QuestionFacts,
  type RecommendationCandidate,
} from '../../src/utils/insights';
import type { ProductProgress } from '../../src/utils/mastery';

/**
 * A stand-in catalogue. The point of injecting the resolver is that these
 * tests never load `data/products`, so the facts are written out here.
 */
const FACTS: Record<string, QuestionFacts> = {
  'irs-1': { categoryId: 'ir', productId: 'irs', step: 1 },
  'irs-2': { categoryId: 'ir', productId: 'irs', step: 5 },
  'fra-1': { categoryId: 'ir', productId: 'fra', step: 5 },
  'fxfwd-1': { categoryId: 'fx', productId: 'fxfwd', step: 1 },
};

const resolve = (id: string): QuestionFacts | undefined => FACTS[id];

function progress(overrides: Partial<ProductProgress> = {}): ProductProgress {
  return {
    mastery: 0,
    attempts: 0,
    bestScorePct: 0,
    lastStudiedOn: null,
    updatedAt: 0,
    ...overrides,
  };
}

describe('accuracyByCategory', () => {
  it('sums right and wrong across every question in the category', () => {
    const [ir, fx] = accuracyByCategory(
      {
        'irs-1': { right: 3, wrong: 1 },
        'irs-2': { right: 1, wrong: 3 },
        'fxfwd-1': { right: 2, wrong: 0 },
      },
      resolve,
      ['ir', 'fx'],
    );

    expect(ir).toMatchObject({ categoryId: 'ir', answered: 8, correct: 4 });
    expect(ir.accuracyPercent).toBe(50);
    expect(fx).toMatchObject({ categoryId: 'fx', answered: 2, correct: 2 });
    expect(fx.accuracyPercent).toBe(100);
  });

  it('reports a category with no answers as zero rather than omitting it', () => {
    const buckets = accuracyByCategory({}, resolve, ['ir', 'fx']);

    expect(buckets).toHaveLength(2);
    expect(buckets.every((b) => b.answered === 0 && b.accuracyPercent === 0)).toBe(
      true,
    );
  });

  it('returns categories in the order given, not in answer order', () => {
    const buckets = accuracyByCategory(
      { 'fxfwd-1': { right: 1, wrong: 0 } },
      resolve,
      ['ir', 'fx'],
    );

    expect(buckets.map((b) => b.categoryId)).toEqual(['ir', 'fx']);
  });

  it('skips questions the catalogue no longer resolves', () => {
    const [ir] = accuracyByCategory(
      {
        'irs-1': { right: 1, wrong: 0 },
        'deleted-question': { right: 0, wrong: 9 },
      },
      resolve,
      ['ir'],
    );

    expect(ir).toMatchObject({ answered: 1, correct: 1 });
  });
});

describe('accuracyByStep', () => {
  it('aggregates the same step across different products', () => {
    const steps = accuracyByStep(
      {
        'irs-2': { right: 1, wrong: 3 },
        'fra-1': { right: 0, wrong: 4 },
        'irs-1': { right: 4, wrong: 0 },
      },
      resolve,
    );

    const step5 = steps.find((s) => s.step === 5);
    expect(step5).toMatchObject({ answered: 8, correct: 1 });
    expect(steps.find((s) => s.step === 1)).toMatchObject({
      answered: 4,
      correct: 4,
    });
  });

  it('always returns all five steps', () => {
    expect(accuracyByStep({}, resolve).map((s) => s.step)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('confidence floor', () => {
  it('marks a bucket confident only at or above the minimum sample', () => {
    const under = accuracyByCategory(
      { 'irs-1': { right: MIN_CONFIDENT_SAMPLE - 1, wrong: 0 } },
      resolve,
      ['ir'],
    );
    const at = accuracyByCategory(
      { 'irs-1': { right: MIN_CONFIDENT_SAMPLE, wrong: 0 } },
      resolve,
      ['ir'],
    );

    expect(under[0].confident).toBe(false);
    expect(at[0].confident).toBe(true);
  });

  it('drops unconfident buckets from the weakest ranking entirely', () => {
    const buckets = accuracyByCategory(
      {
        // 0% but off a single answer — noise, not a weakness.
        'fxfwd-1': { right: 0, wrong: 1 },
        // 50% off a real sample.
        'irs-1': { right: 5, wrong: 5 },
      },
      resolve,
      ['ir', 'fx'],
    );

    expect(rankWeakest(buckets, 5).map((b) => b.categoryId)).toEqual(['ir']);
  });

  it('orders the ranking worst first', () => {
    const buckets = accuracyByCategory(
      {
        'irs-1': { right: 9, wrong: 1 },
        'fxfwd-1': { right: 2, wrong: 8 },
      },
      resolve,
      ['ir', 'fx'],
    );

    expect(rankWeakest(buckets, 5).map((b) => b.categoryId)).toEqual(['fx', 'ir']);
  });
});

describe('masteryDistribution', () => {
  it('counts every product into exactly one band', () => {
    const counts = masteryDistribution(['a', 'b', 'c', 'd'], {
      a: progress({ mastery: 0 }),
      b: progress({ mastery: 20 }),
      c: progress({ mastery: 50 }),
      d: progress({ mastery: 90 }),
    });

    expect(counts).toEqual({
      'not started': 1,
      shaky: 1,
      building: 1,
      strong: 1,
    });
  });

  it('treats a product with no record as not started', () => {
    expect(masteryDistribution(['unseen'], {})['not started']).toBe(1);
  });
});

describe('masteryWithinOneSession', () => {
  it('is the lowest mastery from which a perfect session reaches the threshold', () => {
    const threshold = masteryWithinOneSession();

    expect(nextMastery(threshold, 100)).toBeGreaterThanOrEqual(MASTERY_COMPLETE);
    expect(nextMastery(threshold - 1, 100)).toBeLessThan(MASTERY_COMPLETE);
  });

  it('is derived from the learning rate rather than hardcoded', () => {
    // A faster learner needs less of a head start.
    expect(masteryWithinOneSession(0.5, MASTERY_COMPLETE)).toBeLessThan(
      masteryWithinOneSession(LEARNING_RATE, MASTERY_COMPLETE),
    );
  });
});

describe('recommendations', () => {
  const candidates: RecommendationCandidate[] = [
    { id: 'irs', categoryId: 'ir', foundational: true },
    { id: 'fra', categoryId: 'ir', foundational: false },
    { id: 'swaption', categoryId: 'ir', foundational: false },
    { id: 'fxfwd', categoryId: 'fx', foundational: true },
    { id: 'ndf', categoryId: 'fx', foundational: false },
  ];

  it('puts a product one session from the threshold first', () => {
    const nearly = masteryWithinOneSession();
    const result = recommendations(
      candidates,
      {
        // Shaky — lower mastery, but further from a finish.
        irs: progress({ mastery: 10, attempts: 2 }),
        swaption: progress({ mastery: nearly, attempts: 3 }),
      },
      5,
    );

    expect(result[0]).toMatchObject({
      productId: 'swaption',
      reason: 'nearly-there',
    });
  });

  it('does not recommend a product already at the threshold', () => {
    const result = recommendations(
      candidates,
      { irs: progress({ mastery: MASTERY_COMPLETE, attempts: 4 }) },
      5,
    );

    expect(result.map((r) => r.productId)).not.toContain('irs');
  });

  it('does not recommend a product that is merely building', () => {
    const building = 40;
    expect(building).toBeLessThan(masteryWithinOneSession());

    const result = recommendations(
      candidates,
      { irs: progress({ mastery: building, attempts: 2 }) },
      5,
    );

    expect(result.map((r) => r.productId)).not.toContain('irs');
  });

  it('prefers an untouched product in a category already started', () => {
    const result = recommendations(
      candidates,
      { irs: progress({ mastery: MASTERY_COMPLETE, attempts: 4 }) },
      5,
    );

    const continued = result.filter((r) => r.reason === 'continue-category');
    expect(continued.map((r) => r.productId).sort()).toEqual(['fra', 'swaption']);
    // FX is untouched, so its products can only appear as a cold start.
    expect(result.find((r) => r.productId === 'fxfwd')?.reason).toBe('start-here');
  });

  it('opens an untouched catalogue at foundational products only', () => {
    const result = recommendations(candidates, {}, 5);

    expect(result.every((r) => r.reason === 'start-here')).toBe(true);
    expect(result.map((r) => r.productId).sort()).toEqual(['fxfwd', 'irs']);
  });

  it('is stable across calls with identical input', () => {
    const state = {
      irs: progress({ mastery: 10, attempts: 1 }),
      fra: progress({ mastery: 12, attempts: 1 }),
    };

    expect(recommendations(candidates, state, 5)).toEqual(
      recommendations(candidates, state, 5),
    );
  });

  it('honours the limit', () => {
    expect(recommendations(candidates, {}, 1)).toHaveLength(1);
    expect(recommendations(candidates, {}, 0)).toHaveLength(0);
  });
});

describe('studyConsistency', () => {
  const NOW = new Date(2026, 7, 30, 9, 0);

  it('counts a window that includes today', () => {
    const result = studyConsistency(
      ['2026-08-30', '2026-08-29', '2026-08-24'],
      7,
      NOW,
    );

    // A seven-day window ending on the 30th opens on the 24th, so the 24th is
    // the inclusive boundary rather than the first day outside.
    expect(result).toEqual({ studied: 3, window: 7, percent: 43 });
  });

  it('excludes days older than the window', () => {
    expect(studyConsistency(['2026-08-01'], 7, NOW).studied).toBe(0);
  });

  it('excludes days in the future', () => {
    expect(studyConsistency(['2026-09-05'], 7, NOW).studied).toBe(0);
  });

  it('does not double-count a duplicated day', () => {
    expect(studyConsistency(['2026-08-30', '2026-08-30'], 7, NOW).studied).toBe(1);
  });

  it('reports a perfect week as 100', () => {
    const everyDay = [
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
      '2026-08-30',
    ];

    expect(studyConsistency(everyDay, 7, NOW).percent).toBe(100);
  });
});
