import { Injectable, WritableSignal, signal } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IAccountEnquiryState, IUserState } from '@interfaces';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public readonly authenticated = signal<boolean>(false);
  public readonly error = signal({ error: false, message: '' });
  public readonly accountEnquiry: WritableSignal<IAccountEnquiryState> = signal(ACCOUNT_ENQUIRY_DEFAULT_STATE);
  public readonly featureFlags = signal<LDFlagSet>({});
  public readonly userState = signal<IUserState | null>(null);
}
