import { examScopes, examScopeName } from '../../src/data/examScopes';
import { products } from '../../src/data/products';
import { EXAM_SCOPE_ALL } from '../../src/utils/exam';

const totalQuestions = products.reduce(
  (sum, product) => sum + product.quiz.length,
  0,
);

describe('examScopes', () => {
  it('offers the whole catalogue plus one scope per asset class', () => {
    const scopes = examScopes();

    expect(scopes[0]).toMatchObject({ id: EXAM_SCOPE_ALL, locked: false });
    expect(scopes).toHaveLength(7);
    expect(scopes[0]?.questionCount).toBe(totalQuestions);
  });

  it('locks nothing when everything is open', () => {
    expect(examScopes().every((scope) => !scope.locked)).toBe(true);
  });

  /**
   * The count is what a paper would actually be drawn from. Reporting the
   * whole catalogue while the draw skips the locked banks would promise a
   * longer paper than the scope can produce.
   */
  it('counts only what the reader can open', () => {
    const scopes = examScopes((productId) =>
      products.some(
        (product) => product.id === productId && product.categoryId === 'ir',
      ),
    );

    const free = products.filter((product) => product.categoryId === 'ir');
    const expected = free.reduce((sum, product) => sum + product.quiz.length, 0);

    expect(scopes[0]?.questionCount).toBe(expected);
    expect(scopes.find((scope) => scope.id === 'ir')).toMatchObject({
      questionCount: expected,
      locked: false,
    });
    expect(scopes.find((scope) => scope.id === 'credit')).toMatchObject({
      questionCount: 0,
      locked: true,
    });
  });

  /** There is always the free asset class to sit it over. */
  it('never locks the everything scope', () => {
    const scopes = examScopes(() => false);

    expect(scopes[0]).toMatchObject({ id: EXAM_SCOPE_ALL, locked: false });
  });
});

describe('examScopeName', () => {
  /**
   * Names resolve whatever the reader can open: a stored result from an asset
   * class they no longer subscribe to must still read as a row in the history.
   */
  it('names every scope regardless of access', () => {
    expect(examScopeName('credit')).toBe('Credit');
    expect(examScopeName(EXAM_SCOPE_ALL)).toBe('Everything');
  });
});
