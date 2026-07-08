import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_WRITE_OFF_CONSOLIDATED_ACCOUNT_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails =
  {
    line1: [
      { fragments: [{ text: 'Write-off', bold: false, hyphen: false }] },
      {
        fragments: [
          { text: 'Consolidated', bold: false, hyphen: false },
          {
            text: '2500000BV',
            bold: false,
            hyphen: true,
            link: { type: 'account', emit: '123123' },
          },
        ],
      },
      { fragments: [{ text: 'Write-off reason', bold: false, hyphen: false }] },
    ],
    line2: null,
  };
