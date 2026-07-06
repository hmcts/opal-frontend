import { IHistoryDetails } from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../constants/fines-account-history-table-display.constant';

export interface IFinesAccountHistoryTableRow {
  id: string;
  Date: number | null;
  displayDate: number | null;
  User: string | null;
  Type: string | null;
  Details: string;
  Amount: number | null;
  absoluteAmount: number | null;
  amountAriaId: string;
  amountDescription:
    | typeof FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.credit
    | typeof FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountDescriptions.debit
    | null;
  amountTag:
    | typeof FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.credit
    | typeof FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.amountTags.debit
    | null;
  details: IHistoryDetails | null;
}
