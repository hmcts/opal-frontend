import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_TEXT_AMOUNT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    {
      fragments: [
        { text: 'Lump sum:', bold: false, hyphen: false },
        { text: 'No payment', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
