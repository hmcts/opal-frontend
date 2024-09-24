import { IFinesMacOffenceDetailsImpositionsState } from './fines-mac-offence-details-impositions-state.interface';

export interface IFinesMacOffenceDetailsState {
  date_of_offence: string | null;
  offence_code: string | null;
  impositions: IFinesMacOffenceDetailsImpositionsState[] | [];
}
