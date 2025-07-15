import { IFinesMacPayloadAccountOffences } from '../interfaces/fines-mac-payload-account-offences.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR: IFinesMacPayloadAccountOffences[] = [
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
];
