import { IFinesAccountHistoryTableRow } from './fines-account-history-table-row.interface';

export interface IFinesAccountHistoryTableRowMockOptions {
  amount: number | null;
  date: number;
  details: IFinesAccountHistoryTableRow['details'];
  detailsText: string;
  type: string;
  user: string;
}
