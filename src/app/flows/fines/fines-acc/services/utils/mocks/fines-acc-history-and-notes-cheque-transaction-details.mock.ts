import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'Cheque issued', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Cheque number:', bold: true, hyphen: false },
        { text: '524589', bold: false, hyphen: false },
      ],
    },
    { fragments: [{ text: 'Cheque cancelled 10/11/2025', bold: false, hyphen: false }] },
  ],
  line2: null,
};
