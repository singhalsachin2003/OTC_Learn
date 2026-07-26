import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '../../src/components/ui/Button';

describe('Button', () => {
  it('renders its label and fires onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Next" onPress={onPress} testID="next" />);

    expect(screen.getByText('Next')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('next'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress while disabled', async () => {
    const onPress = jest.fn();
    await render(<Button label="Back" onPress={onPress} disabled testID="back" />);

    await fireEvent.press(screen.getByTestId('back'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes its disabled state to assistive tech', async () => {
    await render(
      <Button label="Back" onPress={jest.fn()} disabled testID="back" />,
    );

    expect(screen.getByTestId('back')).toBeDisabled();
  });

  it('meets the 48dp minimum touch target', async () => {
    await render(<Button label="Tap" onPress={jest.fn()} testID="tap" />);

    expect(screen.getByTestId('tap')).toHaveStyle({ minHeight: 48 });
  });

  it('applies the flex weight used in button rows', async () => {
    await render(
      <Button label="Wide" onPress={jest.fn()} flex={2} testID="wide" />,
    );

    expect(screen.getByTestId('wide')).toHaveStyle({ flex: 2 });
  });

  it('renders the success and danger variants used by the quiz', async () => {
    const { rerender } = await render(
      <Button label="True" variant="success" onPress={jest.fn()} testID="v" />,
    );
    const successStyle = screen.getByTestId('v').props.style;
    expect(JSON.stringify(successStyle)).toContain('#E5FCEE');

    await rerender(
      <Button label="False" variant="danger" onPress={jest.fn()} testID="v" />,
    );
    expect(JSON.stringify(screen.getByTestId('v').props.style)).toContain(
      '#FFEEED',
    );
  });
});
