import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_AMENDMENT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'First name', bold: true, hyphen: false }] },
    {
      fragments: [
        { text: 'Old:', bold: false, hyphen: false },
        { text: 'John', bold: true, hyphen: false },
      ],
    },
    {
      fragments: [
        { text: 'New:', bold: false, hyphen: false },
        { text: 'Johnny', bold: true, hyphen: false },
      ],
    },
  ],
  line2: null,
};
