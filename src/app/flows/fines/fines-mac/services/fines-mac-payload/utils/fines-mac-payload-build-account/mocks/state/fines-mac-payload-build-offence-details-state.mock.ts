import { IFinesMacOffenceDetailsForm } from '../../../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';

export const FINES_MAC_PAYLOAD_BUILD_OFFENCE_DETAILS_STATE: IFinesMacOffenceDetailsForm = {
  formData: {
    fm_offence_details_id: 0,
    fm_offence_details_date_of_sentence: '01/09/2024',
    fm_offence_details_offence_id: 'OFF1234',
    fm_offence_details_impositions: [
      {
        fm_offence_details_imposition_id: 0,
        fm_offence_details_result_id: 'FCOST',
        fm_offence_details_amount_imposed: 900,
        fm_offence_details_amount_paid: 500,
        fm_offence_details_balance_remaining: 400,
        fm_offence_details_needs_creditor: false,
        fm_offence_details_creditor: 'major',
        fm_offence_details_major_creditor_id: 3999,
      },
    ],
  },
  nestedFlow: false,
  status: 'Provided',
  childFormData: null,
};
