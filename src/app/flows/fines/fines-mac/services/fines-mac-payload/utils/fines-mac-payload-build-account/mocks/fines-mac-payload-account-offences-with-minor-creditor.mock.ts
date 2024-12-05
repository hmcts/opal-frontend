import { IFinesMacPayloadAccountOffences } from '../interfaces/fines-mac-payload-build-account-offences.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR: IFinesMacPayloadAccountOffences[] = [
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
        minor_creditor: {
          company_flag: false,
          title: 'Mr',
          company_name: null,
          surname: 'Test',
          forenames: 'Test',
          dob: null,
          address_line_1: 'Test',
          address_line_2: 'Test2',
          address_line_3: null,
          post_code: 'SN254ED',
          telephone: null,
          email_address: null,
          payout_hold: false,
          pay_by_bacs: null,
          bank_account_type: 1,
          bank_sort_code: null,
          bank_account_number: null,
          bank_account_name: null,
          bank_account_ref: null,
        },
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
];
