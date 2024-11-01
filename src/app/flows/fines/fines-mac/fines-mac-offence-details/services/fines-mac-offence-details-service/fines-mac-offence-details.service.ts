import { Injectable } from '@angular/core';
import { IFinesMacOffenceDetailsDraftState } from '../../interfaces/fines-mac-offence-details-draft-state.interface';
import { FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE } from '../../constants/fines-mac-offence-details-draft-state.constant';

@Injectable({
  providedIn: 'root',
})
export class FinesMacOffenceDetailsService {
  public finesMacOffenceDetailsDraftState: IFinesMacOffenceDetailsDraftState = FINES_MAC_OFFENCE_DETAILS_DRAFT_STATE;
  public offenceIndex: number = 0;
  public emptyOffences: boolean = false;
  public addedOffenceCode!: string;
  public minorCreditorAdded!: boolean;
}
