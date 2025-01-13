import { IFinesMacOffenceDetailsForm } from '../../../../../fines-mac-offence-details/interfaces/fines-mac-offence-details-form.interface';

export const FINES_MAC_PAYLOAD_OFFENCE_DETAILS_MINOR_CREDITOR_STATE: IFinesMacOffenceDetailsForm = {
  formData: {
    fm_offence_details_id: 0,
    fm_offence_details_date_of_sentence: '01/09/2024',
    fm_offence_details_offence_cjs_code: null,
    fm_offence_details_offence_id: 294885,
    fm_offence_details_impositions: [
      {
        fm_offence_details_result_id: 'FCOST',
        fm_offence_details_amount_imposed: 200,
        fm_offence_details_amount_paid: 100,
        fm_offence_details_balance_remaining: 100,
        fm_offence_details_needs_creditor: true,
        fm_offence_details_creditor: 'minor',
        fm_offence_details_major_creditor_id: null,
        fm_offence_details_imposition_id: 0,
      },
    ],
  },
  nestedFlow: false,
  status: 'Provided',
  childFormData: [
    {
      formData: {
        fm_offence_details_minor_creditor_creditor_type: 'individual',
        fm_offence_details_minor_creditor_title: 'Mr',
        fm_offence_details_minor_creditor_forenames: 'Test',
        fm_offence_details_minor_creditor_surname: 'Test',
        fm_offence_details_minor_creditor_company_name: null,
        fm_offence_details_minor_creditor_address_line_1: '15 ',
        fm_offence_details_minor_creditor_address_line_2: 'Test Street',
        fm_offence_details_minor_creditor_address_line_3: 'Testshire',
        fm_offence_details_minor_creditor_post_code: 'TT2 2TT',
        fm_offence_details_minor_creditor_pay_by_bacs: true,
        fm_offence_details_minor_creditor_bank_account_name: 'Mr Test Test',
        fm_offence_details_minor_creditor_bank_sort_code: '000000',
        fm_offence_details_minor_creditor_bank_account_number: '01010101',
        fm_offence_details_minor_creditor_bank_account_ref: 'Test',
        fm_offence_details_imposition_position: 0,
      },
      nestedFlow: false,
      status: 'Provided',
    },
  ],
};
