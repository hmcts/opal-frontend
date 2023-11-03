import * as config from 'config';

// As of 2.9.0 issue reading bundled applicationinsights.json
// https://github.com/microsoft/ApplicationInsights-node.js/issues/1226
// Define config below...
process.env['APPLICATIONINSIGHTS_CONFIGURATION_CONTENT'] = '{}';
const appInsights = require('applicationinsights');

export class AppInsights {
  enable(): void {
    console.log('APP INSIGHTS ENABLED', config.get('appInsights.instrumentationKey'));
    if (config.get('appInsights.instrumentationKey')) {
      appInsights.setup(config.get('appInsights.instrumentationKey')).setSendLiveMetrics(true).start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'opal-frontend';
      appInsights.defaultClient.trackTrace({
        message: 'App insights activated',
      });
    }
  }
}
