import { IFinesMacOffenceDetailsImpositionsState } from '../interfaces/fines-mac-offence-details-impositions-state.interface';
import { IFinesMacOffenceDetailsState } from '../interfaces/fines-mac-offence-details-state.interface';

export const FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_result_code: 'FCC',
    fm_offence_details_amount_imposed: 200,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 150,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: 'major',
    fm_offence_details_major_creditor: 3856,
  },
  {
    fm_offence_details_result_code: null,
    fm_offence_details_amount_imposed: 0,
    fm_offence_details_amount_paid: 0,
    fm_offence_details_balance_remaining: 0,
    fm_offence_details_needs_creditor: false,
    fm_offence_details_creditor: null,
    fm_offence_details_major_creditor: null,
  },
];

export const FINES_MAC_OFFENCE_DETAILS_STATE_MOCK: IFinesMacOffenceDetailsState = {
  fm_offence_details_id: 0,
  fm_offence_details_date_of_offence: '01/09/2024',
  fm_offence_details_offence_code: 'OFF123',
  fm_offence_details_impositions: FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK,
};
