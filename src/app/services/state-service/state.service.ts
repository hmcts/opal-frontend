import { Injectable, signal } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE, MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { IAccountEnquiryState, ILaunchDarklyConfig, IManualAccountCreationState, IUserState } from '@interfaces';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // Reactive state
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly featureFlags = signal<LDFlagSet>({});
  public readonly userState = signal<IUserState>({} as IUserState);

  // Non reactive state
  public ssoEnabled: boolean | null = false;
  public launchDarklyConfig: ILaunchDarklyConfig | null = null;
  public accountEnquiry: IAccountEnquiryState = ACCOUNT_ENQUIRY_DEFAULT_STATE;
  public manualAccountCreation: IManualAccountCreationState = MANUAL_ACCOUNT_CREATION_STATE;
}
