import { FINES_MAC_ACCOUNT_TYPES } from '../../../constants/fines-mac-account-types';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN } from '../constants/fines-mac-payload-account-defendant-parent-guardian.constant';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK } from '../utils/mocks/fines-mac-payload-account-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_ADD_ACCOUNT: IFinesMacAddAccountPayload = {
  draft_account_id: null,
  created_at: null,
  account_snapshot: null,
  account_status_date: null,
  business_unit_id: 61,
  submitted_by: null,
  submitted_by_name: 'Timmy Test',
  account: {
    account_type: FINES_MAC_ACCOUNT_TYPES['Conditional Caution'],
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
    account_sentence_date: '2024-09-01',
    defendant: {
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT,
      ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK,
      dob: '1985-05-15',
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
        ...FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_PARENT_GUARDIAN,
      },
    },
    offences: [
      {
        date_of_sentence: '2024-09-01',
        imposing_court_id: 'Magistrates Court Database (204)',
        offence_id: 1234,
        impositions: [
          {
            result_id: 'FCOST',
            amount_imposed: 900,
            amount_paid: 500,
            major_creditor_id: 3999,
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
          result_id: 'COLLO',
          enforcement_result_responses: null,
        },
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
  account_type: FINES_MAC_ACCOUNT_TYPES['Conditional Caution'],
  account_status: 'Submitted',
  account_status_message: null,
  timeline_data: [
    {
      username: 'Timmy Test',
      status: 'Submitted',
      status_date: '2023-07-03',
      reason_text: null,
    },
  ],
  version: 0,
};
