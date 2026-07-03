import { TFinesAccountHistoryTableColumn } from './fines-account-history-table-column.type';
import { TFinesAccountHistoryTableSortDirection } from './fines-account-history-table-sort-direction.type';

export type TFinesAccountHistoryTableSortState = Record<
  TFinesAccountHistoryTableColumn,
  TFinesAccountHistoryTableSortDirection
>;
