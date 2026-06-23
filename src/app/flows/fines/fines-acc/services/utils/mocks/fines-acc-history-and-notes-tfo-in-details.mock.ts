import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_TFO_IN_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'TFO in', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Received from:', bold: true, hyphen: false },
        { text: 'Leeds magistrates court', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
