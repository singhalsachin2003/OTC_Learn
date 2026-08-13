import { fireEvent, screen } from '@testing-library/react-native';

import { masteryFill, ProductRow } from '../../src/components/ui/ProductRow';
import { getProductById } from '../../src/data/products';
import { masteryColors } from '../../src/theme';
import { MASTERY_COMPLETE } from '../../src/utils/mastery';
import { renderWithStore } from '../helpers/renderWithStore';

const product = getProductById('irs')!;

describe('ProductRow', () => {
  it('renders the product name and hook', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={0} onPress={jest.fn()} />,
    );

    expect(screen.getByText('Interest Rate Swap')).toBeTruthy();
    expect(screen.getByText('Trade fixed for floating payments')).toBeTruthy();
  });

  it('shows a mastery ring below the completion threshold', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={42} onPress={jest.fn()} />,
    );

    expect(screen.getByTestId('product-ring-irs')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.queryByTestId('product-done-irs')).toBeNull();
  });

  it('shows the completed badge at the threshold', async () => {
    await renderWithStore(
      <ProductRow
        product={product}
        mastery={MASTERY_COMPLETE}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByTestId('product-done-irs')).toBeTruthy();
    expect(screen.queryByTestId('product-ring-irs')).toBeNull();
  });

  // The boundary is the whole point of the prop: one mark below the threshold
  // is still a ring, so "nearly there" and "done" never look the same.
  it('still shows a ring one point below the threshold', async () => {
    await renderWithStore(
      <ProductRow
        product={product}
        mastery={MASTERY_COMPLETE - 1}
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByTestId('product-ring-irs')).toBeTruthy();
    expect(screen.queryByTestId('product-done-irs')).toBeNull();
  });

  // Zero is "not started", which reads as nothing rather than as a score.
  it('marks an untouched product with a dot rather than a zero', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={0} onPress={jest.fn()} />,
    );

    expect(screen.getByText('·')).toBeTruthy();
    expect(screen.queryByText('0')).toBeNull();
  });

  it('announces the mastery percentage rather than relying on the ring', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={42} onPress={jest.fn()} />,
    );

    expect(screen.getByTestId('product-row-irs').props.accessibilityLabel).toBe(
      'Interest Rate Swap. Trade fixed for floating payments. 42 percent mastery.',
    );
  });

  it('announces a mastered product instead of its percentage', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={88} onPress={jest.fn()} />,
    );

    expect(
      screen.getByTestId('product-row-irs').props.accessibilityLabel,
    ).toContain('Mastered.');
  });

  it('marks a saved product, in the label as well as on screen', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={10} bookmarked onPress={jest.fn()} />,
    );

    expect(
      screen.getByTestId('product-saved-irs', { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(
      screen.getByTestId('product-row-irs').props.accessibilityLabel,
    ).toContain(' Saved.');
  });

  it('omits the saved mark by default', async () => {
    await renderWithStore(
      <ProductRow product={product} mastery={10} onPress={jest.fn()} />,
    );

    expect(
      screen.queryByTestId('product-saved-irs', { includeHiddenElements: true }),
    ).toBeNull();
  });

  it('shows a subtitle in place of the hook where one is given', async () => {
    await renderWithStore(
      <ProductRow
        product={product}
        mastery={10}
        subtitle="Matches “fixed leg”"
        onPress={jest.fn()}
      />,
    );

    expect(screen.getByText('Matches “fixed leg”')).toBeTruthy();
    expect(screen.queryByText('Trade fixed for floating payments')).toBeNull();
    expect(
      screen.getByTestId('product-row-irs').props.accessibilityLabel,
    ).toContain('Matches “fixed leg”');
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await renderWithStore(
      <ProductRow product={product} mastery={0} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByTestId('product-row-irs'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('masteryFill', () => {
  it('colours the ring by band rather than by a gradient', () => {
    expect(masteryFill(0)).toBe(masteryColors.none);
    expect(masteryFill(12)).toBe(masteryColors.shaky);
    expect(masteryFill(35)).toBe(masteryColors.building);
    expect(masteryFill(MASTERY_COMPLETE)).toBe(masteryColors.strong);
  });
});
