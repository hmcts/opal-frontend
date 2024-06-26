import { Injectable, signal } from '@angular/core';
import { ILaunchDarklyConfig, IUserState } from '@interfaces';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  // Reactive state
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly featureFlags = signal<LDFlagSet>({});
  public readonly userState = signal<IUserState>({} as IUserState);

  // Non reactive state
  public ssoEnabled: boolean | null = false;
  public launchDarklyConfig: ILaunchDarklyConfig | null = null;
}
