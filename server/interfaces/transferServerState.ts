import launchDarklyConfig from './launchDarklyConfig';
import UserState from './userState';

class TransferServerState {
  launchDarklyConfig!: launchDarklyConfig;
  userState!: UserState | null;
  ssoEnabled!: boolean;
}

export default TransferServerState;
