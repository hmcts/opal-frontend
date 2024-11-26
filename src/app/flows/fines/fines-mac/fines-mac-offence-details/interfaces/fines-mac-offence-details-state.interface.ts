import { IFinesMacOffenceDetailsImpositionsState } from './fines-mac-offence-details-impositions-state.interface';

export interface IFinesMacOffenceDetailsState {
  fm_offence_details_id: number;
  fm_offence_details_date_of_sentence: string | null;
  fm_offence_details_offence_id: string | null;
  fm_offence_details_impositions: IFinesMacOffenceDetailsImpositionsState[] | [];
}
