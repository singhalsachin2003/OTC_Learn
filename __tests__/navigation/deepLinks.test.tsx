import { act, screen, waitFor } from '@testing-library/react-native';
import { Linking, type EmitterSubscription } from 'react-native';

import { RootNavigator } from '../../src/navigation/RootNavigator';
import { renderWithStore } from '../helpers/renderWithStore';

type UrlListener = (event: { url: string }) => void;

let listeners: UrlListener[];
let getInitialURL: jest.SpyInstance;
let addEventListener: jest.SpyInstance;

/** Delivers a link to an already-running app. */
async function receiveLink(url: string) {
  await act(async () => {
    for (const listener of listeners) {
      listener({ url });
    }
  });
}

/** Sets the URL the app is cold-started with. Call before rendering. */
function coldStartWith(url: string | null | undefined) {
  getInitialURL.mockResolvedValue(url);
}

beforeEach(() => {
  listeners = [];
  // Undefined rather than null is what a launch without a link actually
  // resolves to, so it is the default here — see the guard test below.
  getInitialURL = jest
    .spyOn(Linking, 'getInitialURL')
    .mockResolvedValue(undefined as unknown as string);
  addEventListener = jest
    .spyOn(Linking, 'addEventListener')
    .mockImplementation((_event, listener) => {
      listeners.push(listener as UrlListener);
      // Only `remove` is ever called; the rest of EmitterSubscription is
      // internal bookkeeping the hook never touches.
      return {
        remove: () => {
          listeners = listeners.filter((l) => l !== listener);
        },
      } as unknown as EmitterSubscription;
    });
});

// Restore these specifically — `jest.restoreAllMocks()` would also tear down
// the spies the RN preset installs, leaving later renders empty.
afterEach(() => {
  getInitialURL.mockRestore();
  addEventListener.mockRestore();
});

describe('deep links on a cold start', () => {
  it('opens a product link on the product page', async () => {
    coldStartWith('otclearn://product/fxfwd');
    const { store } = await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(screen.getByTestId('product-screen')).toBeTruthy();
    });
    expect(store.getState().app.selectedProductId).toBe('fxfwd');
    // The category is selected too, so the product's back control resolves.
    expect(screen.getByLabelText('Back to FX')).toBeTruthy();
  });

  it('opens a lesson link straight onto the lesson', async () => {
    coldStartWith('otclearn://lesson/fxfwd');
    const { store } = await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-screen')).toBeTruthy();
    });
    expect(store.getState().app.selectedCategoryId).toBe('fx');
  });

  it('opens a category link onto that asset class', async () => {
    coldStartWith('otclearn://category/credit');
    await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(screen.getByTestId('category-screen')).toBeTruthy();
    });
    expect(screen.getByText('Credit')).toBeTruthy();
  });

  // `getInitialURL` is typed `Promise<string | null>` but resolves undefined
  // when the app was not launched from a link. Without the typeof guard the
  // undefined would be parsed as a URL and every launch would be a deep link.
  it('leaves the user on home when there is no launch link', async () => {
    coldStartWith(undefined);
    const { store } = await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(getInitialURL).toHaveBeenCalled();
    });
    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(store.getState().app.selectedProductId).toBeNull();
  });

  it('leaves the user on home when the launch link is null', async () => {
    coldStartWith(null);
    await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(getInitialURL).toHaveBeenCalled();
    });
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('ignores an empty launch link', async () => {
    coldStartWith('');
    await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(getInitialURL).toHaveBeenCalled();
    });
    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('ignores a link naming content that does not exist', async () => {
    coldStartWith('otclearn://product/not-a-real-product');
    const { store } = await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(getInitialURL).toHaveBeenCalled();
    });
    expect(screen.getByTestId('home-screen')).toBeTruthy();
    expect(store.getState().app.selectedProductId).toBeNull();
  });
});

describe('deep links delivered to a running app', () => {
  it('opens a product link that arrives while the app is open', async () => {
    const { store } = await renderWithStore(<RootNavigator />);
    expect(screen.getByTestId('home-screen')).toBeTruthy();

    await receiveLink('otclearn://product/cds');

    expect(screen.getByTestId('product-screen')).toBeTruthy();
    expect(store.getState().app.selectedProductId).toBe('cds');
  });

  it('switches to the review tab for a review link', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await receiveLink('otclearn://review');

    expect(screen.getByTestId('review-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('review');
  });

  it('switches to the profile tab for a profile link', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await receiveLink('otclearn://profile');

    expect(screen.getByTestId('profile-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('profile');
  });

  // The glossary is a detail screen rather than a tab root, so the bar keeps
  // highlighting wherever the user already was.
  it('opens the glossary under the profile tab', async () => {
    const { store } = await renderWithStore(<RootNavigator />);

    await receiveLink('otclearn://glossary');

    expect(screen.getByTestId('glossary-screen')).toBeTruthy();
    expect(store.getState().app.currentTab).toBe('profile');
  });

  it('sends a home link back to the home screen', async () => {
    await renderWithStore(<RootNavigator />);
    await receiveLink('otclearn://category/fx');
    expect(screen.getByTestId('category-screen')).toBeTruthy();

    await receiveLink('otclearn://home');

    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('leaves the user where they were for an unrecognised link', async () => {
    await renderWithStore(<RootNavigator />);
    await receiveLink('otclearn://category/fx');

    await receiveLink('otclearn://settings');

    expect(screen.getByTestId('category-screen')).toBeTruthy();
  });

  it('removes its listener on unmount', async () => {
    const { unmount } = await renderWithStore(<RootNavigator />);

    expect(listeners).toHaveLength(1);
    await unmount();
    expect(listeners).toHaveLength(0);
  });
});
