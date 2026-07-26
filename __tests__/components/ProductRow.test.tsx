import { fireEvent, screen } from '@testing-library/react-native';

import { ProductRow } from '../../src/screens/Category/components/ProductRow';
import { getProductById } from '../../src/data/products';
import { renderWithStore } from '../helpers/renderWithStore';

const product = getProductById('irs')!;

describe('ProductRow', () => {
  it('renders the product name and hook', async () => {
    await renderWithStore(
      <ProductRow product={product} completed={false} onPress={jest.fn()} />,
    );

    expect(screen.getByText('Interest Rate Swap')).toBeTruthy();
    expect(screen.getByText('Trade fixed for floating payments')).toBeTruthy();
  });

  it('shows a chevron when the product is not complete', async () => {
    await renderWithStore(
      <ProductRow product={product} completed={false} onPress={jest.fn()} />,
    );

    // The chevron is decorative, so it is hidden from assistive tech and must
    // be queried with hidden elements included.
    expect(
      screen.getByTestId('product-chevron-irs', { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(screen.queryByTestId('product-done-irs')).toBeNull();
  });

  it('shows a checkmark when the product is complete', async () => {
    await renderWithStore(
      <ProductRow product={product} completed onPress={jest.fn()} />,
    );

    expect(screen.getByTestId('product-done-irs')).toBeTruthy();
    expect(
      screen.queryByTestId('product-chevron-irs', { includeHiddenElements: true }),
    ).toBeNull();
  });

  it('announces completion rather than relying on the checkmark colour', async () => {
    await renderWithStore(
      <ProductRow product={product} completed onPress={jest.fn()} />,
    );

    expect(
      screen.getByTestId('product-row-irs').props.accessibilityLabel,
    ).toContain('Completed');
  });

  it('fires onPress when tapped', async () => {
    const onPress = jest.fn();
    await renderWithStore(
      <ProductRow product={product} completed={false} onPress={onPress} />,
    );

    await fireEvent.press(screen.getByTestId('product-row-irs'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
