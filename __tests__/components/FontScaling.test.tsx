import { screen } from '@testing-library/react-native';

import { TabBar } from '../../src/components/common/TabBar';
import { renderWithStore } from '../helpers/renderWithStore';

/**
 * Verified on a Pixel 7 at `font_scale 2.0`, which is the largest Android
 * offers. The rule the app follows is that **content scales in full and
 * navigation furniture does not**: at 2x, "Products" wrapped onto a second
 * line and spilled out of the bar on every screen, and the review badge — a
 * fixed circle drawn over the icon — could not contain its own number.
 *
 * A cap is a real accessibility trade, so it is deliberately confined to the
 * chrome. Every heading, every paragraph and every product card still scales
 * without limit.
 */
describe('font scaling', () => {
  it('caps the tab labels and keeps them to one line', async () => {
    await renderWithStore(<TabBar current="home" onSelect={() => {}} />);

    const label = screen.getByText('Products');
    expect(label.props.maxFontSizeMultiplier).toBe(1.3);
    expect(label.props.numberOfLines).toBe(1);
  });

  it('caps the review badge harder than the labels', async () => {
    await renderWithStore(
      <TabBar current="home" onSelect={() => {}} reviewBadge={6} />,
    );

    const badge = screen.getByText('6');
    expect(badge.props.maxFontSizeMultiplier).toBe(1.1);
  });

  /** The count is on the tab's accessibility label, so capping loses nothing. */
  it('still announces the due count to a screen reader', async () => {
    await renderWithStore(
      <TabBar current="home" onSelect={() => {}} reviewBadge={6} />,
    );

    expect(screen.getByLabelText('Review, 6 due')).toBeTruthy();
  });

  it('caps every tab label, not only the long one', async () => {
    await renderWithStore(<TabBar current="home" onSelect={() => {}} />);

    for (const label of ['Home', 'Products', 'Review', 'Profile']) {
      expect(screen.getByText(label).props.maxFontSizeMultiplier).toBe(1.3);
    }
  });

  /**
   * The cap is confined to the chrome on purpose. Nothing in the theme carries
   * a multiplier, so every heading and paragraph scales without limit — if this
   * fails, someone has capped the text people are actually here to read.
   */
  it('caps nothing in the type scale itself', () => {
    const scale = jest.requireActual('../../src/theme/typography');
    for (const style of Object.values(scale.typography)) {
      expect(style).not.toHaveProperty('maxFontSizeMultiplier');
    }
  });
});
