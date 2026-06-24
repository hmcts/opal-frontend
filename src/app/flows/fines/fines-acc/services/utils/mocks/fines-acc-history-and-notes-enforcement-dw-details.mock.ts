import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_DW_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'DW', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Warrant number:', bold: true, hyphen: false },
        { text: '003/25/00006', bold: false, hyphen: false },
      ],
    },
  ],
  line2: [{ fragments: [{ text: 'Test enforcement', bold: false, hyphen: false }] }],
};
