import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_CONSOLIDATION_TRANSACTION_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'Account consolidated', bold: false, hyphen: false }] },
    {
      fragments: [
        {
          text: '2500000BV',
          bold: false,
          hyphen: false,
          link: { type: 'account', emit: '123123' },
        },
      ],
    },
    { fragments: [{ text: 'Amount credited to master account', bold: false, hyphen: false }] },
  ],
  line2: null,
};
