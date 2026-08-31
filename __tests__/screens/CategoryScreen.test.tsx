import { fireEvent, screen } from '@testing-library/react-native';

import { pathFor } from '../../src/data/paths';
import { getProductById } from '../../src/data/products';
import { CategoryScreen } from '../../src/screens/Category/CategoryScreen';
import { createStore, type AppStore } from '../../src/store';
import { navigateToCategory } from '../../src/store/slices/appSlice';
import { setProgress } from '../../src/store/slices/progressSlice';
import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import { renderWithStore } from '../helpers/renderWithStore';

const IR_PATH = pathFor('ir');

async function openCategory(store: AppStore = createStore()) {
  store.dispatch(navigateToCategory('ir'));
  await renderWithStore(<CategoryScreen />, { store });
  return store;
}

function mastered(ids: string[]) {
  return Object.fromEntries(
    ids.map((id) => [
      id,
      {
        mastery: MASTERY_COMPLETE,
        attempts: 1,
        bestScorePct: 100,
        lastStudiedOn: '2026-08-30',
        updatedAt: 0,
      },
    ]),
  );
}

describe('CategoryScreen as a route', () => {
  it('lists the products in path order, not catalogue order', async () => {
    await openCategory();

    const rows = screen.getAllByTestId(/^product-row-/).map((r) => r.props.testID);
    expect(rows).toEqual(IR_PATH.map((id) => `product-row-${id}`));
  });

  /**
   * The bug that prompted paths: catalogue order is authoring order, so the
   * home screen offered Swaption — an advanced option *on* a swap — to someone
   * who had never opened the app. It must not be first here either.
   */
  it('does not open the asset class on its advanced product', async () => {
    await openCategory();

    expect(IR_PATH[0]).toBe('irs');
    expect(getProductById(IR_PATH[0])!.difficulty).toBe('foundational');
    expect(IR_PATH.indexOf('swaption')).toBe(IR_PATH.length - 1);
  });

  it('marks the first product as where to start', async () => {
    await openCategory();

    expect(screen.getByTestId(`category-next-${IR_PATH[0]}`)).toHaveTextContent(
      'START HERE',
    );
  });

  it('moves the marker on, and calls it NEXT once something is done', async () => {
    const store = createStore();
    store.dispatch(setProgress(mastered([IR_PATH[0]])));
    await openCategory(store);

    expect(screen.queryByTestId(`category-next-${IR_PATH[0]}`)).toBeNull();
    expect(screen.getByTestId(`category-next-${IR_PATH[1]}`)).toHaveTextContent(
      'NEXT',
    );
  });

  it('marks nothing as next once the whole path is mastered', async () => {
    const store = createStore();
    store.dispatch(setProgress(mastered([...IR_PATH])));
    await openCategory(store);

    for (const id of IR_PATH) {
      expect(screen.queryByTestId(`category-next-${id}`)).toBeNull();
    }
  });

  /** Nothing on the route locks anything — it guides, it does not gate. */
  it('opens any product on the route, not only the current one', async () => {
    const store = await openCategory();

    await fireEvent.press(screen.getByTestId(`product-row-${IR_PATH[4]}`));

    expect(store.getState().app.selectedProductId).toBe(IR_PATH[4]);
  });

  it('still reports an unavailable asset class', async () => {
    const store = createStore();
    store.dispatch(navigateToCategory('bonds'));
    await renderWithStore(<CategoryScreen />, { store });

    expect(screen.getByText('That asset class is unavailable.')).toBeTruthy();
  });
});
