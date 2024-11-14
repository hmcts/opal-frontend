import { IFinesMacOffenceDetailsForm } from '../../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';

export const FINES_MAC_PAYLOAD_OFFENCE_DETAILS_STATE: IFinesMacOffenceDetailsForm = {
  formData: {
    fm_offence_details_id: 0,
    fm_offence_details_date_of_sentence: '01/09/2024',
    fm_offence_details_offence_id: 'OFF1234',
    fm_offence_details_impositions: [
      {
        fm_offence_details_imposition_id: 0,
        fm_offence_details_result_id: 'FCC',
        fm_offence_details_amount_imposed: 900,
        fm_offence_details_amount_paid: 500,
        fm_offence_details_balance_remaining: 400,
        fm_offence_details_needs_creditor: true,
        fm_offence_details_creditor: 'major',
        fm_offence_details_major_creditor_id: 3999,
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
    ],
  },
  nestedFlow: false,
  status: 'Provided',
  childFormData: null,
};
