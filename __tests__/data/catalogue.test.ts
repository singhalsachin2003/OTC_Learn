import { categories } from '../../src/data/categories';
import { products, TOTAL_PRODUCTS } from '../../src/data/products';

/**
 * Structural guards on the content catalogue. The screens are data-driven, so
 * a malformed product surfaces as a blank or broken screen rather than a type
 * error — these assertions catch that at build time instead.
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

  it('leaves no lesson or explanation text empty', () => {
    const blanks = products.filter(
      (product) =>
        product.hook.trim() === '' ||
        product.lessons.some(
          (lesson) => lesson.title.trim() === '' || lesson.content.trim() === '',
        ) ||
        product.quiz.some(
          (question) =>
            question.question.trim() === '' || question.explanation.trim() === '',
        ),
    );
    expect(blanks.map((product) => product.id)).toEqual([]);
  });

  it('mixes true and false answers within every quiz', () => {
    const oneSided = products.filter((product) => {
      const answers = new Set(product.quiz.map((q) => q.correctAnswer));
      return answers.size < 2;
    });
    expect(oneSided.map((product) => product.id)).toEqual([]);
  });

  it('keeps TOTAL_PRODUCTS in step with the catalogue', () => {
    expect(TOTAL_PRODUCTS).toBe(products.length);
  });
});
