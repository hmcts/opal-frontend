import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { FINES_MAC_ACCOUNT_TYPES } from '../../../constants/fines-mac-account-types';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT } from '../constants/fines-mac-payload-account-defendant.constant';
import { IFinesMacAddAccountPayload } from '../interfaces/fines-mac-payload-add-account.interfaces';
import { FINES_MAC_PAYLOAD_ACCOUNT_DEFENDANT_INDIVIDUAL_MOCK } from '../utils/mocks/fines-mac-payload-account-defendant-individual.mock';

export const FINES_MAC_PAYLOAD_ADD_ACCOUNT_FIXED_PENALTY_MOCK: IFinesMacAddAccountPayload = {
  draft_account_id: null,
  created_at: null,
  account_snapshot: null,
  account_status_date: null,
  business_unit_id: 61,
  submitted_by: null,
  submitted_by_name: OPAL_USER_STATE_MOCK.name,
  account: {
    account_type: FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'],
    defendant_type: 'adultOrYouthOnly',
    originator_name: 'Crown Prosecution Service',
    originator_id: '4821',
    prosecutor_case_reference: 'P2BC305678',
    enforcement_court_id: 'Magistrates Court Database (204)',
    collection_order_made: null,
    collection_order_made_today: null,
    collection_order_date: null,
    suspended_committal_date: null,
    payment_card_request: null,
    account_sentence_date: '2024-12-12',
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
      parent_guardian: null,
    },
    offences: [
      {
        date_of_sentence: '2024-12-12',
        imposing_court_id: 'Magistrates Court Database (204)',
        offence_id: 12345,
        impositions: [
          {
            result_id: 'FO',
            amount_imposed: 100.55,
            amount_paid: 0,
            major_creditor_id: null,
            minor_creditor: null,
          },
        ],
      },
    ],
    fp_ticket_detail: {
      notice_number: '12345',
      date_of_issue: '2024-12-12',
      time_of_issue: '10:12',
      place_of_offence: 'High Street, Aberystwyth',
      fp_registration_number: 'AB12 CJP',
      fp_driving_licence_number: 'AB123456CDE',
      notice_to_owner_hirer: 'NTO123456',
    },
    payment_terms: {
      payment_terms_type_code: 'B',
      effective_date: null,
      instalment_period: null,
      lump_sum_amount: null,
      instalment_amount: null,
      default_days_in_jail: null,
      enforcements: null,
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
  account_type: FINES_MAC_ACCOUNT_TYPES['Fixed Penalty'],
  account_status: 'Submitted',
  account_status_message: null,
  timeline_data: [
    {
      username: OPAL_USER_STATE_MOCK.name,
      status: 'Submitted',
      status_date: '2023-07-03',
      reason_text: null,
    },
  ],
  version: '0',
};
