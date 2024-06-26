import { Injectable } from '@angular/core';
import { ACCOUNT_ENQUIRY_DEFAULT_STATE } from '@constants';
import { IAccountEnquiryState } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class AeStateService {
  // Non reactive state
  public accountEnquiry: IAccountEnquiryState = ACCOUNT_ENQUIRY_DEFAULT_STATE;
}
