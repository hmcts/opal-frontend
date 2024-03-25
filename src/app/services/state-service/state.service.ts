import { Injectable, WritableSignal, signal } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IAccountEnquiryState, ILaunchDarklyConfig, IUserState } from '@interfaces';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // Use signals if we need to reactively make changes
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly accountEnquiry: WritableSignal<IAccountEnquiryState> = signal(ACCOUNT_ENQUIRY_DEFAULT_STATE);
  public readonly featureFlags = signal<LDFlagSet>({});

  // Otherwise just store the state
  public userState: IUserState | null = null;
  public ssoEnabled: boolean | null = false;
  public launchDarklyConfig: ILaunchDarklyConfig | null = null;
}
