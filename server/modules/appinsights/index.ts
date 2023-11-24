import config from 'config';

process.env['APPLICATIONINSIGHTS_CONFIGURATION_CONTENT'] = '{}';
const appInsights = require('applicationinsights');

// As of 2.9.0 issue reading bundled applicationinsights.json
// https://github.com/microsoft/ApplicationInsights-node.js/issues/1226
// Define config below...

export class AppInsights {
  enable(): void {
    if (config.get('secrets.opal.AppInsightsInstrumentationKey')) {
      appInsights.setup(config.get('secrets.opal.AppInsightsInstrumentationKey')).setSendLiveMetrics(true).start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'opal-frontend';
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
