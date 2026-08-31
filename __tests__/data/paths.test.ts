import { categories } from '../../src/data/categories';
import {
  orderedProductIds,
  paths,
  pathFor,
  positionInPath,
} from '../../src/data/paths';
import {
  getProductById,
  getProductsByCategory,
  products,
} from '../../src/data/products';
import type { Difficulty } from '../../src/data/types';

const RANK: Record<Difficulty, number> = {
  foundational: 0,
  intermediate: 1,
  advanced: 2,
};

describe('learning paths', () => {
  it('covers every asset class', () => {
    expect(paths.map((p) => p.categoryId).sort()).toEqual(
      categories.map((c) => c.id).sort(),
    );
  });

  /**
   * A path that missed a product would hide it from anyone following the route,
   * and a duplicate would teach it twice — both are silent, so they are checked
   * rather than trusted.
   */
  it.each(categories.map((c) => c.id))(
    'lists every product in %s exactly once',
    (categoryId) => {
      const path = pathFor(categoryId);
      const actual = getProductsByCategory(categoryId).map((p) => p.id);

      expect([...path].sort()).toEqual([...actual].sort());
      expect(new Set(path).size).toBe(path.length);
    },
  );

  it('names only products that exist', () => {
    for (const id of orderedProductIds()) {
      expect(getProductById(id)).toBeDefined();
    }
  });

  it('reaches every product in the catalogue', () => {
    expect(orderedProductIds()).toHaveLength(products.length);
  });

  /**
   * The invariant that makes the ordering checkable instead of a matter of
   * taste: you are never sent from an advanced product to a foundational one.
   */
  it.each(categories.map((c) => c.id))(
    'never gets easier as it goes along in %s',
    (categoryId) => {
      const ranks = pathFor(categoryId).map(
        (id) => RANK[getProductById(id)!.difficulty],
      );

      for (let i = 1; i < ranks.length; i += 1) {
        expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]);
      }
    },
  );

  it('starts every asset class on its gentlest product', () => {
    for (const category of categories) {
      const first = getProductById(pathFor(category.id)[0])!;
      const easiest = Math.min(
        ...getProductsByCategory(category.id).map((p) => RANK[p.difficulty]),
      );

      expect(RANK[first.difficulty]).toBe(easiest);
    }
  });

  /**
   * The home screen and the category list must not give different answers to
   * "what next", so both follow `categories`.
   */
  it('orders asset classes the way the category list does', () => {
    expect(orderedProductIds().slice(0, 6)).toEqual(pathFor(categories[0].id));
  });

  it('is empty for a category that does not exist', () => {
    expect(pathFor('bonds')).toEqual([]);
    expect(pathFor(null)).toEqual([]);
  });
});

describe('positionInPath', () => {
  it('numbers from one', () => {
    expect(positionInPath('ir', pathFor('ir')[0])).toBe(1);
    expect(positionInPath('ir', pathFor('ir')[5])).toBe(6);
  });

  it('is zero for a product not on that path', () => {
    expect(positionInPath('ir', 'cds')).toBe(0);
  });
});
