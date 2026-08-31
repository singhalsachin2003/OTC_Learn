import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import { nextOnPath, pathProgress, pathSteps } from '../../src/utils/paths';

const PATH = ['a', 'b', 'c', 'd'];

/** Mastery for the ids listed; everything else untouched. */
function mastery(scores: Record<string, number>) {
  return (id: string) => scores[id] ?? 0;
}

describe('pathSteps', () => {
  it('makes the first product current on a fresh start', () => {
    const steps = pathSteps(PATH, mastery({}));

    expect(steps.map((s) => s.state)).toEqual([
      'current',
      'upcoming',
      'upcoming',
      'upcoming',
    ]);
  });

  it('numbers steps from one', () => {
    expect(pathSteps(PATH, mastery({})).map((s) => s.position)).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it('moves current along as products are mastered', () => {
    const steps = pathSteps(PATH, mastery({ a: MASTERY_COMPLETE, b: 100 }));

    expect(steps.map((s) => s.state)).toEqual([
      'done',
      'done',
      'current',
      'upcoming',
    ]);
  });

  /**
   * Nothing here locks a product, so someone who skipped ahead really has done
   * that one — and "what now" is still the first thing they have not.
   */
  it('counts a product mastered out of order as done, and points at the gap', () => {
    const steps = pathSteps(PATH, mastery({ d: 100 }));

    expect(steps.map((s) => s.state)).toEqual([
      'current',
      'upcoming',
      'upcoming',
      'done',
    ]);
  });

  it('treats a product just short of the threshold as unfinished', () => {
    const steps = pathSteps(PATH, mastery({ a: MASTERY_COMPLETE - 1 }));

    expect(steps[0].state).toBe('current');
  });

  it('leaves nothing current once the path is finished', () => {
    const steps = pathSteps(PATH, mastery({ a: 100, b: 100, c: 100, d: 100 }));

    expect(steps.every((s) => s.state === 'done')).toBe(true);
  });

  it("carries each product's mastery through", () => {
    expect(pathSteps(PATH, mastery({ b: 42 }))[1].mastery).toBe(42);
  });
});

describe('nextOnPath', () => {
  it('is the first unmastered product', () => {
    expect(nextOnPath(PATH, mastery({ a: 100 }))).toBe('b');
  });

  it('is null once everything is mastered', () => {
    expect(
      nextOnPath(PATH, mastery({ a: 100, b: 100, c: 100, d: 100 })),
    ).toBeNull();
  });

  it('is null for an empty path', () => {
    expect(nextOnPath([], mastery({}))).toBeNull();
  });
});

describe('pathProgress', () => {
  it('counts mastered products, wherever they sit', () => {
    expect(pathProgress(PATH, mastery({ a: 100, d: 100 }))).toEqual({
      completed: 2,
      total: 4,
      percent: 50,
    });
  });

  it('is zero on a fresh path', () => {
    expect(pathProgress(PATH, mastery({}))).toMatchObject({
      completed: 0,
      percent: 0,
    });
  });

  /** A ratio and a label that disagreed would be worse than either alone. */
  it('rounds to whole per cent', () => {
    expect(pathProgress(['a', 'b', 'c'], mastery({ a: 100 })).percent).toBe(33);
  });

  it('returns zero rather than NaN for an empty path', () => {
    expect(pathProgress([], mastery({}))).toEqual({
      completed: 0,
      total: 0,
      percent: 0,
    });
  });
});
