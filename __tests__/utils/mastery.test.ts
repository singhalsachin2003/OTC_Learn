import {
  applySession,
  averageMastery,
  countMastered,
  emptyProgress,
  LEARNING_RATE,
  MASTERY_COMPLETE,
  masteryBand,
  nextMastery,
  type ProductProgress,
} from '../../src/utils/mastery';

function progressAt(mastery: number): ProductProgress {
  return { ...emptyProgress, mastery, attempts: 1, bestScorePct: mastery };
}

describe('nextMastery', () => {
  it('moves toward the score rather than replacing it', () => {
    // The headline guarantee: one lucky run cannot mark a product mastered.
    expect(nextMastery(0, 100)).toBe(35);
    expect(nextMastery(0, 100)).toBeLessThan(100);
  });

  it('travels the learning rate’s share of the gap', () => {
    expect(nextMastery(40, 80)).toBe(Math.round(40 + 40 * LEARNING_RATE));
    expect(nextMastery(40, 80)).toBe(54);
  });

  it('converges upward over repeated perfect runs', () => {
    let mastery = 0;
    const trail: number[] = [];

    for (let run = 0; run < 6; run += 1) {
      mastery = nextMastery(mastery, 100);
      trail.push(mastery);
    }

    expect(trail).toEqual([35, 58, 73, 82, 88, 92]);
    expect(trail).toEqual([...trail].sort((a, b) => a - b));
  });

  it('needs three perfect runs to count a product complete', () => {
    // The learning rate is documented as "three runs to converge", and the
    // completion threshold is what the user actually sees move.
    const one = nextMastery(0, 100);
    const two = nextMastery(one, 100);
    const three = nextMastery(two, 100);

    expect(two).toBeLessThan(MASTERY_COMPLETE);
    expect(three).toBeGreaterThanOrEqual(MASTERY_COMPLETE);
  });

  it('lets a bad run dent mastery without wiping it', () => {
    expect(nextMastery(80, 0)).toBe(52);
  });

  it('clamps a score above 100', () => {
    expect(nextMastery(50, 150)).toBe(nextMastery(50, 100));
  });

  it('clamps a negative score', () => {
    expect(nextMastery(50, -20)).toBe(nextMastery(50, 0));
  });

  it('never leaves the 0–100 range', () => {
    for (let current = 0; current <= 100; current += 1) {
      for (const score of [0, 37, 100, 250, -80]) {
        const result = nextMastery(current, score);

        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);
      }
    }
  });

  it('returns whole numbers', () => {
    expect(Number.isInteger(nextMastery(33, 67))).toBe(true);
  });
});

describe('applySession', () => {
  it('starts from nothing when a product has no record yet', () => {
    const result = applySession(undefined, 100, '2026-08-13');

    expect(result).toEqual({
      mastery: 35,
      attempts: 1,
      bestScorePct: 100,
      lastStudiedOn: '2026-08-13',
    });
  });

  it('counts the attempt and stamps the study date', () => {
    const result = applySession(progressAt(40), 60, '2026-08-14');

    expect(result.attempts).toBe(2);
    expect(result.lastStudiedOn).toBe('2026-08-14');
  });

  it('raises the best score when the session beats it', () => {
    const result = applySession(progressAt(40), 90, '2026-08-14');

    expect(result.bestScorePct).toBe(90);
  });

  it('never lowers the best score', () => {
    // A personal best is a record of something that happened; a later bad
    // session does not undo it, even though mastery falls.
    const previous: ProductProgress = {
      mastery: 70,
      attempts: 4,
      bestScorePct: 100,
      lastStudiedOn: '2026-08-01',
    };
    const result = applySession(previous, 20, '2026-08-14');

    expect(result.bestScorePct).toBe(100);
    expect(result.mastery).toBeLessThan(previous.mastery);
  });

  it('rounds a fractional score into the best score', () => {
    expect(applySession(emptyProgress, 66.7, '2026-08-13').bestScorePct).toBe(67);
  });

  it('leaves the previous record untouched', () => {
    const previous = progressAt(40);
    applySession(previous, 90, '2026-08-14');

    expect(previous).toEqual(progressAt(40));
  });
});

describe('masteryBand', () => {
  it.each([
    [0, 'not started'],
    [1, 'shaky'],
    [34, 'shaky'],
    [35, 'building'],
    [69, 'building'],
    [70, 'strong'],
    [100, 'strong'],
  ])('calls %i %s', (mastery, band) => {
    expect(masteryBand(mastery)).toBe(band);
  });

  it('uses the completion threshold as the strong boundary', () => {
    expect(masteryBand(MASTERY_COMPLETE)).toBe('strong');
    expect(masteryBand(MASTERY_COMPLETE - 1)).toBe('building');
  });
});

describe('averageMastery', () => {
  const progress = {
    swaps: progressAt(80),
    options: progressAt(40),
  };

  it('averages across the products asked about', () => {
    expect(averageMastery(['swaps', 'options'], progress)).toBe(60);
  });

  it('counts an untouched product as zero rather than skipping it', () => {
    // Halfway through everything and finished with half of it are different
    // places, and only counting the untouched product says so.
    expect(averageMastery(['swaps', 'options', 'futures'], progress)).toBe(40);
  });

  it('returns 0 for an empty catalogue rather than NaN', () => {
    expect(averageMastery([], progress)).toBe(0);
  });

  it('rounds to a whole percentage', () => {
    expect(averageMastery(['swaps', 'options', 'futures'], progress)).toBe(
      Math.round(120 / 3),
    );
    expect(averageMastery(['swaps', 'futures'], progress)).toBe(40);
  });
});

describe('countMastered', () => {
  const progress = {
    swaps: progressAt(MASTERY_COMPLETE),
    options: progressAt(MASTERY_COMPLETE - 1),
    forwards: progressAt(100),
  };

  it('counts products at or above the completion threshold', () => {
    expect(countMastered(['swaps', 'options', 'forwards'], progress)).toBe(2);
  });

  it('ignores products with no progress at all', () => {
    expect(countMastered(['futures', 'swaptions'], progress)).toBe(0);
  });

  it('counts nothing for an empty list', () => {
    expect(countMastered([], progress)).toBe(0);
  });
});
