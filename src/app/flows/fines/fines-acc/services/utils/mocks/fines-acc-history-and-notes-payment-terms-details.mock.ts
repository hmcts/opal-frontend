import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_PAYMENT_TERMS_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    {
      fragments: [
        { text: 'Lump sum:', bold: true, hyphen: false },
        { text: '£100.00', bold: false, hyphen: false },
      ],
    },
    {
      fragments: [
        { text: 'Instalments:', bold: true, hyphen: false },
        { text: '£25.00', bold: false, hyphen: false },
        { text: 'weekly from', bold: false, hyphen: false },
        { text: '10/11/2025', bold: false, hyphen: false },
      ],
    },
    { fragments: [{ text: '30 days in default', bold: false, hyphen: false }] },
  ],
  line2: [{ fragments: [{ text: 'Order made by agreement', bold: false, hyphen: false }] }],
};
