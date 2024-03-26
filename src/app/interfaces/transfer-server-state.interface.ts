import { ILaunchDarklyConfig } from './launch-darkly-config.interface';
import { IUserState } from './user-state.interface';

export interface ITransferServerState {
  launchDarklyConfig: ILaunchDarklyConfig;
  userState: IUserState;
  ssoEnabled: boolean;
}
