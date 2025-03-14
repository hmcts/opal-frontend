import { IFinesMacOffenceDetailsImpositionsState } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-impositions-state.interface';
import { IFinesMacOffenceDetailsState } from '../../../../../../src/app/flows/fines/fines-mac/fines-mac-offence-details/interfaces/fines-mac-offence-details-state.interface';

export const FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK: IFinesMacOffenceDetailsImpositionsState[] = [
  {
    fm_offence_details_imposition_id: 0,
    fm_offence_details_result_id: 'FCC',
    fm_offence_details_amount_imposed: 200,
    fm_offence_details_amount_paid: 50,
    fm_offence_details_balance_remaining: 150,
    fm_offence_details_needs_creditor: true,
    fm_offence_details_creditor: 'major',
    fm_offence_details_major_creditor_id: 3856,
  },
  {
    fm_offence_details_imposition_id: 1,
    fm_offence_details_result_id: 'FO',
    fm_offence_details_amount_imposed: 0,
    fm_offence_details_amount_paid: 0,
    fm_offence_details_balance_remaining: 0,
    fm_offence_details_needs_creditor: false,
    fm_offence_details_creditor: null,
    fm_offence_details_major_creditor_id: null,
  },
];

export const FINES_MAC_OFFENCE_DETAILS_STATE_MOCK: IFinesMacOffenceDetailsState = {
  fm_offence_details_id: 0,
  fm_offence_details_date_of_sentence: '01/09/2024',
  fm_offence_details_offence_cjs_code: 'AK123456',
  fm_offence_details_offence_id: 123,
  fm_offence_details_impositions: structuredClone(FINES_MAC_OFFENCE_DETAILS_STATE_IMPOSITIONS_MOCK),
};
