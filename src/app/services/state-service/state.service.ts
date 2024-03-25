import { Injectable, WritableSignal, signal } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IAccountEnquiryState, ILaunchDarklyConfig, IUserState } from '@interfaces';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // Reactive state
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly featureFlags = signal<LDFlagSet>({});

  // Non reactive state
  public userState: IUserState | null = null;
  public ssoEnabled: boolean | null = false;
  public launchDarklyConfig: ILaunchDarklyConfig | null = null;
  public accountEnquiry: IAccountEnquiryState = ACCOUNT_ENQUIRY_DEFAULT_STATE;
}
