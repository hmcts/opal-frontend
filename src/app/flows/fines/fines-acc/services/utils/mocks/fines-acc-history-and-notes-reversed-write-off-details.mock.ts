import { IHistoryDetails as IFinesAccHistoryAndNotesDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';

export const FINES_ACC_HISTORY_AND_NOTES_REVERSED_WRITE_OFF_DETAILS_MOCK: IFinesAccHistoryAndNotesDetails = {
  line1: [{ fragments: [{ text: 'Write-off reversed', bold: false, hyphen: false }] }],
  line2: [{ fragments: [{ text: 'Reversed following review', bold: false, hyphen: false }] }],
};
