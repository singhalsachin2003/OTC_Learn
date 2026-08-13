import type {
  MultipleChoiceQuestion,
  Question,
  TrueFalseQuestion,
} from '../../src/data/types';
import {
  buildSession,
  correctAnswerLabel,
  DEFAULT_SESSION_SIZE,
  isCorrectAnswer,
  weightFor,
  type QuestionHistory,
} from '../../src/utils/quizSession';
import { seededRng } from '../../src/utils/shuffle';

function choice(id: string, correctIndex = 0): MultipleChoiceQuestion {
  return {
    id,
    step: 1,
    difficulty: 'foundational',
    explanation: 'The fixed leg is the one quoted.',
    kind: 'choice',
    prompt: `Which leg is quoted on ${id}?`,
    options: [`${id} one`, `${id} two`, `${id} three`, `${id} four`],
    correctIndex,
  };
}

function trueFalse(id: string, correctAnswer: boolean): TrueFalseQuestion {
  return {
    id,
    step: 2,
    difficulty: 'intermediate',
    explanation: 'Notional is never exchanged on a vanilla swap.',
    kind: 'boolean',
    prompt: 'Notional is exchanged at maturity.',
    correctAnswer,
  };
}

/** A bank deliberately larger than a sitting — the case selection exists for. */
function bankOf(size: number): Question[] {
  return Array.from({ length: size }, (_, index) => choice(`q${index}`));
}

const anyQuestion = choice('ir-swap-1');

describe('weightFor', () => {
  it('treats a question with no history as unseen', () => {
    expect(weightFor(anyQuestion, {})).toBe(3);
  });

  it('treats an empty tally as unseen', () => {
    // A stat row can exist with nothing in it — a session started and
    // abandoned — and that is still a question the user has never answered.
    const history: QuestionHistory = { 'ir-swap-1': { right: 0, wrong: 0 } };

    expect(weightFor(anyQuestion, history)).toBe(3);
  });

  it('weights a missed question above an unseen one', () => {
    const history: QuestionHistory = { 'ir-swap-1': { right: 1, wrong: 3 } };

    expect(weightFor(anyQuestion, history)).toBe(6);
  });

  it('counts a question answered as often wrong as right as missed', () => {
    // The tie goes to "ask it again": one lucky answer should not retire a
    // question the user has also got wrong.
    const history: QuestionHistory = { 'ir-swap-1': { right: 2, wrong: 2 } };

    expect(weightFor(anyQuestion, history)).toBe(6);
  });

  it('weights a known question lowest', () => {
    const history: QuestionHistory = { 'ir-swap-1': { right: 3, wrong: 0 } };

    expect(weightFor(anyQuestion, history)).toBe(1);
  });

  it('never returns zero, so nothing is retired from the bank', () => {
    const history: QuestionHistory = { 'ir-swap-1': { right: 99, wrong: 0 } };

    expect(weightFor(anyQuestion, history)).toBeGreaterThan(0);
  });

  it('ignores another question’s history', () => {
    const history: QuestionHistory = { elsewhere: { right: 0, wrong: 9 } };

    expect(weightFor(anyQuestion, history)).toBe(3);
  });
});

describe('buildSession', () => {
  it('returns exactly the requested number of questions', () => {
    const session = buildSession(bankOf(12), { size: 5, rng: seededRng(1) });

    expect(session).toHaveLength(5);
  });

  it('falls back to the default sitting size', () => {
    const session = buildSession(bankOf(12), { rng: seededRng(1) });

    expect(session).toHaveLength(DEFAULT_SESSION_SIZE);
  });

  it('clamps the size down to the bank', () => {
    // A short bank must not yield a short-by-surprise paper of `undefined`s.
    const session = buildSession(bankOf(3), { size: 10, rng: seededRng(1) });

    expect(session).toHaveLength(3);
  });

  it('returns nothing for an empty bank', () => {
    expect(buildSession([], { size: 6, rng: seededRng(1) })).toEqual([]);
  });

  it('clamps a negative size to nothing', () => {
    expect(buildSession(bankOf(5), { size: -3, rng: seededRng(1) })).toEqual([]);
  });

  it('draws a default paper with no options at all', () => {
    // Production calls this with nothing but the bank, so the all-defaults
    // path — Math.random, no history, default size — is the shipped one.
    const bank = bankOf(12);
    const ids = buildSession(bank).map((question) => question.id);

    expect(ids).toHaveLength(DEFAULT_SESSION_SIZE);
    expect(new Set(ids).size).toBe(DEFAULT_SESSION_SIZE);
  });

  it('never draws the same question twice', () => {
    // Sampling is without replacement, and a repeat inside one paper is
    // invisible until a user notices — no error is ever raised.
    const bank = bankOf(8);

    for (let seed = 1; seed <= 200; seed += 1) {
      const ids = buildSession(bank, { size: 8, rng: seededRng(seed) }).map(
        (question) => question.id,
      );

      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('draws every question when the whole bank is requested', () => {
    const bank = bankOf(6);
    const ids = buildSession(bank, { size: 6, rng: seededRng(17) })
      .map((question) => question.id)
      .sort();

    expect(ids).toEqual(bank.map((question) => question.id).sort());
  });

  it('draws missed questions far more often than known ones', () => {
    const bank = [
      choice('m0'),
      choice('m1'),
      choice('m2'),
      choice('k0'),
      choice('k1'),
      choice('k2'),
    ];
    const history: QuestionHistory = {
      m0: { right: 0, wrong: 2 },
      m1: { right: 1, wrong: 1 },
      m2: { right: 0, wrong: 5 },
      k0: { right: 3, wrong: 0 },
      k1: { right: 4, wrong: 1 },
      k2: { right: 2, wrong: 0 },
    };
    let missedDraws = 0;
    let knownDraws = 0;

    for (let seed = 1; seed <= 400; seed += 1) {
      for (const question of buildSession(bank, {
        size: 2,
        history,
        rng: seededRng(seed),
      })) {
        if (question.id.startsWith('m')) {
          missedDraws += 1;
        } else {
          knownDraws += 1;
        }
      }
    }

    expect(missedDraws).toBeGreaterThan(knownDraws * 2);
    // Weighting, not sorting: a known question still surfaces sometimes.
    expect(knownDraws).toBeGreaterThan(0);
  });

  it('draws unseen questions more often than known ones', () => {
    const bank = [choice('u0'), choice('u1'), choice('k0'), choice('k1')];
    const history: QuestionHistory = {
      k0: { right: 3, wrong: 0 },
      k1: { right: 3, wrong: 0 },
    };
    let unseenDraws = 0;
    let knownDraws = 0;

    for (let seed = 1; seed <= 400; seed += 1) {
      for (const question of buildSession(bank, {
        size: 1,
        history,
        rng: seededRng(seed),
      })) {
        if (question.id.startsWith('u')) {
          unseenDraws += 1;
        } else {
          knownDraws += 1;
        }
      }
    }

    expect(unseenDraws).toBeGreaterThan(knownDraws);
  });

  it('gives the same paper twice for the same seed', () => {
    const bank = bankOf(10);
    const first = buildSession(bank, { size: 4, rng: seededRng(99) });
    const second = buildSession(bank, { size: 4, rng: seededRng(99) });

    expect(first).toEqual(second);
  });

  it('gives different papers for different seeds', () => {
    const bank = bankOf(10);
    const papers = new Set<string>();

    for (let seed = 1; seed <= 20; seed += 1) {
      papers.add(
        buildSession(bank, { size: 4, rng: seededRng(seed) })
          .map((question) => question.id)
          .join('|'),
      );
    }

    expect(papers.size).toBeGreaterThan(1);
  });

  it('leaves the bank and its questions untouched', () => {
    // The bank is module-level catalogue data shared by every session, so a
    // mutating shuffle would corrupt every later attempt in the same run.
    const bank = bankOf(6);
    const snapshot = JSON.stringify(bank);

    buildSession(bank, { size: 6, rng: seededRng(5) });

    expect(JSON.stringify(bank)).toBe(snapshot);
  });

  it('keeps the correct option text after shuffling the options', () => {
    // The whole point of moving `correctIndex` with the options: marking is
    // done on the index, so a lost index silently marks right answers wrong.
    const bank = [choice('a', 0), choice('b', 1), choice('c', 2), choice('d', 3)];
    const expected = new Map(
      bank.map((question) => [
        question.id,
        question.options[question.correctIndex],
      ]),
    );

    for (let seed = 1; seed <= 100; seed += 1) {
      for (const question of buildSession(bank, {
        size: 4,
        rng: seededRng(seed),
      }) as MultipleChoiceQuestion[]) {
        expect(question.options[question.correctIndex]).toBe(
          expected.get(question.id),
        );
      }
    }
  });

  it('carries true/false questions through unchanged', () => {
    const bank = [trueFalse('tf0', true), trueFalse('tf1', false)];
    const session = buildSession(bank, { size: 2, rng: seededRng(3) });

    expect(session.map((question) => question.id).sort()).toEqual(['tf0', 'tf1']);
    expect(session).toEqual(expect.arrayContaining(bank));
  });
});

describe('isCorrectAnswer', () => {
  it('marks a true/false answer against the stored boolean', () => {
    const question = trueFalse('tf', false);

    expect(isCorrectAnswer(question, false)).toBe(true);
    expect(isCorrectAnswer(question, true)).toBe(false);
  });

  it('marks a multiple choice answer against the correct index', () => {
    const question = choice('mc', 2);

    expect(isCorrectAnswer(question, 2)).toBe(true);
    expect(isCorrectAnswer(question, 0)).toBe(false);
  });

  it('does not accept a boolean as an index, or the reverse', () => {
    // Both kinds are answered through one handler, so a mixed-up payload has
    // to be rejected rather than coerced — `false` must not pass as index 0.
    expect(isCorrectAnswer(choice('mc', 0), false)).toBe(false);
    expect(isCorrectAnswer(trueFalse('tf', false), 0)).toBe(false);
  });
});

describe('correctAnswerLabel', () => {
  it('names the true/false answer in words', () => {
    expect(correctAnswerLabel(trueFalse('tf', true))).toBe('True');
    expect(correctAnswerLabel(trueFalse('tf', false))).toBe('False');
  });

  it('returns the correct option text for a multiple choice question', () => {
    expect(correctAnswerLabel(choice('mc', 3))).toBe('mc four');
  });

  it('reads the label from the shuffled options, not the authored ones', () => {
    const question = choice('mc', 0);
    const [shuffledQuestion] = buildSession([question], {
      size: 1,
      rng: seededRng(21),
    });

    expect(correctAnswerLabel(shuffledQuestion)).toBe('mc one');
  });
});
