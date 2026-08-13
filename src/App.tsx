import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAppFonts } from './hooks/useAppFonts';
import { useNavigation } from './hooks/useNavigation';
import { RootNavigator } from './navigation/RootNavigator';
import { store } from './store';
import { hydrateApp } from './store/thunks/bootstrapThunks';
import { recordActivity } from './store/thunks/streakThunks';
import { colors } from './theme';
import { initErrorReporting } from './utils/errorReporting';
import { syncReminder } from './utils/notifications';

// Hold the native splash until fonts and persisted state are ready.
void SplashScreen.preventAutoHideAsync();

// Before any component renders, so a crash during start-up is still reported.
initErrorReporting();

function AppContent() {
  const [fontsLoaded, fontError] = useAppFonts();
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
    }

    void bootstrap();
  }, []);

  const onLayout = useCallback(() => {
    if (fontsLoaded || fontError !== null) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // A font failure should not block the app — RN falls back to the system face.
  if (!fontsLoaded && fontError === null) {
    return null;
  }

  return (
    <View style={styles.root} onLayout={onLayout}>
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
