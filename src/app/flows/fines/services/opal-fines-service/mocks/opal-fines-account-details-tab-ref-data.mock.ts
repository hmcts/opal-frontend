import { IOpalFinesAccountDetailsAtAGlanceTabRefData } from '../interfaces/opal-fines-account-details-tab-ref-data.interface';

export const OPAL_FINES_ACCOUNT_DETAILS_AT_A_GLANCE_TAB_REF_DATA_MOCK: IOpalFinesAccountDetailsAtAGlanceTabRefData = {
  version: 1,
  defendant_account_id: '123456789',
  account_number: '987654321',
  debtor_detail: {
    debtor_type: 'Individual',
    organisation: false,
    address_line_1: '123 Main Street',
    address_line_2: 'Apt 4B',
    address_line_3: null,
    address_line_4: null,
    address_line_5: null,
    post_code: 'AB12 3CD',
    document_language: 'English',
    hearing_language: 'English',
    organisation_name: null,
    organisation_aliases: null,
    title: 'Mr',
    first_names: 'John',
    surname: 'Doe',
    date_of_birth: '01/01/1980',
    national_insurance_number: 'AB123456C',
    individual_aliases: [
      {
        alias_id: '1',
        sequence_number: 1,
        surname: 'Smith',
        forenames: 'Jonathan'
      }
    ]
  },
  payment_terms: {
    payment_terms_summary: 'Monthly instalments',
    payment_terms_type_code: 'INST',
    effective_date: '01/01/2024',
    instalment_period: 'Monthly',
    lump_sum_amount: null,
    instalment_amount: 100.00,
    last_payment_date: '01/05/2024',
    next_payment_date: '01/06/2024'
  },
  enforcement_status: {
    last_enforcement_action: 'Warning issued',
    last_enforcement_action_title: 'Final Warning',
    collection_order_made: 'Yes',
    default_days_in_jail: null,
    enforcement_override_id: null,
    enforcement_override_title: null,
    last_movement_date: '03/04/2024'
  },
  account_notes: {
    account_comment: 'Account in good standing.',
    free_text_note_1: 'First note.',
    free_text_note_2: null,
    free_text_note_3: null
  }
};


