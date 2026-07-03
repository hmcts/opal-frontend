import { TFinesAccountHistoryTableSortDirection } from '../types/fines-account-history-table-sort-direction.type';

export interface IFinesAccountHistoryTableSortChange {
  key: string;
  sortType: TFinesAccountHistoryTableSortDirection;
}
