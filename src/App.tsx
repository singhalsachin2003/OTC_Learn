import { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppFonts } from './hooks/useAppFonts';
import { RootNavigator } from './navigation/RootNavigator';
import { store } from './store';
import { loadProgress } from './store/thunks/progressThunks';
import { loadStreak, recordActivity } from './store/thunks/streakThunks';
import { colors } from './theme';

// Hold the native splash until fonts and persisted state are ready.
void SplashScreen.preventAutoHideAsync();

function AppContent() {
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    // Hydrate first, then register today's activity so the streak rules see
    // the stored `lastActivityDate` rather than the initial null.
    async function bootstrap() {
      await Promise.all([
        store.dispatch(loadProgress()),
        store.dispatch(loadStreak()),
      ]);
      await store.dispatch(recordActivity(undefined));
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
      <RootNavigator />
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
