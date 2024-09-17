import { ITransferStateLaunchDarklyConfig } from './transfer-state-launch-darkly-config.interface';

export interface ITransferStateServerState {
  launchDarklyConfig: ITransferStateLaunchDarklyConfig;
  ssoEnabled: boolean;
}
