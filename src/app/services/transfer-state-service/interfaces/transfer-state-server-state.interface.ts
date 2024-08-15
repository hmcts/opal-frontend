import { ITransferStateLaunchDarklyConfig } from './index';

export interface ITransferStateServerState {
  launchDarklyConfig: ITransferStateLaunchDarklyConfig;
  ssoEnabled: boolean;
}
