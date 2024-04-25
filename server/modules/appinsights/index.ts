import config from 'config';

process.env['APPLICATIONINSIGHTS_CONFIGURATION_CONTENT'] = '{}';
import * as appInsights from 'applicationinsights';

// As of 2.9.0 issue reading bundled applicationinsights.json
// https://github.com/microsoft/ApplicationInsights-node.js/issues/1226
// Define config below...

export class AppInsights {
  enable(): void {
    const appInsightsKey: string | null = config.has('secrets.opal.app-insights-connection-string')
      ? config.get('secrets.opal.app-insights-connection-string')
      : null;

    if (appInsightsKey) {
      appInsights
        .setup(appInsightsKey)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true, false)
        .setAutoCollectPreAggregatedMetrics(true)
        .setSendLiveMetrics(true)
        .setInternalLogging(false, true)
        .enableWebInstrumentation(false)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'opal-frontend';
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
