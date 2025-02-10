import { ITransferStateAppInsightsConfig } from './transfer-state-app-insights-config.interface';
import { ITransferStateLaunchDarklyConfig } from './transfer-state-launch-darkly-config.interface';

export interface ITransferStateServerState {
  launchDarklyConfig: ITransferStateLaunchDarklyConfig;
  ssoEnabled: boolean;
  appInsightsConfig: ITransferStateAppInsightsConfig;
}
