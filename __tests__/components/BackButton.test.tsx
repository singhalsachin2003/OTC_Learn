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

  // The arrow is a drawn chevron now, not a "←" character — Plus Jakarta Sans
  // has no arrow glyph, so Android was substituting one from another family.
  // The label is therefore plain text, and the icon is not in the text tree.
  it('renders the destination label and responds to a press', async () => {
    const onPress = jest.fn();
    await renderWithStore(
      <BackButton label="Home" onPress={onPress} testID="back" />,
    );

    expect(screen.getByText('Home')).toBeTruthy();
    await fireEvent.press(screen.getByTestId('back'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
