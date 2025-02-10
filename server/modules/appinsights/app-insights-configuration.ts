import config from 'config';
import { appInsightsConfig } from '../../interfaces';

export default class AppInsightsConfiguration {
  public enableFor(): appInsightsConfig {
    const appInsightsConfig: appInsightsConfig = {
      enabled: config.get('features.app-insights.enabled'),
      connectionString: null,
      cloudRoleName: null,
    };

    if (
      appInsightsConfig.enabled &&
      config.has('secrets.opal.app-insights-connection-string') &&
      config.has('application-insights.cloudRoleName')
    ) {
      appInsightsConfig.connectionString = config.get('secrets.opal.app-insights-connection-string');
      appInsightsConfig.cloudRoleName = config.get('application-insights.cloudRoleName');
    }

    return appInsightsConfig;
  }
}
