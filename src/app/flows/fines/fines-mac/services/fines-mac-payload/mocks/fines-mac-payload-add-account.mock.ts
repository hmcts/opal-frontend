import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK } from '../utils/mocks/fines-mac-payload-account-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_ADD_ACCOUNT: IFinesMacAddAccountPayload = {
  business_unit_id: 0,
  submitted_by: null,
  submitted_by_name: 'Timmy Test',
  account: {
    account_type: 'conditionalCaution',
    defendant_type: 'adultOrYouthOnly',
    originator_name: 'Crown Prosecution Service',
    originator_id: '4821',
    prosecutor_case_reference: 'P2BC305678',
    enforcement_court_id: 'Magistrates Court Database (204)',
    collection_order_made: true,
    collection_order_made_today: null,
    collection_order_date: '2024-10-22',
    suspended_committal_date: '2024-10-12',
    payment_card_request: true,
    account_sentence_date: null,
    defendant: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK,
      dob: '1985-05-15',
      organisation_name: null,
      address_line_4: null,
      address_line_5: null,
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
      debtor_detail: {
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK.debtor_detail,
        aliases: [
          {
            alias_forenames: 'Rebecca',
            alias_surname: 'Johnson',
            alias_company_name: null,
          },
        ],
      },
      parent_guardian: {
        company_flag: null,
        company_name: null,
        surname: null,
        forenames: null,
        dob: null,
        national_insurance_number: null,
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
        debtor_detail: {
          vehicle_make: null,
          vehicle_registration_mark: null,
          document_language: null,
          hearing_language: null,
          employee_reference: null,
          employer_company_name: null,
          employer_address_line_1: null,
          employer_address_line_2: null,
          employer_address_line_3: null,
          employer_address_line_4: null,
          employer_address_line_5: null,
          employer_post_code: null,
          employer_telephone_number: null,
          employer_email_address: null,
          aliases: null,
        },
      },
    },
    offences: [
      {
        date_of_sentence: '01/09/2024',
        imposing_court_id: 'Magistrates Court Database (204)',
        offence_id: 'OFF1234',
        impositions: [
          {
            result_id: 'FCC',
            amount_imposed: 900,
            amount_paid: 500,
            major_creditor_id: 3999,
            minor_creditor: null,
          },
          {
            result_id: 'FO',
            amount_imposed: 0,
            amount_paid: 0,
            major_creditor_id: null,
            minor_creditor: null,
          },
        ],
      },
    ],
    fp_ticket_detail: null,
    payment_terms: {
      payment_terms_type_code: 'B',
      effective_date: '2024-10-15',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: 12,
      enforcements: [
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '2024-10-12',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'test test',
            },
          ],
        },
      ],
    },
    account_notes: [
      {
        account_note_serial: 3,
        account_note_text: 'Follow-up required for next meeting',
        note_type: 'AC',
      },
      {
        account_note_serial: 2,
        account_note_text: 'Client prefers email communication over phone calls',
        note_type: 'AA',
      },
    ],
  },
  account_type: 'conditionalCaution',
  account_status: 'Submitted',
  timeline_data: [
    {
      username: 'Timmy Test',
      status: 'Submitted',
      status_date: '2023-07-03',
      reason_text: null,
    },
  ],
};
