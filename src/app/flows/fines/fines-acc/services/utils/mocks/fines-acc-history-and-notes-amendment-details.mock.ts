import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'First name', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Old:', bold: true, hyphen: false },
        { text: 'John', bold: false, hyphen: false },
      ],
    },
    {
      fragments: [
        { text: 'New:', bold: true, hyphen: false },
        { text: 'Johnny', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
