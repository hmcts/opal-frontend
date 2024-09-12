import { Injectable } from '@angular/core';
import { IFinesMacState } from '../../fines-mac/interfaces/fines-mac-state.interface';
import { FINES_MAC_STATE } from '../../fines-mac/constants/fines-mac-state';

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  // Non reactive state
  public finesMacState: IFinesMacState = FINES_MAC_STATE;
}
