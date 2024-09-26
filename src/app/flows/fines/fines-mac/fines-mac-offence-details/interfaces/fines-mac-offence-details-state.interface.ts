import { IFinesMacOffenceDetailsImpositionsState } from './fines-mac-offence-details-impositions-state.interface';

export interface IFinesMacOffenceDetailsState {
  fm_offence_details_date_of_offence: string | null;
  fm_offence_details_offence_code: string | null;
  fm_offence_details_impositions: IFinesMacOffenceDetailsImpositionsState[] | [];
}
