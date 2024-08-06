import { Injectable } from '@angular/core';
import { IFinesMacState } from '../fines-mac/interfaces';
import { FINES_MAC_STATE } from '../fines-mac/constants';

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  // Non reactive state
  public fineMacState: IFinesMacState = FINES_MAC_STATE;
}
