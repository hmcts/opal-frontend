import { IFinesAccountHistoryTableLinkClick } from '../../../../fines-account-history-table/interfaces/fines-account-history-table-link-click.interface';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../../../../fines-account-history-table/constants/fines-account-history-table-display.constant';

export const FINES_ACC_DEFENDANT_DETAILS_HISTORY_AND_NOTES_TABLE_ACCOUNT_LINK_MOCK: IFinesAccountHistoryTableLinkClick =
  {
    type: 'account',
    emit: '123123',
    rowId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}0`,
  };
