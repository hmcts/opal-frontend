import { IFinesMacPayloadAccountOffences } from '../interfaces/fines-mac-payload-account-offences.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MINOR_CREDITOR: IFinesMacPayloadAccountOffences[] = [
  {
    date_of_sentence: '01/09/2024',
    imposing_court_id: 'Magistrates Court Database (204)',
    offence_id: 294885,
    impositions: [
      {
        result_id: 'FCOST',
        amount_imposed: 200,
        amount_paid: 100,
        major_creditor_id: null,
        minor_creditor: {
          company_flag: false,
          title: 'Mr',
          company_name: null,
          surname: 'Test',
          forenames: 'Test',
          dob: null,
          address_line_1: '15 ',
          address_line_2: 'Test Street',
          address_line_3: 'Testshire',
          post_code: 'TT2 2TT',
          telephone: null,
          email_address: null,
          payout_hold: true,
          pay_by_bacs: true,
          bank_account_type: 1,
          bank_sort_code: '000000',
          bank_account_number: '01010101',
          bank_account_name: 'Mr Test Test',
          bank_account_ref: 'Test',
        },
      },
    ],
  },
];
