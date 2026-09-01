import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAppSelector } from './hooks/useAppState';
import { useAppFonts } from './hooks/useAppFonts';
import { useNavigation } from './hooks/useNavigation';
import { RootNavigator } from './navigation/RootNavigator';
import { store } from './store';
import { refreshEntitlement } from './store/thunks/accessThunks';
import { hydrateApp } from './store/thunks/bootstrapThunks';
import { recordActivity } from './store/thunks/streakThunks';
import { restoreSession, syncNow } from './store/thunks/syncThunks';
import { colors } from './theme';
import { initErrorReporting } from './utils/errorReporting';
import { initPurchases } from './utils/purchases';
import { syncReminder } from './utils/notifications';

// Hold the native splash until fonts and persisted state are ready.
void SplashScreen.preventAutoHideAsync();

// Before any component renders, so a crash during start-up is still reported.
initErrorReporting();

// Also at module scope: RevenueCat has to be configured before anything asks
// about an entitlement. Inert without a key, which is every build so far.
initPurchases();

function AppContent() {
  const [fontsLoaded, fontError] = useAppFonts();
  const hydrated = useAppSelector((state) => state.settings.hydrated);
  const { goHome } = useNavigation();

  useEffect(() => {
    // Hydrate first, then register today's activity so the streak rules see
    // the stored `lastActivityDate` rather than the initial null.
    async function bootstrap() {
      await store.dispatch(hydrateApp());
      await store.dispatch(recordActivity(undefined));

      // Reconcile the reminder with the OS once state is known: permission can
      // be revoked in system settings, and a reinstall drops the schedule while
      // keeping the preference. `syncReminder` repairs or reports either.
      const { settings } = store.getState().settings;
      void syncReminder(settings.dailyReminder);

      // Same rule as sync below, and for the same reason: asking RevenueCat
      // what someone owns is a network call, and nothing on screen may wait on
      // one. Until it answers the store says no purchases are configured, so
      // the catalogue is open — which is the safe direction to be wrong in.
      void store.dispatch(refreshEntitlement());

      // Sync last, and never awaited by anything that renders. It runs after
      // hydration so the merge sees the device's real state rather than the
      // initial one, and a device with no signal, an expired token or a paused
      // free-tier project has to behave exactly like the app did before sync
      // existed — which means nothing here may block the screen.
      void (async () => {
        await store.dispatch(restoreSession());
        if (store.getState().sync.userId !== null) {
          await store.dispatch(syncNow());
        }
      })();
    }

    void bootstrap();
  }, []);

  // A font failure should not block the app — RN falls back to the system face.
  const fontsSettled = fontsLoaded || fontError !== null;

  /**
   * The splash comes down only once the store holds real data.
   *
   * Waiting on fonts alone meant a returning user saw a frame of the initial
   * state — 0% mastery, no streak, an empty review queue — before hydration
   * resolved and everything jumped. `hydrated` is set in `hydrateApp`'s
   * `finally`, so a failed read still releases the splash rather than hanging
   * behind it.
   */
  const ready = fontsSettled && hydrated;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {/* Sends the user home on recovery: the screen that threw is still the
          selected one, so remounting it alone would loop straight back. */}
      <ErrorBoundary onReset={goHome}>
        <RootNavigator />
      </ErrorBoundary>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
