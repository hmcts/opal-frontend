import { ILaunchDarklyConfig } from './launch-darkly-config.interface';

export interface ITransferServerState {
  launchDarklyConfig: ILaunchDarklyConfig;
  ssoEnabled: boolean;
}
