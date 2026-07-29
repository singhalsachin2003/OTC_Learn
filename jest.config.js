module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // Only *.test.* files are specs; `__tests__/helpers` holds shared utilities.
  testMatch: ['<rootDir>/__tests__/**/*.test.{ts,tsx}'],
  // Expo, React Native, and Redux ship untranspiled ESM, so they must not be
  // ignored. react-redux 9 and Redux Toolkit 2 resolve to ESM builds under Jest.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-redux|@reduxjs/toolkit|redux|redux-thunk|reselect|immer))',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/App.tsx',
    '!src/**/index.ts',
    '!src/data/**',
    '!src/theme/**',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
      branches: 60,
      functions: 60,
    },
  },
};
