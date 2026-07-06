import { TFinesAccountHistoryTableColumn } from '../types/fines-account-history-table-column.type';
import { TFinesAccountHistoryTableSortDirection } from '../types/fines-account-history-table-sort-direction.type';

export interface IFinesAccountHistoryTableDefaultSort {
  column: TFinesAccountHistoryTableColumn;
  direction: TFinesAccountHistoryTableSortDirection;
}
