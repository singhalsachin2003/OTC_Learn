import { act, screen } from '@testing-library/react-native';

import {
  formatElapsed,
  QuizTimer,
} from '../../src/screens/Quiz/components/QuizTimer';
import { renderWithStore } from '../helpers/renderWithStore';

/**
 * The clock is driven by `Date.now()` on an interval, so both are faked: a
 * real-time test of a countdown either sleeps for minutes or asserts nothing.
 */
const START = 1_700_000_000_000;

describe('QuizTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(START);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /** Advances both the interval and the wall clock the component reads. */
  async function tick(ms: number) {
    await act(async () => {
      jest.advanceTimersByTime(ms);
    });
  }

  describe('formatElapsed', () => {
    it('formats as m:ss', () => {
      expect(formatElapsed(0)).toBe('0:00');
      expect(formatElapsed(9_000)).toBe('0:09');
      expect(formatElapsed(65_000)).toBe('1:05');
      expect(formatElapsed(600_000)).toBe('10:00');
    });

    it('floors a negative span at zero rather than showing a minus', () => {
      expect(formatElapsed(-5_000)).toBe('0:00');
    });
  });

  it('counts up when no limit is given', async () => {
    await renderWithStore(<QuizTimer startedAt={START} />);

    await tick(3_000);

    expect(screen.getByTestId('quiz-timer')).toHaveTextContent('0:03');
    expect(screen.getByLabelText('Elapsed 0:03')).toBeTruthy();
  });

  it('counts down when a limit is given', async () => {
    await renderWithStore(<QuizTimer startedAt={START} limitMs={60_000} />);

    await tick(20_000);

    expect(screen.getByTestId('quiz-timer')).toHaveTextContent('0:40');
    expect(screen.getByLabelText('0:40 remaining')).toBeTruthy();
  });

  it('does not fire before the limit is reached', async () => {
    const onExpire = jest.fn();
    await renderWithStore(
      <QuizTimer startedAt={START} limitMs={60_000} onExpire={onExpire} />,
    );

    await tick(59_000);

    expect(onExpire).not.toHaveBeenCalled();
  });

  it('fires once the limit is reached', async () => {
    const onExpire = jest.fn();
    await renderWithStore(
      <QuizTimer startedAt={START} limitMs={10_000} onExpire={onExpire} />,
    );

    await tick(10_000);

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  /**
   * The reason expiry is guarded by a ref. The interval keeps running until
   * unmount, and a second call would record the sitting twice.
   */
  it('fires only once even as the clock keeps running', async () => {
    const onExpire = jest.fn();
    await renderWithStore(
      <QuizTimer startedAt={START} limitMs={5_000} onExpire={onExpire} />,
    );

    await tick(30_000);

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('holds at zero rather than counting into negatives', async () => {
    await renderWithStore(<QuizTimer startedAt={START} limitMs={5_000} />);

    await tick(20_000);

    expect(screen.getByTestId('quiz-timer')).toHaveTextContent('0:00');
  });

  it('renders nothing when there is no sitting to time', async () => {
    await renderWithStore(<QuizTimer startedAt={null} />);

    expect(screen.queryByTestId('quiz-timer')).toBeNull();
  });
});
