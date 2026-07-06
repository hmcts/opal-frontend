import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_CHEQUE_TRANSACTION_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'Cheque issued', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Cheque number:', bold: false, hyphen: false },
        { text: '524589', bold: false, hyphen: false },
      ],
    },
    { fragments: [{ text: 'Cheque cancelled 10/11/2025', bold: false, hyphen: false }] },
  ],
  line2: null,
};
