import { Injectable } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE, MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { IAccountEnquiryState, IManualAccountCreationState } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class MacStateService {
  // Non reactive state
  public accountEnquiry: IAccountEnquiryState = ACCOUNT_ENQUIRY_DEFAULT_STATE;
  public manualAccountCreation: IManualAccountCreationState = MANUAL_ACCOUNT_CREATION_STATE;
}
