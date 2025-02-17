import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';
import { ITransferStateLaunchDarklyConfig } from '@services/transfer-state-service/interfaces/transfer-state-launch-darkly-config.interface';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { IErrorState } from './interfaces/error-state.interface';

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => ({
    authenticated: false,
    error: { error: false, message: '' },
    featureFlags: {} as LDFlagSet,
    userState: {} as ISessionUserState,
    ssoEnabled: false,
    launchDarklyConfig: {} as ITransferStateLaunchDarklyConfig,
    tokenExpiry: {} as ISessionTokenExpiry,
  })),
  withMethods((store) => ({
    setAuthenticated: (authenticated: boolean) => {
      patchState(store, { authenticated });
    },
    setError: (error: IErrorState) => {
      patchState(store, { error });
    },
    setFeatureFlags: (featureFlags: LDFlagSet) => {
      patchState(store, { featureFlags });
    },
    setUserState: (userState: ISessionUserState) => {
      patchState(store, { userState });
    },
    setSsoEnabled: (ssoEnabled: boolean) => {
      patchState(store, { ssoEnabled });
    },
    setLaunchDarklyConfig: (config: ITransferStateLaunchDarklyConfig) => {
      patchState(store, { launchDarklyConfig: config });
    },
    setTokenExpiry: (tokenExpiry: ISessionTokenExpiry) => {
      patchState(store, { tokenExpiry });
    },
  })),
);
