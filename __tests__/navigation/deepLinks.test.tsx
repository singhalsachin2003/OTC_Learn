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
function coldStartWith(url: string | null) {
  getInitialURL.mockResolvedValue(url);
}

beforeEach(() => {
  listeners = [];
  getInitialURL = jest
    .spyOn(Linking, 'getInitialURL')
    .mockResolvedValue(null as unknown as string);
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

describe('deep links', () => {
  it('opens a product link straight onto its lesson on a cold start', async () => {
    coldStartWith('otclearn://product/fxfwd');
    await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(screen.getByTestId('lesson-screen')).toBeTruthy();
    });
    expect(screen.getByText('FX Forward')).toBeTruthy();
    // The category is selected too, so the lesson's back control resolves.
    expect(screen.getByLabelText('Back to FX')).toBeTruthy();
  });

  it('opens a category link onto that asset class', async () => {
    coldStartWith('otclearn://category/credit');
    await renderWithStore(<RootNavigator />);

    await waitFor(() => {
      expect(screen.getByTestId('category-screen')).toBeTruthy();
    });
    expect(screen.getByText('Credit')).toBeTruthy();
  });

  it('leaves the user on home when there is no launch link', async () => {
    await renderWithStore(<RootNavigator />);

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

  it('handles a link arriving while the app is already open', async () => {
    await renderWithStore(<RootNavigator />);
    expect(screen.getByTestId('home-screen')).toBeTruthy();

    await receiveLink('otclearn://product/cds');

    expect(screen.getByTestId('lesson-screen')).toBeTruthy();
    expect(screen.getByText('Credit Default Swap')).toBeTruthy();
  });

  it('sends a home link back to the home screen', async () => {
    await renderWithStore(<RootNavigator />);
    await receiveLink('otclearn://category/fx');
    expect(screen.getByTestId('category-screen')).toBeTruthy();

    await receiveLink('otclearn://home');

    expect(screen.getByTestId('home-screen')).toBeTruthy();
  });

  it('removes its listener on unmount', async () => {
    const { unmount } = await renderWithStore(<RootNavigator />);

    expect(listeners).toHaveLength(1);
    await unmount();
    expect(listeners).toHaveLength(0);
  });
});
