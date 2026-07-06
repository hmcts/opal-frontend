import { IFinesAccountHistoryTableDefaultSort } from '../interfaces/fines-account-history-table-default-sort.interface';
import { FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS } from './fines-account-history-table-sort-directions.constant';

export const FINES_ACCOUNT_HISTORY_TABLE_DEFAULT_SORT: IFinesAccountHistoryTableDefaultSort = {
  column: 'Date',
  direction: FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS.descending,
};
