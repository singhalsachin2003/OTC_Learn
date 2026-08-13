import { categories } from '../../src/data/categories';
import { products, TOTAL_PRODUCTS } from '../../src/data/products';
import {
  isBooleanQuestion,
  isChoiceQuestion,
  type LessonStepNumber,
} from '../../src/data/types';

/**
 * Structural guards on the content catalogue. The screens are data-driven, so
 * a malformed product surfaces as a blank or broken screen rather than a type
 * error — these assertions catch that at build time instead.
 *
 * The quiz assertions matter more since sessions draw a random subset: a bank
 * that is short, lopsided or all one answer produces a bad paper only
 * sometimes, which is exactly the kind of defect a spot check misses.
 */
describe('product catalogue', () => {
  it('gives every product a unique id', () => {
    const ids = products.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every quiz question a unique id', () => {
    const ids = products.flatMap((product) =>
      product.quiz.map((question) => question.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('points every product at a category that exists', () => {
    const categoryIds = new Set(categories.map((category) => category.id));
    const orphans = products.filter(
      (product) => !categoryIds.has(product.categoryId),
    );
    expect(orphans).toEqual([]);
  });

  it('gives every category at least one product', () => {
    const empty = categories.filter(
      (category) => !products.some((product) => product.categoryId === category.id),
    );
    expect(empty).toEqual([]);
  });

  it('numbers lesson steps consecutively from 1', () => {
    const misnumbered = products.filter((product) =>
      product.lessons.some((lesson, index) => lesson.step !== index + 1),
    );
    expect(misnumbered.map((product) => product.id)).toEqual([]);
  });

  it('gives every product the same number of lessons and questions', () => {
    const [first] = products;
    const lessonCount = first.lessons.length;
    const quizCount = first.quiz.length;

    const odd = products.filter(
      (product) =>
        product.lessons.length !== lessonCount || product.quiz.length !== quizCount,
    );
    expect(odd.map((product) => product.id)).toEqual([]);
  });

  it('leaves no authored text empty', () => {
    const blanks = products.filter(
      (product) =>
        product.hook.trim() === '' ||
        product.summary.trim() === '' ||
        product.inPractice.trim() === '' ||
        product.lessons.some(
          (lesson) =>
            lesson.title.trim() === '' ||
            lesson.content.trim() === '' ||
            lesson.callout?.trim() === '',
        ) ||
        product.keyTerms.some(
          (term) => term.term.trim() === '' || term.definition.trim() === '',
        ) ||
        product.example.lines.some((line) => line.trim() === '') ||
        product.quiz.some(
          (question) =>
            question.prompt.trim() === '' || question.explanation.trim() === '',
        ),
    );
    expect(blanks.map((product) => product.id)).toEqual([]);
  });

  describe('product detail', () => {
    it('gives every product six key terms', () => {
      const wrong = products.filter((product) => product.keyTerms.length !== 6);
      expect(wrong.map((product) => product.id)).toEqual([]);
    });

    it('gives every product a worked example with at least three lines', () => {
      const thin = products.filter(
        (product) =>
          product.example.title.trim() === '' ||
          product.example.lines.length < 3 ||
          product.example.takeaway.trim() === '',
      );
      expect(thin.map((product) => product.id)).toEqual([]);
    });

    it('resolves every related product id, and never self-references', () => {
      const ids = new Set(products.map((product) => product.id));
      const broken = products.filter(
        (product) =>
          product.relatedProductIds.length === 0 ||
          product.relatedProductIds.some(
            (related) => !ids.has(related) || related === product.id,
          ),
      );
      expect(broken.map((product) => product.id)).toEqual([]);
    });
  });

  describe('question banks', () => {
    it('gives every product twelve questions', () => {
      const wrong = products.filter((product) => product.quiz.length !== 12);
      expect(wrong.map((product) => product.id)).toEqual([]);
    });

    it('mixes true/false and multiple choice within every bank', () => {
      const oneKind = products.filter((product) => {
        const kinds = new Set(product.quiz.map((question) => question.kind));
        return kinds.size < 2;
      });
      expect(oneKind.map((product) => product.id)).toEqual([]);
    });

    it('mixes true and false answers among the boolean questions', () => {
      const oneSided = products.filter((product) => {
        const answers = new Set(
          product.quiz.filter(isBooleanQuestion).map((q) => q.correctAnswer),
        );
        return answers.size < 2;
      });
      expect(oneSided.map((product) => product.id)).toEqual([]);
    });

    it('gives every choice question four distinct options', () => {
      const malformed = products.flatMap((product) =>
        product.quiz
          .filter(isChoiceQuestion)
          .filter(
            (question) =>
              question.options.length !== 4 ||
              new Set(question.options.map((o) => o.trim())).size !== 4,
          )
          .map((question) => question.id),
      );
      expect(malformed).toEqual([]);
    });

    it('points every correctIndex at a real option', () => {
      const outOfRange = products.flatMap((product) =>
        product.quiz
          .filter(isChoiceQuestion)
          .filter(
            (question) =>
              !Number.isInteger(question.correctIndex) ||
              question.correctIndex < 0 ||
              question.correctIndex >= question.options.length,
          )
          .map((question) => question.id),
      );
      expect(outOfRange).toEqual([]);
    });

    it('does not park the answer at the same index in every choice question', () => {
      // Options are shuffled at session time, so a constant index is not a
      // correctness bug — but it does mean the bank was written on autopilot.
      const lazy = products.filter((product) => {
        const indexes = product.quiz
          .filter(isChoiceQuestion)
          .map((q) => q.correctIndex);
        return indexes.length > 2 && new Set(indexes).size === 1;
      });
      expect(lazy.map((product) => product.id)).toEqual([]);
    });

    it('covers all five lesson steps in every bank', () => {
      const allSteps: LessonStepNumber[] = [1, 2, 3, 4, 5];
      const gaps = products.filter((product) => {
        const steps = new Set(product.quiz.map((question) => question.step));
        return allSteps.some((step) => !steps.has(step));
      });
      expect(gaps.map((product) => product.id)).toEqual([]);
    });

    it('spreads difficulty across every bank', () => {
      const flat = products.filter((product) => {
        const levels = new Set(product.quiz.map((question) => question.difficulty));
        return levels.size < 2;
      });
      expect(flat.map((product) => product.id)).toEqual([]);
    });
  });

  it('keeps TOTAL_PRODUCTS in step with the catalogue', () => {
    expect(TOTAL_PRODUCTS).toBe(products.length);
  });
});
