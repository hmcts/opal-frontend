import launchDarklyConfig from './launchDarklyConfig';
import UserState from './userState';

class TransferServerState {
  launchDarklyConfig!: launchDarklyConfig;
  userState!: UserState | null | undefined;
  ssoEnabled!: boolean;
}

export default TransferServerState;
