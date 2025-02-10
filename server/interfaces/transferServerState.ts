import appInsightsConfig from './appInsightsConfig';
import launchDarklyConfig from './launchDarklyConfig';

class TransferServerState {
  launchDarklyConfig!: launchDarklyConfig;
  ssoEnabled!: boolean;
  appInsightsConfig!: appInsightsConfig;
}

export default TransferServerState;
