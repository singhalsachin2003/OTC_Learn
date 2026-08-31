import * as Sentry from '@sentry/react-native';

import { setAnalyticsSink, track } from '../../src/utils/analytics';
import { initErrorReporting } from '../../src/utils/errorReporting';

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
}));

const init = Sentry.init as jest.Mock;
const captureException = Sentry.captureException as jest.Mock;
const addBreadcrumb = Sentry.addBreadcrumb as jest.Mock;

const DSN = 'https://key@example.ingest.sentry.io/1';

beforeEach(() => {
  jest.clearAllMocks();
  setAnalyticsSink(null);
});

afterEach(() => {
  setAnalyticsSink(null);
});

describe('initErrorReporting', () => {
  it('stays off when no DSN is configured', () => {
    // Also covers the production default path: `EXPO_PUBLIC_SENTRY_DSN` is
    // inlined as undefined under Jest, so the no-argument call must be inert.
    expect(initErrorReporting()).toBe(false);
    expect(init).not.toHaveBeenCalled();
  });

  it('stays off when the DSN is present but empty', () => {
    expect(initErrorReporting({ dsn: '' })).toBe(false);
    expect(init).not.toHaveBeenCalled();
  });

  it('initialises with the configured DSN and environment', () => {
    expect(initErrorReporting({ dsn: DSN, environment: 'staging' })).toBe(true);
    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: DSN,
        environment: 'staging',
        sendDefaultPii: false,
      }),
    );
  });

  /**
   * Performance tracing is a separate Sentry product with its own quota, and
   * turning it on by accident is the usual way a free account is exhausted by
   * an app nobody has complained about.
   */
  it('reports crashes without switching on performance tracing', () => {
    initErrorReporting({ dsn: DSN });

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ tracesSampleRate: 0, sendDefaultPii: false }),
    );
  });

  it('defaults the environment to production', () => {
    initErrorReporting({ dsn: DSN });

    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({ environment: 'production' }),
    );
  });
});

describe('the installed sink', () => {
  beforeEach(() => {
    initErrorReporting({ dsn: DSN });
  });

  it('captures app errors as exceptions, with the component stack', () => {
    const error = new Error('render exploded');

    track({ name: 'app_error', error, componentStack: 'at Boom' });

    expect(captureException).toHaveBeenCalledWith(error, {
      contexts: { react: { componentStack: 'at Boom' } },
    });
    expect(addBreadcrumb).not.toHaveBeenCalled();
  });

  it('records product events as breadcrumbs, not exceptions', () => {
    track({ name: 'lesson_started', productId: 'irs' });

    expect(captureException).not.toHaveBeenCalled();
    expect(addBreadcrumb).toHaveBeenCalledWith({
      category: 'app',
      message: 'lesson_started',
      data: { productId: 'irs' },
      level: 'info',
    });
  });
});
