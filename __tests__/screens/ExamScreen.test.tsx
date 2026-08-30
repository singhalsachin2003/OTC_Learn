import { fireEvent, screen } from '@testing-library/react-native';

import { examScopes } from '../../src/data/examScopes';
import { ExamScreen } from '../../src/screens/Exam/ExamScreen';
import { createStore } from '../../src/store';
import { setExamResults } from '../../src/store/slices/progressSlice';
import { EXAM_SCOPE_ALL } from '../../src/utils/exam';
import { renderWithStore } from '../helpers/renderWithStore';

describe('ExamScreen', () => {
  it('offers every asset class plus the whole catalogue', async () => {
    await renderWithStore(<ExamScreen />);

    for (const scope of examScopes()) {
      expect(screen.getByTestId(`exam-scope-${scope.id}`)).toBeTruthy();
    }
  });

  it('starts an exam over the chosen scope and enters the paper', async () => {
    const store = createStore();
    await renderWithStore(<ExamScreen />, { store });

    await fireEvent.press(screen.getByTestId('exam-scope-ir'));
    await fireEvent.press(screen.getByTestId('exam-length-10'));
    await fireEvent.press(screen.getByTestId('exam-begin'));

    const state = store.getState();
    expect(state.app.currentScreen).toBe('quiz');
    expect(state.quiz.mode).toBe('exam');
    expect(state.quiz.scopeId).toBe('ir');
    expect(state.quiz.questions).toHaveLength(10);
    // An exam spans products, so none is selected — the same reason a review
    // sitting carries no product id.
    expect(state.quiz.productId).toBeNull();
  });

  /**
   * The paper must span the scope rather than sampling it luckily, which is
   * the whole reason `buildExamPaper` draws round-robin.
   */
  it('draws across several products rather than clustering on one', async () => {
    const store = createStore();
    await renderWithStore(<ExamScreen />, { store });

    await fireEvent.press(screen.getByTestId('exam-scope-ir'));
    await fireEvent.press(screen.getByTestId('exam-length-10'));
    await fireEvent.press(screen.getByTestId('exam-begin'));

    const drawn = store.getState().quiz.questions;
    const products = new Set(drawn.map((q) => q.id.split('-')[0]));
    expect(products.size).toBeGreaterThan(1);
  });

  it('carries a time limit proportional to the paper', async () => {
    const store = createStore();
    await renderWithStore(<ExamScreen />, { store });

    await fireEvent.press(screen.getByTestId('exam-length-10'));
    await fireEvent.press(screen.getByTestId('exam-begin'));

    expect(store.getState().quiz.timeLimitMs).toBe(10 * 60 * 1000);
  });

  it('shows nothing about past sittings before any have been sat', async () => {
    await renderWithStore(<ExamScreen />);

    expect(screen.queryByTestId('exam-history-0')).toBeNull();
    expect(screen.queryByTestId('exam-best')).toBeNull();
  });

  it('shows the best score for the selected scope only', async () => {
    const store = createStore();
    store.dispatch(
      setExamResults([
        {
          id: 'exam-1',
          takenOn: '2026-08-20',
          scopeId: 'ir',
          correct: 18,
          total: 20,
          scorePct: 90,
          passed: true,
          durationMs: 600_000,
        },
      ]),
    );

    await renderWithStore(<ExamScreen />, { store });

    // Default scope is the whole catalogue, which has no result yet.
    expect(screen.queryByTestId('exam-best')).toBeNull();

    await fireEvent.press(screen.getByTestId('exam-scope-ir'));
    expect(screen.getByTestId('exam-best')).toBeTruthy();
  });

  it('lists recent sittings newest first', async () => {
    const store = createStore();
    store.dispatch(
      setExamResults([
        {
          id: 'exam-2',
          takenOn: '2026-08-01',
          scopeId: 'ir',
          correct: 10,
          total: 20,
          scorePct: 50,
          passed: false,
          durationMs: null,
        },
        {
          id: 'exam-3',
          takenOn: '2026-08-28',
          scopeId: EXAM_SCOPE_ALL,
          correct: 16,
          total: 20,
          scorePct: 80,
          passed: true,
          durationMs: null,
        },
      ]),
    );

    await renderWithStore(<ExamScreen />, { store });

    expect(screen.getByTestId('exam-history-0').props.accessibilityLabel).toContain(
      'Everything',
    );
    expect(screen.getByTestId('exam-history-1').props.accessibilityLabel).toContain(
      'Interest Rate',
    );
  });
});
