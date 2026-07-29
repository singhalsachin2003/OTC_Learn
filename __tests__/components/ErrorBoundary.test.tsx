import { fireEvent, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ErrorBoundary } from '../../src/components/common/ErrorBoundary';
import { setAnalyticsSink, type AnalyticsEvent } from '../../src/utils/analytics';
import { renderWithStore } from '../helpers/renderWithStore';

/** Throws on the first render only, so a reset can succeed. */
function Boom({ throwNow }: { throwNow: boolean }) {
  if (throwNow) {
    throw new Error('render exploded');
  }
  return <Text testID="child">fine</Text>;
}

let consoleError: jest.SpyInstance;

beforeEach(() => {
  // React logs caught render errors; the throw is the point of these tests.
  consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleError.mockRestore();
  setAnalyticsSink(null);
});

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', async () => {
    await renderWithStore(
      <ErrorBoundary>
        <Boom throwNow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.queryByTestId('error-boundary')).toBeNull();
  });

  it('shows the fallback instead of a blank screen when a child throws', async () => {
    await renderWithStore(
      <ErrorBoundary>
        <Boom throwNow />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-boundary')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.queryByTestId('child')).toBeNull();
  });

  it('reports the error through the analytics sink', async () => {
    const events: AnalyticsEvent[] = [];
    setAnalyticsSink((event) => events.push(event));

    await renderWithStore(
      <ErrorBoundary>
        <Boom throwNow />
      </ErrorBoundary>,
    );

    expect(events).toHaveLength(1);
    const [event] = events;
    expect(event.name).toBe('app_error');
    if (event.name === 'app_error') {
      expect(event.error.message).toBe('render exploded');
      expect(typeof event.componentStack).toBe('string');
    }
  });

  it('recovers and calls onReset when the user asks to go back', async () => {
    const onReset = jest.fn();
    const { rerender } = await renderWithStore(
      <ErrorBoundary onReset={onReset}>
        <Boom throwNow />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-boundary')).toBeTruthy();

    // The host's reset navigates away, so the child no longer throws.
    rerender(
      <ErrorBoundary onReset={onReset}>
        <Boom throwNow={false} />
      </ErrorBoundary>,
    );
    await fireEvent.press(screen.getByTestId('error-reset'));

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('child')).toBeTruthy();
    expect(screen.queryByTestId('error-boundary')).toBeNull();
  });
});
