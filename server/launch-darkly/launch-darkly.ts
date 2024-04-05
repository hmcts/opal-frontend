import config from 'config';
import { launchDarklyConfig } from '../interfaces';

export default class LaunchDarkly {
  public enableFor(): launchDarklyConfig {
    const launchDarklyConfig: launchDarklyConfig = {
      enabled: config.get('features.launch-darkly.enabled'),
      clientId: null,
      stream: config.get('features.launch-darkly.stream'),
    };

    if (launchDarklyConfig.enabled && config.has('secrets.opal.launch-darkly-client-id')) {
      launchDarklyConfig.clientId = config.get('secrets.opal.launch-darkly-client-id');
    }

    return launchDarklyConfig;
  }
}
