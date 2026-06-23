import { IFinesAccHistoryAndNotesDetails } from '../interfaces/fines-acc-history-and-notes-details.interface';

export const FINES_ACC_HISTORY_AND_NOTES_DISHONOURED_CHEQUE_IMPOSITION_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [
    { fragments: [{ text: 'Cheque dishonoured', bold: false, hyphen: false }] },
    {
      fragments: [
        { text: 'FO', bold: false, hyphen: false },
        { text: '£40.00', bold: false, hyphen: false },
        { text: 'Created:', bold: true, hyphen: false },
        { text: '23/10/2025', bold: false, hyphen: false },
      ],
    },
    {
      fragments: [
        {
          text: 'IMP-1',
          bold: false,
          hyphen: false,
          link: { type: 'imposition', emit: 'IMP-1' },
        },
      ],
    },
  ],
  line2: null,
};
