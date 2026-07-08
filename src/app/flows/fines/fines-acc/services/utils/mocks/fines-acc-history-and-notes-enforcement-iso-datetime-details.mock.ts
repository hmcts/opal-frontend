import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_ENFORCEMENT_ISO_DATETIME_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'REW', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'Hearing:', bold: false, hyphen: false },
        { text: '23/10/2025', bold: false, hyphen: true },
        { text: 'Brent magistrates court', bold: false, hyphen: true },
        { text: 'Case:', bold: false, hyphen: false },
        { text: '2500000', bold: false, hyphen: false },
      ],
    },
  ],
  line2: null,
};
