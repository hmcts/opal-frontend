import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';

export const FINES_MAC_PAYLOAD_ADD_ACCOUNT: IFinesMacAddAccountPayload = {
  business_unit_id: 0,
  submitted_by: null,
  submitted_by_name: 'Timmy Test',
  account: {
    account_type: 'conditionalCaution',
    defendant_type: 'individual',
    originator_name: null,
    originator_id: null,
    prosecutor_case_reference: null,
    enforcement_court_id: null,
    collection_order_made: true,
    collection_order_made_today: null,
    collection_order_date: '2024-11-05',
    suspended_committal_date: '2024-10-25',
    payment_card_request: true,
    account_sentence_date: null,
    defendant: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
      company_flag: false,
      title: 'Ms',
      surname: 'Smith',
      forenames: 'Emily',
      dob: '1982-07-15',
      address_line_1: '789 Elm Street',
      address_line_2: 'Downtown',
      address_line_3: 'Hampshire',
      post_code: 'XY45 6ZT',
      telephone_number_home: '01612345678',
      telephone_number_business: '02079461234',
      telephone_number_mobile: '07891234567',
      email_address_1: 'random.email1@example.com',
      email_address_2: 'random.email2@example.com',
      national_insurance_number: 'CD789012E',
      debtor_detail: {
        vehicle_make: 'Honda',
        vehicle_registration_mark: 'GH456JKL',
        document_language: 'welshEnglish',
        hearing_language: 'welshEnglish',
        employee_reference: 'REF12345XYZ',
        employer_company_name: 'Random Corp Solutions',
        employer_address_line_1: '123 Random Street',
        employer_address_line_2: 'Suite 200',
        employer_address_line_3: 'Business Park',
        employer_address_line_4: 'Northside',
        employer_address_line_5: 'Metropolis',
        employer_post_code: 'RN20 3PQ',
        employer_telephone_number: '01987654321',
        employer_email_address: 'contact@randomcorp.com',
        aliases: null,
      },
    },
    offences: [
      {
        date_of_sentence: '12/09/2021',
        imposing_court_id: null,
        offence_id: 'OFF123456',
        impositions: [
          {
            result_id: 'FCC',
            amount_imposed: 200,
            amount_paid: 50,
            major_creditor_id: 3856,
            minor_creditor: null,
          },
        ],
      },
    ],
    fp_ticket_detail: null,
    payment_terms: {
      payment_terms_type_code: 'B',
      effective_date: '2024-10-28',
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: 14,
      enforcements: [
        {
          result_id: 'PRIS',
          enforcement_result_responses: [
            {
              parameter_name: 'earliestreleasedate',
              response: '2024-11-05',
            },
            {
              parameter_name: 'prisonandprisonnumber',
              response: 'Greenwood Correctional, 67890',
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
