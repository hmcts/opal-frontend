import { Injectable } from '@angular/core';
import { MANUAL_ACCOUNT_CREATION_STATE } from '@constants';
import { IManualAccountCreationState } from '@interfaces';

@Injectable({
  providedIn: 'root',
})
export class MacStateService {
  // Non reactive state
  public manualAccountCreation: IManualAccountCreationState = MANUAL_ACCOUNT_CREATION_STATE;
}
