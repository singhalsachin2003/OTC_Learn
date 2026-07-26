import { Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Card } from '../../src/components/ui/Card';

describe('Card', () => {
  it('renders its children', async () => {
    await render(
      <Card testID="card">
        <Text>Your progress</Text>
      </Card>,
    );

    expect(screen.getByText('Your progress')).toBeTruthy();
  });

  it('applies the shared surface styling', async () => {
    await render(
      <Card testID="card">
        <Text>Body</Text>
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveStyle({
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      padding: 16,
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    });
  });

  it('becomes a button when given onPress', async () => {
    const onPress = jest.fn();
    await render(
      <Card testID="card" onPress={onPress} accessibilityLabel="Interest Rate">
        <Text>Interest Rate</Text>
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card.props.accessibilityRole).toBe('button');

    await fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is not a button without onPress', async () => {
    await render(
      <Card testID="card">
        <Text>Static</Text>
      </Card>,
    );

    expect(screen.getByTestId('card').props.accessibilityRole).toBeUndefined();
  });
});
