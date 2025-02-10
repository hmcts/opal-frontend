import { ITransferStateServerState } from '../interfaces/transfer-state-server-state.interface';
import { TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK } from './transfer-state-launch-darkly-config.mock';
import { TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK } from './transfer-state-app-insights-config.mock';

export const TRANSFER_STATE_MOCK: ITransferStateServerState = {
  launchDarklyConfig: TRANSFER_STATE_LAUNCH_DARKLY_CONFIG_MOCK,
  ssoEnabled: true,
  appInsightsConfig: TRANSFER_STATE_APP_INSIGHTS_CONFIG_MOCK,
};
