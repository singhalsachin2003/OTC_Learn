import { useEffect } from 'react';
import { Linking } from 'react-native';

import { actionsForLink, parseDeepLink } from '../navigation/linking';
import { useAppDispatch } from './useAppState';

/**
 * Resolves `otclearn://` links onto the Redux navigation state.
 *
 * Covers both entry points: `getInitialURL` for a cold start from a link, and
 * the `url` event for a link arriving while the app is already running.
 * `parseDeepLink` validates ids against the catalogue and returns null for
 * anything unrecognised, so a bad link leaves the user wherever they were.
 *
 * Progress hydration is untouched by this — links only write to `app`, so
 * there is no ordering constraint against the store bootstrap.
 */
export function useDeepLinks() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    // `getInitialURL` is typed `Promise<string | null>` but resolves undefined
    // when the app was not launched from a link, so this guards on the type
    // rather than on null.
    function open(url: string | null | undefined) {
      if (typeof url !== 'string' || url === '' || cancelled) {
        return;
      }
      const link = parseDeepLink(url);
      if (link === null) {
        return;
      }
      for (const action of actionsForLink(link)) {
        dispatch(action);
      }
    }

    void Linking.getInitialURL().then(open);
    const subscription = Linking.addEventListener('url', ({ url }) => open(url));

    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, [dispatch]);
}
