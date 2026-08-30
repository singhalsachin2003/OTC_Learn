import { fireEvent, screen } from '@testing-library/react-native';

import { getProductById } from '../../src/data/products';
import { ReviewScreen } from '../../src/screens/Review/ReviewScreen';
import { createStore, type AppStore } from '../../src/store';
import { setReviewQueue } from '../../src/store/slices/reviewSlice';
import { toggleSetting } from '../../src/store/slices/settingsSlice';
import { toDateKey } from '../../src/utils/formatters';
import type { ReviewItem } from '../../src/utils/review';
import { renderWithStore } from '../helpers/renderWithStore';

/** A date key `offset` days from today — the queue is keyed by local date. */
function dayKey(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return toDateKey(date);
}

/** Queues real catalogue questions, so `useReview` can resolve every one. */
function queue(store: AppStore, entries: { offset: number; lapses?: number }[]) {
  const questions = getProductById('irs')!.quiz;
  const items: ReviewItem[] = entries.map((entry, index) => ({
    id: questions[index].id,
    productId: 'irs',
    step: 0,
    dueOn: dayKey(entry.offset),
    lapses: entry.lapses ?? 1,
  }));
  store.dispatch(setReviewQueue(items));
}

describe('ReviewScreen', () => {
  it('explains how the queue fills when nothing is in it', async () => {
    await renderWithStore(<ReviewScreen />);

    expect(screen.getByTestId('review-empty')).toBeTruthy();
    expect(screen.getByText('Nothing queued yet')).toBeTruthy();
    expect(screen.queryByTestId('review-start')).toBeNull();
  });

  it('sends someone with an empty queue to the products tab', async () => {
    const store = createStore();
    await renderWithStore(<ReviewScreen />, { store });

    await fireEvent.press(screen.getByTestId('review-browse'));

    expect(store.getState().app.currentScreen).toBe('products');
  });

  it('lists what is waiting and starts a sitting over it', async () => {
    const store = createStore();
    queue(store, [{ offset: 0 }, { offset: -3, lapses: 2 }]);
    await renderWithStore(<ReviewScreen />, { store });

    expect(screen.getByTestId('review-due-tile')).toHaveTextContent('2DUE NOW');
    expect(screen.getByText('WAITING FOR YOU')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('review-start'));

    const state = store.getState();
    expect(state.app.currentScreen).toBe('quiz');
    expect(state.quiz.mode).toBe('review');
    expect(state.quiz.questions).toHaveLength(2);
  });

  /**
   * The "In queue" tile counts items that are not due, so a screen with
   * nothing due today has to show what it is counting — otherwise the tile
   * points at something the user can never see.
   */
  it('previews what is coming when nothing is due today', async () => {
    const store = createStore();
    queue(store, [{ offset: 1 }, { offset: 4 }]);
    await renderWithStore(<ReviewScreen />, { store });

    expect(screen.getByTestId('review-empty')).toBeTruthy();
    expect(screen.getByText('All caught up')).toBeTruthy();
    expect(screen.getByTestId('review-upcoming')).toBeTruthy();
    expect(screen.getByText('COMING UP')).toBeTruthy();
    // Both the "Next up" tile and the row read "Tomorrow" — a bare date key
    // means nothing to a reader, so neither shows one.
    expect(screen.getAllByText(/Tomorrow/).length).toBeGreaterThan(1);
    expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).toBeNull();
  });

  /**
   * `dueOn` comes from storage, and storage reads never throw — a malformed key
   * survives hydration. It has to render as "—" rather than "In NaN days".
   */
  it('shows a dash rather than nonsense for an unparseable due date', async () => {
    const store = createStore();
    store.dispatch(
      setReviewQueue([
        {
          id: getProductById('irs')!.quiz[0].id,
          productId: 'irs',
          step: 0,
          dueOn: 'whenever',
          lapses: 1,
        },
      ]),
    );
    await renderWithStore(<ReviewScreen />, { store });

    expect(screen.getByTestId('review-upcoming')).toBeTruthy();
    expect(screen.queryByText(/NaN/)).toBeNull();
    expect(screen.getAllByText(/—/).length).toBeGreaterThan(0);
  });

  it('says so when spaced repetition is switched off', async () => {
    const store = createStore();
    store.dispatch(toggleSetting('spacedRepetition'));
    await renderWithStore(<ReviewScreen />, { store });

    expect(screen.getByTestId('review-disabled')).toBeTruthy();
  });

  it('caps the sitting at the chosen session size', async () => {
    const store = createStore();
    queue(
      store,
      Array.from({ length: 9 }, () => ({ offset: 0 })),
    );
    await renderWithStore(<ReviewScreen />, { store });

    const size = store.getState().settings.settings.sessionSize;
    expect(screen.getByTestId('review-start')).toHaveTextContent(
      `Review ${size} questions`,
    );

    await fireEvent.press(screen.getByTestId('review-start'));
    expect(store.getState().quiz.questions).toHaveLength(size);
  });
});
