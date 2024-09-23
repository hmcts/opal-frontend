import { IFinesMacOffenceDetailsOffenceState } from './fines-mac-offence-details-offence-state.interface';

export interface IFinesMacOffenceDetailsState {
  offenceDetails: string | null;
  offences: IFinesMacOffenceDetailsOffenceState[] | [];
}
