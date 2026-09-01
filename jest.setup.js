// Matchers (toBeDisabled, toHaveStyle, …) self-register from RNTL 14's main
// entry point, so they need no explicit setup import here.

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
  hideAsync: jest.fn().mockResolvedValue(undefined),
}));

// Fonts are irrelevant to behaviour under test; report them as already loaded.
jest.mock('@expo-google-fonts/plus-jakarta-sans', () => ({
  useFonts: () => [true, null],
  PlusJakartaSans_500Medium: 'PlusJakartaSans_500Medium',
  PlusJakartaSans_600SemiBold: 'PlusJakartaSans_600SemiBold',
  PlusJakartaSans_700Bold: 'PlusJakartaSans_700Bold',
  PlusJakartaSans_800ExtraBold: 'PlusJakartaSans_800ExtraBold',
}));

// Reanimated ships a mock, but requiring it pulls in the real module, which
// pulls in react-native-worklets and dies looking for a native install under
// Jest. The app only uses `Animated.View` with `entering`/`exiting`, so a stub
// that renders a plain View covers it: the animation is not under test, the
// tree it renders is.
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const noop = () => ({ duration: noop, delay: noop, springify: noop });
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (component) => component },
    FadeIn: { duration: noop },
    FadeOut: { duration: noop },
  };
});

// Haptics are fire-and-forget; the tests assert that a tap requested one, not
// that the device buzzed.
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  selectionAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Native module: the JS entry point throws without an install under Jest.
// Nobody owns an entitlement and nothing is on sale by default, which is the
// state every build so far ships in; the tests that care override a call.
jest.mock('react-native-purchases', () => ({
  __esModule: true,
  default: {
    setLogLevel: jest.fn(),
    configure: jest.fn(),
    getCustomerInfo: jest.fn().mockResolvedValue({ entitlements: { active: {} } }),
    getOfferings: jest.fn().mockResolvedValue({ current: null }),
    purchasePackage: jest.fn(),
    restorePurchases: jest.fn().mockResolvedValue({ entitlements: { active: {} } }),
    logIn: jest.fn(),
  },
  LOG_LEVEL: { ERROR: 'ERROR', WARN: 'WARN' },
  PACKAGE_TYPE: {
    MONTHLY: 'MONTHLY',
    ANNUAL: 'ANNUAL',
    LIFETIME: 'LIFETIME',
    CUSTOM: 'CUSTOM',
  },
}));

// The Customer Center is a native sheet. Resolving by default means the happy
// path needs no setup; the test that cares about a dashboard without one
// configured rejects it itself.
jest.mock('react-native-purchases-ui', () => ({
  __esModule: true,
  default: { presentCustomerCenter: jest.fn().mockResolvedValue(undefined) },
}));

// Permission is granted by default here so the happy path needs no setup; the
// tests that care about a refusal override `getPermissionsAsync` themselves.
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('scheduled-id'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
  getAllScheduledNotificationsAsync: jest.fn().mockResolvedValue([]),
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

// Lucide renders through react-native-svg, which jest-expo can handle, but the
// icon components carry no text — so tests identify them by testID rather than
// by rendering the SVG. Nothing to mock; this note is here so the next person
// does not go looking for one.
