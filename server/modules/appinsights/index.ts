process.env['APPLICATIONINSIGHTS_CONFIGURATION_CONTENT'] = '{}';
import * as appInsights from 'applicationinsights';
import AppInsightsConfiguration from './app-insights-configuration';
import config from 'config';

// As of 2.9.0 issue reading bundled applicationinsights.json
// https://github.com/microsoft/ApplicationInsights-node.js/issues/1226
// Define config below...

export class AppInsights {
  enable(): void {
    const appInsightsConfigInstance = new AppInsightsConfiguration();
    const appInsightsConfig = appInsightsConfigInstance.enableFor();
    const enabled = appInsightsConfig.enabled;
    const connectionString = appInsightsConfig.connectionString;

    if (enabled && connectionString) {
      appInsights
        .setup(connectionString)
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

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = config.get(
        'application-insights.cloudRoleName',
      );
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
