import * as Sentry from '@sentry/react-native';

import { setAnalyticsSink, type AnalyticsEvent } from './analytics';

export interface ErrorReportingConfig {
  dsn?: string;
  environment?: string;
}

/**
 * Crash reporting.
 *
 * Disabled unless a DSN is configured, which keeps local and test runs from
 * reporting anywhere and makes the no-reporting build the default. v1.0 ships
 * that way deliberately; see PRODUCTION_READINESS.md.
 *
 * The defaults are read from `EXPO_PUBLIC_*`, which Babel inlines into the
 * bundle at build time — they are literals by the time this runs, not lookups,
 * which is why the config is injectable rather than read straight from
 * `process.env` at the point of use. A Sentry DSN is a write-only ingest key
 * and is meant to be public, so shipping it in the bundle is expected.
 *
 * Product events become breadcrumbs rather than analytics — they exist only to
 * say what the user was doing when a crash arrived.
 */
export function initErrorReporting({
  dsn = process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment = process.env.EXPO_PUBLIC_APP_ENV,
}: ErrorReportingConfig = {}): boolean {
  if (dsn === undefined || dsn === '') {
    return false;
  }

  Sentry.init({
    dsn,
    environment: environment ?? 'production',
    // The catalogue is static, and while an account now exists it is never
    // attached to an event — nothing here calls `setUser`, and this keeps the
    // SDK from inferring one from the request.
    sendDefaultPii: false,
    // Crashes only. Performance tracing is a separate product with its own
    // quota, and switching it on by accident is the usual way a free Sentry
    // account is exhausted by an app nobody has complained about yet.
    tracesSampleRate: 0,
  });

  setAnalyticsSink(report);

  return true;
}

function report(event: AnalyticsEvent): void {
  if (event.name === 'app_error') {
    Sentry.captureException(event.error, {
      contexts: {
        react: { componentStack: event.componentStack },
      },
    });
    return;
  }

  const { name, ...data } = event;
  Sentry.addBreadcrumb({ category: 'app', message: name, data, level: 'info' });
}
