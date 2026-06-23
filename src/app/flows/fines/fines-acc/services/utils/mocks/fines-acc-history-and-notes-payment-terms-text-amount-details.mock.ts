import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    {
      fragments: [
        { text: 'Lump sum:', bold: true, hyphen: false },
        { text: 'No payment', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
