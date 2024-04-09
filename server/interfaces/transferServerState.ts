import launchDarklyConfig from './launchDarklyConfig';

class TransferServerState {
  launchDarklyConfig!: launchDarklyConfig;
  ssoEnabled!: boolean;
}

export default TransferServerState;
