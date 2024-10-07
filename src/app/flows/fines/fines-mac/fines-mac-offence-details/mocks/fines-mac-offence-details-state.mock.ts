import { IFinesMacOffenceDetailsImpositionsState } from '../interfaces/fines-mac-offence-details-impositions-state.interface';
import { IFinesMacOffenceDetailsState } from '../interfaces/fines-mac-offence-details-state.interface';

export const FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK: IFinesMacOffenceDetailsImpositionsState = {
  fm_offence_details_result_code: 'SUCCESS',
  fm_offence_details_amount_imposed: 1000,
  fm_offence_details_amount_paid: 500,
  fm_offence_details_balance_remaining: 500,
  fm_offence_details_needsCreditor: true,
  fm_offence_details_creditor: 'Creditor XYZ',
};

export const FINES_MAC_OFFENCE_DETAILS_STATE_MOCK: IFinesMacOffenceDetailsState = {
  fm_offence_details_index: 0,
  fm_offence_details_date_of_offence: '01/09/2024',
  fm_offence_details_offence_code: 'OFF123',
  fm_offence_details_impositions: [FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK],
};
