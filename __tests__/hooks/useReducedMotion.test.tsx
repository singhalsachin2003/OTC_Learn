import { AccessibilityInfo, Text } from 'react-native';
import { act, render, screen, waitFor } from '@testing-library/react-native';

import { useReducedMotion } from '../../src/hooks/useReducedMotion';

/**
 * Driven through a probe component rather than `renderHook`, which this
 * project's testing-library setup does not hand back a `result` from.
 */
function Probe() {
  const reduced = useReducedMotion();
  return <Text testID="probe">{reduced ? 'reduced' : 'full'}</Text>;
}

describe('useReducedMotion', () => {
  let listener: ((enabled: boolean) => void) | null = null;
  // The unmount path is not asserted here: this project's testing-library
  // cleans up automatically after each test, so the removal has already
  // happened by the time an assertion could run. The effect's teardown is three
  // standard lines, and a test that can only pass by disabling auto-cleanup
  // would be testing the harness.
  const remove = jest.fn();

  beforeEach(() => {
    listener = null;
    remove.mockClear();
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation((_event, handler) => {
        listener = handler as unknown as (enabled: boolean) => void;
        return { remove } as never;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** A slow system read must not hold up the first paint. */
  it('starts in the full-motion state', async () => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockReturnValue(new Promise(() => {}));

    await render(<Probe />);

    expect(screen.getByTestId('probe')).toHaveTextContent('full');
  });

  it('picks up the setting the system already holds', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    await render(<Probe />);

    await waitFor(() =>
      expect(screen.getByTestId('probe')).toHaveTextContent('reduced'),
    );
  });

  /**
   * The setting can be changed while the app is backgrounded, which for
   * something built around a commute is most of the time. Reading once on mount
   * and never again would leave the motion running until a force-quit.
   */
  it('follows a change made while the app was open', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);

    await render(<Probe />);
    await waitFor(() =>
      expect(screen.getByTestId('probe')).toHaveTextContent('full'),
    );

    await act(async () => {
      listener?.(true);
    });

    expect(screen.getByTestId('probe')).toHaveTextContent('reduced');
  });
});
