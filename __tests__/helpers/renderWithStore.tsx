import { type ReactElement, type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createStore, type AppStore } from '../../src/store';

/** Non-zero frame so `useSafeAreaInsets` resolves instead of suspending. */
const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export interface RenderWithStoreResult {
  store: AppStore;
}

/**
 * Renders a tree inside a fresh Redux store and a stubbed safe-area provider.
 * Pass an existing `store` to keep state across re-renders in a flow test.
 */
export async function renderWithStore(
  ui: ReactElement,
  { store = createStore(), ...options }: { store?: AppStore } & RenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
          {children}
        </SafeAreaProvider>
      </Provider>
    );
  }

  return { store, ...(await render(ui, { wrapper: Wrapper, ...options })) };
}
