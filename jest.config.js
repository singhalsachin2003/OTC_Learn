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

  /**
   * Jest resolves lucide's `react-native` export condition, which points at an
   * `.mjs` bundle — and jest-expo's transform only matches `.[jt]sx?`, so the
   * file arrives untransformed and fails on its first `export`. Pointing Jest
   * at the CommonJS build is cheaper than widening the transform, and affects
   * Jest only: Metro resolves the same condition and handles the ESM fine.
   */
  moduleNameMapper: {
    '^lucide-react-native$':
      '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
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
