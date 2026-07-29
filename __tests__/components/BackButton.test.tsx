import { fireEvent, screen } from '@testing-library/react-native';

import { BackButton } from '../../src/components/common/BackButton';
import { renderWithStore } from '../helpers/renderWithStore';

describe('BackButton', () => {
  it('announces the destination by default', async () => {
    await renderWithStore(
      <BackButton label="Home" onPress={jest.fn()} testID="back" />,
    );

    expect(screen.getByLabelText('Back to Home')).toBeTruthy();
  });

  it('uses an explicit label where the text names an action, not a destination', async () => {
    await renderWithStore(
      <BackButton
        label="Exit quiz"
        accessibilityLabel="Exit quiz"
        onPress={jest.fn()}
        testID="back"
      />,
    );

    expect(screen.getByLabelText('Exit quiz')).toBeTruthy();
    expect(screen.queryByLabelText('Back to Exit quiz')).toBeNull();
  });

  it('still renders the arrow and visible label', async () => {
    const onPress = jest.fn();
    await renderWithStore(
      <BackButton label="Home" onPress={onPress} testID="back" />,
    );

    expect(screen.getByText('←  Home')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('back'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
