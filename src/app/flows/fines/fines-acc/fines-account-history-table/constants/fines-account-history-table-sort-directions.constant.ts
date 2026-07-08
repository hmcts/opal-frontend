import { TFinesAccountHistoryTableSortDirection } from '../types/fines-account-history-table-sort-direction.type';

export const FINES_ACCOUNT_HISTORY_TABLE_SORT_DIRECTIONS = {
  ascending: 'ascending',
  descending: 'descending',
  none: 'none',
} as const satisfies Record<string, TFinesAccountHistoryTableSortDirection>;
