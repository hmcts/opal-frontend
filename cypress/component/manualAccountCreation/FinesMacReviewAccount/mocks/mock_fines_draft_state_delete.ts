import { IFinesMacAddAccountPayload } from '../../../../../src/app/flows/fines/fines-mac/services/fines-mac-payload/interfaces/fines-mac-payload-add-account.interfaces';

export const MOCK_FINES_DRAFT_STATE_DELETE: IFinesMacAddAccountPayload = {
  draft_account_id: 123,
  created_at: '2025-01-01',
  account_snapshot: null,
  account_status_date: null,
  business_unit_id: null,
  submitted_by: null,
  submitted_by_name: null,
  account: {
    account_type: null,
    defendant_type: null,
    originator_name: null,
    originator_id: null,
    prosecutor_case_reference: null,
    enforcement_court_id: null,
    collection_order_made: null,
    collection_order_made_today: null,
    collection_order_date: null,
    suspended_committal_date: null,
    payment_card_request: null,
    account_sentence_date: null,
    defendant: {
      company_flag: null,
      title: null,
      surname: null,
      forenames: null,
      company_name: null,
      dob: null,
      address_line_1: null,
      address_line_2: null,
      address_line_3: null,
      address_line_4: null,
      address_line_5: null,
      post_code: null,
      telephone_number_home: null,
      telephone_number_business: null,
      telephone_number_mobile: null,
      email_address_1: null,
      email_address_2: null,
      national_insurance_number: null,
      driving_licence_number: null,
      pnc_id: null,
      nationality_1: null,
      nationality_2: null,
      ethnicity_self_defined: null,
      ethnicity_observed: null,
      cro_number: null,
      occupation: null,
      gender: null,
      custody_status: null,
      prison_number: null,
      interpreter_lang: null,
      debtor_detail: null,
      parent_guardian: null,
    },
    offences: [
      {
        date_of_sentence: null,
        imposing_court_id: null,
        offence_id: null,
        impositions: [
          {
            result_id: null,
            amount_imposed: null,
            amount_paid: null,
            major_creditor_id: null,
            minor_creditor: null,
          },
        ],
      },
    ],
    fp_ticket_detail: null,
    payment_terms: {
      payment_terms_type_code: null,
      effective_date: null,
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: null,
      enforcements: [
        {
          result_id: null,
          enforcement_result_responses: [
            {
              parameter_name: null,
              response: null,
            },
          ],
        },
      ],
    },
    account_notes: null,
  },
  account_type: null,
  account_status: 'Deleted',
  timeline_data: [
    {
      username: 'Test User 1',
      status: 'Deleted',
      status_date: '2025-01-01',
      reason_text: '',
    },
  ],
  version: 0,
};
