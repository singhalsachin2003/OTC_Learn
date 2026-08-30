import type { Question } from '../../src/data/types';
import {
  bestResultFor,
  buildExamPaper,
  EXAM_PASS_MARK,
  gradeExam,
  SECONDS_PER_QUESTION,
  sortResults,
  timeLimitFor,
  type ExamQuestionFacts,
  type ExamResult,
  type ExamSource,
} from '../../src/utils/exam';
import { seededRng } from '../../src/utils/shuffle';

/** A bank of `n` true/false questions for `productId`, ids `p-1`, `p-2`, … */
function bank(productId: string, n: number): Question[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `${productId}-${i + 1}`,
    kind: 'boolean' as const,
    step: ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5,
    difficulty: 'intermediate' as const,
    prompt: `${productId} question ${i + 1}`,
    correctAnswer: true,
    explanation: 'because',
  }));
}

function source(productId: string, categoryId: string, n: number): ExamSource {
  return { productId, categoryId, questions: bank(productId, n) };
}

const SOURCES: ExamSource[] = [
  source('irs', 'ir', 12),
  source('fra', 'ir', 12),
  source('fxfwd', 'fx', 12),
];

describe('buildExamPaper', () => {
  it('draws the requested number of questions', () => {
    expect(buildExamPaper(SOURCES, 9, seededRng(1)).questions).toHaveLength(9);
  });

  it('never repeats a question', () => {
    const { questions } = buildExamPaper(SOURCES, 30, seededRng(2));
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });

  /**
   * The reason exams round-robin rather than sampling flat. With 36 questions
   * across three products, an even draw of 9 gives each product exactly 3.
   */
  it('spreads evenly across products rather than clustering', () => {
    const { questions } = buildExamPaper(SOURCES, 9, seededRng(3));

    const perProduct = new Map<string, number>();
    for (const question of questions) {
      const product = question.id.split('-')[0];
      perProduct.set(product, (perProduct.get(product) ?? 0) + 1);
    }

    expect([...perProduct.values()].sort()).toEqual([3, 3, 3]);
  });

  it('holds the spread even when the count does not divide evenly', () => {
    const { questions } = buildExamPaper(SOURCES, 10, seededRng(4));

    const perProduct = new Map<string, number>();
    for (const question of questions) {
      const product = question.id.split('-')[0];
      perProduct.set(product, (perProduct.get(product) ?? 0) + 1);
    }

    // Ten across three products can only be 4/3/3 if the draw is round-robin.
    expect([...perProduct.values()].sort()).toEqual([3, 3, 4]);
  });

  /**
   * The distinction from `buildSession`, asserted directly: an exam must not
   * favour anything, so the draw takes no history argument at all and two
   * different seeds must be able to produce different papers.
   */
  it('is unbiased — a different seed gives a different paper', () => {
    const a = buildExamPaper(SOURCES, 9, seededRng(5)).questions.map((q) => q.id);
    const b = buildExamPaper(SOURCES, 9, seededRng(99)).questions.map((q) => q.id);

    expect(a).not.toEqual(b);
  });

  it('is deterministic for a given seed', () => {
    const a = buildExamPaper(SOURCES, 9, seededRng(7)).questions.map((q) => q.id);
    const b = buildExamPaper(SOURCES, 9, seededRng(7)).questions.map((q) => q.id);

    expect(a).toEqual(b);
  });

  it('yields a shorter paper rather than repeating when the scope is small', () => {
    const small = [source('irs', 'ir', 4)];
    const { questions } = buildExamPaper(small, 20, seededRng(8));

    expect(questions).toHaveLength(4);
    expect(new Set(questions.map((q) => q.id)).size).toBe(4);
  });

  it('skips products with an empty bank', () => {
    const withEmpty = [
      ...SOURCES,
      { productId: 'x', categoryId: 'ir', questions: [] },
    ];
    const { productIds } = buildExamPaper(withEmpty, 9, seededRng(9));

    expect(productIds).not.toContain('x');
  });

  it('reports which products it drew from', () => {
    expect(buildExamPaper(SOURCES, 9, seededRng(10)).productIds).toEqual([
      'fra',
      'fxfwd',
      'irs',
    ]);
  });

  it('sets a time limit from the paper actually drawn, not the request', () => {
    const small = [source('irs', 'ir', 4)];
    const paper = buildExamPaper(small, 20, seededRng(11));

    expect(paper.timeLimitMs).toBe(timeLimitFor(4));
    expect(paper.timeLimitMs).toBe(4 * SECONDS_PER_QUESTION * 1000);
  });

  it('handles a request for nothing', () => {
    expect(buildExamPaper(SOURCES, 0, seededRng(12)).questions).toHaveLength(0);
  });
});

describe('gradeExam', () => {
  const FACTS: Record<string, ExamQuestionFacts> = {
    'irs-1': { categoryId: 'ir', step: 1 },
    'irs-2': { categoryId: 'ir', step: 5 },
    'fxfwd-1': { categoryId: 'fx', step: 1 },
    'fxfwd-2': { categoryId: 'fx', step: 5 },
  };
  const resolve = (id: string) => FACTS[id];

  it('scores the paper', () => {
    const grade = gradeExam(
      [
        { questionId: 'irs-1', correct: true },
        { questionId: 'irs-2', correct: true },
        { questionId: 'fxfwd-1', correct: true },
        { questionId: 'fxfwd-2', correct: false },
      ],
      resolve,
    );

    expect(grade).toMatchObject({ correct: 3, total: 4, scorePct: 75 });
  });

  it('passes at the mastery threshold and fails below it', () => {
    const at = gradeExam(
      Array.from({ length: 10 }, (_, i) => ({
        questionId: 'irs-1',
        correct: i < EXAM_PASS_MARK / 10,
      })),
      resolve,
    );
    const below = gradeExam(
      Array.from({ length: 10 }, (_, i) => ({
        questionId: 'irs-1',
        correct: i < EXAM_PASS_MARK / 10 - 1,
      })),
      resolve,
    );

    expect(at.passed).toBe(true);
    expect(below.passed).toBe(false);
  });

  it('breaks the result down by category', () => {
    const grade = gradeExam(
      [
        { questionId: 'irs-1', correct: true },
        { questionId: 'irs-2', correct: false },
        { questionId: 'fxfwd-1', correct: true },
      ],
      resolve,
    );

    expect(grade.byCategory).toEqual([
      { key: 'fx', correct: 1, total: 1, scorePct: 100 },
      { key: 'ir', correct: 1, total: 2, scorePct: 50 },
    ]);
  });

  it('breaks the result down by lesson step', () => {
    const grade = gradeExam(
      [
        { questionId: 'irs-1', correct: true },
        { questionId: 'fxfwd-1', correct: false },
        { questionId: 'irs-2', correct: false },
      ],
      resolve,
    );

    expect(grade.byStep).toEqual([
      { key: '1', correct: 1, total: 2, scorePct: 50 },
      { key: '5', correct: 0, total: 1, scorePct: 0 },
    ]);
  });

  /**
   * An exam is a sample. Reporting a category the paper never asked about —
   * even as a zero — would read as a result rather than as an absence.
   */
  it('omits categories the paper never asked about', () => {
    const grade = gradeExam([{ questionId: 'irs-1', correct: true }], resolve);

    expect(grade.byCategory.map((row) => row.key)).toEqual(['ir']);
  });

  it('still counts an unresolvable question toward the score', () => {
    const grade = gradeExam(
      [
        { questionId: 'irs-1', correct: true },
        { questionId: 'removed-from-catalogue', correct: false },
      ],
      resolve,
    );

    expect(grade).toMatchObject({ correct: 1, total: 2, scorePct: 50 });
    expect(grade.byCategory).toEqual([
      { key: 'ir', correct: 1, total: 1, scorePct: 100 },
    ]);
  });

  /**
   * The trap a timed exam sets: scoring only what was answered turns "two right
   * then the clock ran out" into a perfect paper.
   */
  it('counts unanswered questions against the score', () => {
    const grade = gradeExam(
      [
        { questionId: 'irs-1', correct: true },
        { questionId: 'irs-2', correct: true },
      ],
      resolve,
      8,
    );

    expect(grade).toMatchObject({ correct: 2, total: 10, scorePct: 20 });
    expect(grade.passed).toBe(false);
  });

  it('keeps unanswered questions out of the breakdowns', () => {
    const grade = gradeExam([{ questionId: 'irs-1', correct: true }], resolve, 5);

    // The breakdown reports what was answered; the denominator reports the paper.
    expect(grade.byCategory).toEqual([
      { key: 'ir', correct: 1, total: 1, scorePct: 100 },
    ]);
    expect(grade.total).toBe(6);
  });

  it('ignores a negative unanswered count', () => {
    expect(
      gradeExam([{ questionId: 'irs-1', correct: true }], resolve, -3),
    ).toMatchObject({ total: 1, scorePct: 100 });
  });

  it('does not pass an empty paper', () => {
    expect(gradeExam([], resolve)).toMatchObject({
      total: 0,
      scorePct: 0,
      passed: false,
    });
  });
});

describe('exam history', () => {
  function result(overrides: Partial<ExamResult> = {}): ExamResult {
    return {
      takenOn: '2026-08-30',
      scopeId: 'ir',
      correct: 7,
      total: 10,
      scorePct: 70,
      passed: true,
      durationMs: 60_000,
      ...overrides,
    };
  }

  it('sorts newest first', () => {
    const sorted = sortResults([
      result({ takenOn: '2026-08-01' }),
      result({ takenOn: '2026-08-30' }),
      result({ takenOn: '2026-08-15' }),
    ]);

    expect(sorted.map((r) => r.takenOn)).toEqual([
      '2026-08-30',
      '2026-08-15',
      '2026-08-01',
    ]);
  });

  it('does not mutate the list it was given', () => {
    const original = [
      result({ takenOn: '2026-08-01' }),
      result({ takenOn: '2026-08-30' }),
    ];
    sortResults(original);

    expect(original[0].takenOn).toBe('2026-08-01');
  });

  it('finds the best score for a scope', () => {
    const best = bestResultFor(
      [
        result({ scopeId: 'ir', scorePct: 60 }),
        result({ scopeId: 'ir', scorePct: 90 }),
        result({ scopeId: 'fx', scorePct: 100 }),
      ],
      'ir',
    );

    expect(best?.scorePct).toBe(90);
  });

  it('returns null for a scope never sat', () => {
    expect(bestResultFor([result({ scopeId: 'ir' })], 'credit')).toBeNull();
  });
});
