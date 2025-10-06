import { IFinesMacPayloadAccountOffences } from '../interfaces/fines-mac-payload-account-offences.interface';

export const FINES_MAC_PAYLOAD_ACCOUNT_OFFENCES_WITH_MAJOR_CREDITOR: IFinesMacPayloadAccountOffences[] = [
  {
    date_of_sentence: '01/09/2024',
    imposing_court_id: null,
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
