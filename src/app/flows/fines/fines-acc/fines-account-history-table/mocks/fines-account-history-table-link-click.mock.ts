import { IFinesAccountHistoryTableLinkClick } from '../interfaces/fines-account-history-table-link-click.interface';
import { FINES_ACCOUNT_HISTORY_TABLE_DISPLAY } from '../constants/fines-account-history-table-display.constant';

export const FINES_ACCOUNT_HISTORY_TABLE_LINK_CLICK_MOCK: IFinesAccountHistoryTableLinkClick = {
  type: 'account',
  emit: '123123',
  rowId: `${FINES_ACCOUNT_HISTORY_TABLE_DISPLAY.rowIdPrefix}1`,
};
