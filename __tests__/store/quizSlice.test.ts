import reducer, {
  initialQuizState,
  nextQuestion,
  recordAnswer,
  resetQuiz,
  type RecordAnswerPayload,
} from '../../src/store/slices/quizSlice';

const correctAnswer: RecordAnswerPayload = {
  questionId: 'irs-q1',
  answer: false,
  correct: true,
  explanation: 'Only the interest payments are exchanged.',
};

const wrongAnswer: RecordAnswerPayload = {
  questionId: 'irs-q2',
  answer: false,
  correct: false,
  explanation: 'Paying fixed and receiving floating fixes the rate.',
};

describe('quizSlice', () => {
  it('starts unanswered with a zero score', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialQuizState);
  });

  it('scores a correct answer and records the feedback', () => {
    const state = reducer(initialQuizState, recordAnswer(correctAnswer));

    expect(state.score).toBe(1);
    expect(state.isAnswered).toBe(true);
    expect(state.answers['irs-q1']).toBe(false);
    expect(state.feedback).toEqual({
      correct: true,
      explanation: correctAnswer.explanation,
    });
  });

  it('records a wrong answer without scoring it', () => {
    const state = reducer(initialQuizState, recordAnswer(wrongAnswer));

    expect(state.score).toBe(0);
    expect(state.isAnswered).toBe(true);
    expect(state.feedback?.correct).toBe(false);
  });

  it('ignores a second answer to the same question', () => {
    const answered = reducer(initialQuizState, recordAnswer(correctAnswer));
    const doubleTapped = reducer(answered, recordAnswer(correctAnswer));

    expect(doubleTapped.score).toBe(1);
    expect(doubleTapped).toEqual(answered);
  });

  it('advances to the next question and unlocks the buttons', () => {
    const answered = reducer(initialQuizState, recordAnswer(correctAnswer));
    const advanced = reducer(answered, nextQuestion());

    expect(advanced.currentQuestionIndex).toBe(1);
    expect(advanced.isAnswered).toBe(false);
    expect(advanced.feedback).toBeNull();
    // The recorded answer survives so a review screen could read it back.
    expect(advanced.answers['irs-q1']).toBe(false);
  });

  it('accumulates the score across a full three-question run', () => {
    let state = reducer(initialQuizState, recordAnswer(correctAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(state, recordAnswer(wrongAnswer));
    state = reducer(state, nextQuestion());
    state = reducer(
      state,
      recordAnswer({ ...correctAnswer, questionId: 'irs-q3' }),
    );

    expect(state.score).toBe(2);
    expect(state.currentQuestionIndex).toBe(2);
  });

  it('clears everything on reset', () => {
    const answered = reducer(initialQuizState, recordAnswer(correctAnswer));

    expect(reducer(answered, resetQuiz())).toEqual(initialQuizState);
  });
});
