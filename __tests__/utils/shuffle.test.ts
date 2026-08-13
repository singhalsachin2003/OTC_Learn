import type {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
} from '../../src/data/types';
import { seededRng, shuffled, shuffleOptions } from '../../src/utils/shuffle';

function choiceQuestion(
  options: string[],
  correctIndex: number,
): MultipleChoiceQuestion {
  return {
    id: 'ir-swap-1',
    step: 1,
    difficulty: 'foundational',
    explanation: 'The fixed leg is the one quoted.',
    kind: 'choice',
    prompt: 'Which leg is quoted?',
    options,
    correctIndex,
  };
}

const trueFalseQuestion: TrueFalseQuestion = {
  id: 'ir-swap-2',
  step: 2,
  difficulty: 'intermediate',
  explanation: 'Notional is never exchanged on a vanilla swap.',
  kind: 'boolean',
  prompt: 'Notional is exchanged at maturity.',
  correctAnswer: false,
};

const WORDS = ['Alpha', 'Bravo', 'Charlie', 'Delta'];

describe('shuffled', () => {
  it('returns a new array and leaves the input untouched', () => {
    const input = [...WORDS];
    const result = shuffled(input, seededRng(3));

    expect(result).not.toBe(input);
    expect(input).toEqual(WORDS);
  });

  it('keeps every member exactly once', () => {
    // Membership is the property that fails silently: a permutation that
    // drops or duplicates an entry still renders, it just asks the wrong
    // question. Duplicates in the input make this a multiset comparison.
    const input = ['a', 'b', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

    for (let seed = 1; seed <= 50; seed += 1) {
      const result = shuffled(input, seededRng(seed));
      expect(result).toHaveLength(input.length);
      expect([...result].sort()).toEqual([...input].sort());
    }
  });

  it('produces the same permutation for a given seed', () => {
    expect(shuffled(WORDS, seededRng(7))).toEqual([
      'Delta',
      'Bravo',
      'Charlie',
      'Alpha',
    ]);
    expect(shuffled(WORDS, seededRng(42))).toEqual([
      'Charlie',
      'Delta',
      'Alpha',
      'Bravo',
    ]);
  });

  it('gives different seeds different permutations', () => {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(shuffled(digits, seededRng(1))).not.toEqual(
      shuffled(digits, seededRng(2)),
    );
  });

  it('handles empty and single-item lists', () => {
    expect(shuffled([], seededRng(1))).toEqual([]);
    expect(shuffled(['only'], seededRng(1))).toEqual(['only']);
  });

  it('falls back to Math.random when no generator is supplied', () => {
    // Production passes no rng, so the default path is the one that ships.
    const result = shuffled(WORDS);

    expect([...result].sort()).toEqual([...WORDS].sort());
    expect(WORDS).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
  });
});

describe('seededRng', () => {
  it('repeats its sequence for the same seed', () => {
    const a = seededRng(2024);
    const b = seededRng(2024);
    const first = [a(), a(), a(), a(), a()];
    const second = [b(), b(), b(), b(), b()];

    expect(first).toEqual(second);
  });

  it('stays within the half-open unit interval', () => {
    const rng = seededRng(11);

    for (let i = 0; i < 500; i += 1) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('treats a seed of zero as one', () => {
    // `seed >>> 0 || 1` guards a zero seed, which would otherwise leave the
    // generator in a degenerate state.
    const zero = seededRng(0);
    const one = seededRng(1);

    expect([zero(), zero(), zero()]).toEqual([one(), one(), one()]);
  });
});

describe('shuffleOptions', () => {
  it('moves the correct index with the options', () => {
    const question = choiceQuestion([...WORDS], 0);
    const result = shuffleOptions(question, seededRng(7)) as MultipleChoiceQuestion;

    expect(result.options).toEqual(['Delta', 'Bravo', 'Charlie', 'Alpha']);
    expect(result.correctIndex).toBe(3);
  });

  it('keeps the correct option text unchanged for every seed', () => {
    // The index is an implementation detail; the text is what the user sees
    // marked right or wrong, so it is the text that must survive the shuffle.
    for (let correctIndex = 0; correctIndex < WORDS.length; correctIndex += 1) {
      const question = choiceQuestion([...WORDS], correctIndex);
      const expected = WORDS[correctIndex];

      for (let seed = 1; seed <= 60; seed += 1) {
        const result = shuffleOptions(
          question,
          seededRng(seed),
        ) as MultipleChoiceQuestion;

        expect(result.options[result.correctIndex]).toBe(expected);
        expect([...result.options].sort()).toEqual([...WORDS].sort());
      }
    }
  });

  it('actually reorders the options for at least some seeds', () => {
    const question = choiceQuestion([...WORDS], 1);
    const orders = new Set<string>();

    for (let seed = 1; seed <= 30; seed += 1) {
      const result = shuffleOptions(
        question,
        seededRng(seed),
      ) as MultipleChoiceQuestion;
      orders.add(result.options.join('|'));
    }

    expect(orders.size).toBeGreaterThan(1);
  });

  it('leaves the question it was given untouched', () => {
    const question = choiceQuestion([...WORDS], 2);
    shuffleOptions(question, seededRng(9));

    expect(question.options).toEqual(WORDS);
    expect(question.correctIndex).toBe(2);
  });

  it('falls back to Math.random when no generator is supplied', () => {
    const question = choiceQuestion([...WORDS], 2);
    const result = shuffleOptions(question) as MultipleChoiceQuestion;

    expect(result.options[result.correctIndex]).toBe('Charlie');
    expect([...result.options].sort()).toEqual([...WORDS].sort());
  });

  it('returns true/false questions unchanged', () => {
    expect(shuffleOptions(trueFalseQuestion, seededRng(5))).toBe(trueFalseQuestion);
  });

  it('leaves a percentage ladder in its authored order', () => {
    const question = choiceQuestion(['1%', '2%', '3%', '4%'], 1);

    expect(shuffleOptions(question, seededRng(4))).toBe(question);
  });

  it('leaves a money ladder in its authored order', () => {
    const question = choiceQuestion(['$1m', '$2m', '$5m', '$10m'], 3);

    expect(shuffleOptions(question, seededRng(4))).toBe(question);
  });

  it.each([
    ['plain numbers', ['1', '2', '5', '10']],
    ['basis points', ['25 bps', '50 bps', '75bp', '100 bps']],
    ['grouped and signed amounts', ['-1,000', '+2,500.50', '£3,000', '€4,000']],
    ['billions and thousands', ['5k', '10m', '20bn', '30k']],
  ])('leaves an ordinal set of %s alone', (_label, options) => {
    const question = choiceQuestion(options, 0);

    expect(shuffleOptions(question, seededRng(8))).toBe(question);
  });

  it('shuffles when only some of the options are numeric', () => {
    // A single prose option means the set no longer reads as a sequence, so
    // position is a giveaway again and the shuffle should apply.
    const options = ['1%', '2%', 'None of these', '4%'];
    const question = choiceQuestion(options, 2);
    const orders = new Set<string>();

    for (let seed = 1; seed <= 30; seed += 1) {
      const result = shuffleOptions(
        question,
        seededRng(seed),
      ) as MultipleChoiceQuestion;
      expect(result.options[result.correctIndex]).toBe('None of these');
      orders.add(result.options.join('|'));
    }

    expect(orders.size).toBeGreaterThan(1);
  });
});
