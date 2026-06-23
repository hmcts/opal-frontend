import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_WARRANT_NO_REASON_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'BWTD', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Warrant number:', bold: true, hyphen: false },
        { text: '1012500012', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
