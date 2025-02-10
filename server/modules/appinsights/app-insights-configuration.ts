import config from 'config';
import { appInsightsConfig } from '../../interfaces';

export default class AppInsightsConfiguration {
  public enableFor(): appInsightsConfig {
    const appInsightsConfig: appInsightsConfig = {
      enabled: config.get('features.app-insights.enabled'),
      connectionString: null,
      cloudRoleName: 'opal-frontend',
    };

    if (appInsightsConfig.enabled && config.has('secrets.opal.app-insights-connection-string')) {
      appInsightsConfig.connectionString = config.get('secrets.opal.app-insights-connection-string');
    }

    return appInsightsConfig;
  }
}
