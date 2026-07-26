// Registers the RNTL built-in matcher types (toBeDisabled, toHaveStyle, …)
// for `tsc --noEmit`; the runtime hook-up lives in `jest.setup.js`.
import '@testing-library/react-native/extend-expect';
