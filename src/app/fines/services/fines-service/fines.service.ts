import { Injectable } from '@angular/core';
import { IFinesMacState } from '@interfaces/fines/mac';
import { FINES_MAC_STATE } from '@constants/fines/mac';

@Injectable({
  providedIn: 'root',
})
export class FinesService {
  // Non reactive state
  public finesMacState: IFinesMacState = FINES_MAC_STATE;
}
