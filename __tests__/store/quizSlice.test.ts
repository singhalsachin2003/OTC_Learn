import type { Question } from '../../src/data/types';
import reducer, {
  finishQuiz,
  initialQuizState,
  nextQuestion,
  recordAnswer,
  resetQuiz,
  startQuiz,
  type RecordAnswerPayload,
} from '../../src/store/slices/quizSlice';

const trueFalse: Question = {
  id: 'irs-q1',
  kind: 'boolean',
  step: 1,
  difficulty: 'foundational',
  prompt: 'An interest rate swap exchanges the notional at maturity.',
  correctAnswer: false,
  explanation: 'Only the interest payments are exchanged.',
};

const choice: Question = {
  id: 'irs-q2',
  kind: 'choice',
  step: 3,
  difficulty: 'intermediate',
  prompt: 'Who bears the fixed leg?',
  options: ['The payer', 'The receiver', 'Both', 'Neither'],
  correctIndex: 0,
  explanation: 'The payer pays fixed and receives floating.',
};

const paper: Question[] = [trueFalse, choice];

const STARTED_AT = 1_770_000_000_000;

const correctAnswer: RecordAnswerPayload = {
  questionId: 'irs-q1',
  answer: false,
  correct: true,
  step: 1,
  explanation: trueFalse.explanation,
  correctLabel: 'False',
};

const wrongAnswer: RecordAnswerPayload = {
  questionId: 'irs-q2',
  answer: 2,
  correct: false,
  step: 3,
  explanation: choice.explanation,
  correctLabel: 'The payer',
};

/** A sitting of the two-question paper, mid-flight and unanswered. */
function startedState() {
  return reducer(
    initialQuizState,
    startQuiz({
      questions: paper,
      mode: 'product',
      productId: 'irs',
      startedAt: STARTED_AT,
    }),
  );
}

describe('quizSlice', () => {
  it('starts with no paper, unanswered and unscored', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialQuizState);
  });
});

describe('quizSlice starting a sitting', () => {
  it('installs the drawn paper and starts the clock', () => {
    const state = startedState();

    expect(state.questions).toEqual(paper);
    expect(state.mode).toBe('product');
    expect(state.productId).toBe('irs');
    expect(state.startedAt).toBe(STARTED_AT);
    expect(state.currentIndex).toBe(0);
    expect(state.score).toBe(0);
    expect(state.answers).toEqual([]);
  });

  it('starts a review run with no product attached', () => {
    const state = reducer(
      initialQuizState,
      startQuiz({
        questions: paper,
        mode: 'review',
        productId: null,
        startedAt: STARTED_AT,
      }),
    );

    expect(state.mode).toBe('review');
    expect(state.productId).toBeNull();
  });

  // Starting a second quiz without an intervening reset must not inherit the
  // first one's score, answers or position.
  it('discards the previous sitting when a new paper is drawn', () => {
    let state = startedState();
    state = reducer(state, recordAnswer(correctAnswer));
    state = reducer(state, nextQuestion());

    const restarted = reducer(
      state,
      startQuiz({
        questions: [choice],
        mode: 'product',
        productId: 'cds',
        startedAt: STARTED_AT + 1000,
      }),
    );

    expect(restarted.score).toBe(0);
    expect(restarted.answers).toEqual([]);
    expect(restarted.currentIndex).toBe(0);
    expect(restarted.isAnswered).toBe(false);
    expect(restarted.feedback).toBeNull();
    expect(restarted.finishedInMs).toBeNull();
  });
});

describe('quizSlice recording answers', () => {
  it('scores a correct answer and records the feedback', () => {
    const state = reducer(startedState(), recordAnswer(correctAnswer));

    expect(state.score).toBe(1);
    expect(state.isAnswered).toBe(true);
    expect(state.answers).toEqual([
      { questionId: 'irs-q1', answer: false, correct: true, step: 1 },
    ]);
    expect(state.feedback).toEqual({
      correct: true,
      explanation: trueFalse.explanation,
      correctLabel: 'False',
    });
  });

  it('records a wrong answer without scoring it', () => {
    const state = reducer(startedState(), recordAnswer(wrongAnswer));

    expect(state.score).toBe(0);
    expect(state.isAnswered).toBe(true);
    expect(state.feedback).toEqual({
      correct: false,
      explanation: choice.explanation,
      correctLabel: 'The payer',
    });
  });

  it('keeps an option index as a number and a true/false answer as a boolean', () => {
    let state = reducer(startedState(), recordAnswer(correctAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(state, recordAnswer(wrongAnswer));

    expect(state.answers.map((record) => record.answer)).toEqual([false, 2]);
  });

  it('keeps the lesson step each question tested, for the breakdown', () => {
    let state = reducer(startedState(), recordAnswer(correctAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(state, recordAnswer(wrongAnswer));

    expect(state.answers.map((record) => record.step)).toEqual([1, 3]);
  });

  // Two taps land before the controls lock on a slow render; the second must
  // not be scored again.
  it('ignores a second answer to the same question', () => {
    const answered = reducer(startedState(), recordAnswer(correctAnswer));
    const doubleTapped = reducer(answered, recordAnswer(correctAnswer));

    expect(doubleTapped.score).toBe(1);
    expect(doubleTapped.answers).toHaveLength(1);
    expect(doubleTapped).toEqual(answered);
  });

  // A double tap that lands on a *different* option is the same hazard: the
  // question is already answered, so the later tap is ignored wholesale.
  it('ignores a second answer even when it differs from the first', () => {
    const answered = reducer(startedState(), recordAnswer(wrongAnswer));
    const doubleTapped = reducer(
      answered,
      recordAnswer({ ...wrongAnswer, answer: 0, correct: true }),
    );

    expect(doubleTapped.score).toBe(0);
    expect(doubleTapped.answers).toHaveLength(1);
    expect(doubleTapped.feedback?.correct).toBe(false);
  });

  it('advances to the next question and unlocks the controls', () => {
    const answered = reducer(startedState(), recordAnswer(correctAnswer));
    const advanced = reducer(answered, nextQuestion());

    expect(advanced.currentIndex).toBe(1);
    expect(advanced.isAnswered).toBe(false);
    expect(advanced.feedback).toBeNull();
    // The recorded answers survive so the results screen can read them back.
    expect(advanced.answers).toHaveLength(1);
  });

  it('accumulates the score across a full run', () => {
    let state = startedState();
    state = reducer(state, recordAnswer(correctAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(state, recordAnswer(wrongAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(
      state,
      recordAnswer({ ...correctAnswer, questionId: 'irs-q3' }),
    );

    expect(state.score).toBe(2);
    expect(state.currentIndex).toBe(2);
    expect(state.answers).toHaveLength(3);
  });
});

describe('quizSlice finishing', () => {
  it('stamps the elapsed time from when the sitting began', () => {
    const state = reducer(startedState(), finishQuiz(STARTED_AT + 42_000));

    expect(state.finishedInMs).toBe(42_000);
  });

  // Finishing without a start would otherwise report an absurd duration
  // measured from the epoch, so an unstarted sitting stays untimed.
  it('leaves the elapsed time null when the sitting never started', () => {
    const state = reducer(initialQuizState, finishQuiz(STARTED_AT));

    expect(state.startedAt).toBeNull();
    expect(state.finishedInMs).toBeNull();
  });

  it('clears the paper and the sitting on reset', () => {
    let state = startedState();
    state = reducer(state, recordAnswer(correctAnswer));
    state = reducer(state, finishQuiz(STARTED_AT + 1000));

    expect(reducer(state, resetQuiz())).toEqual(initialQuizState);
  });
});
