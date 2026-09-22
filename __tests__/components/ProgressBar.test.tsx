import { screen } from '@testing-library/react-native';

import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { renderWithStore } from '../helpers/renderWithStore';

const expectFillWidth = (testID: string, width: `${number}%`) =>
  expect(screen.getByTestId(`${testID}-fill`)).toHaveStyle({ width });

describe('ProgressBar', () => {
  it('renders the fill at the given percentage', async () => {
    await renderWithStore(<ProgressBar progress={0.3} testID="bar" />);

    expectFillWidth('bar', '30%');
  });

  it('clamps values above 1 and below 0', async () => {
    const { rerender } = await renderWithStore(
      <ProgressBar progress={1.8} testID="bar" />,
    );
    expectFillWidth('bar', '100%');

    await rerender(<ProgressBar progress={-0.5} testID="bar" />);
    expectFillWidth('bar', '0%');
  });

  it('treats a non-finite progress value as empty', async () => {
    await renderWithStore(<ProgressBar progress={Number.NaN} testID="bar" />);

    expectFillWidth('bar', '0%');
  });

  it('reports progress to assistive tech', async () => {
    await renderWithStore(
      <ProgressBar
        progress={0.5}
        testID="bar"
        accessibilityLabel="Your progress"
      />,
    );

    const bar = screen.getByTestId('bar');
    expect(bar.props.accessibilityValue).toEqual({ min: 0, max: 100, now: 50 });
    expect(bar.props.accessibilityLabel).toBe('Your progress');
  });

  it('honours a custom height and colour', async () => {
    await renderWithStore(
      <ProgressBar progress={0.5} height={6} color="#2A75BA" testID="bar" />,
    );

    expect(screen.getByTestId('bar')).toHaveStyle({ height: 6 });
    expect(screen.getByTestId('bar-fill')).toHaveStyle({
      backgroundColor: '#2A75BA',
    });
  });
});
