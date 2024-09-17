import { Injectable, signal } from '@angular/core';
import { ITransferStateLaunchDarklyConfig } from '@services/transfer-state-service/interfaces/transfer-state-launch-darkly-config.interface';
import { ISessionTokenExpiry } from '@services/session-service/interfaces/session-token-expiry.interface';
import { ISessionUserState } from '@services/session-service/interfaces/session-user-state.interface';

import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  // Reactive state
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly featureFlags = signal<LDFlagSet>({});
  public readonly userState = signal<ISessionUserState>({} as ISessionUserState);

  // Non reactive state
  public ssoEnabled: boolean | null = false;
  public launchDarklyConfig: ITransferStateLaunchDarklyConfig | null = null;
  public tokenExpiry!: ISessionTokenExpiry;
}
