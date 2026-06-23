import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_PREFORMATTED_AMOUNT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails =
  {
    line1: [
      {
        fragments: [
          { text: 'Instalments:', bold: true, hyphen: false },
          { text: '£25.00', bold: false, hyphen: false },
          { text: 'monthly from', bold: false, hyphen: false },
          { text: 'pending', bold: false, hyphen: false },
        ],
      },
    ],
    line2: null,
  };
