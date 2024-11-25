import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';

export interface ITableComponentTableData extends IObjectSortableInterface<string | number> {
  imposition: string;
  creditor: string;
  amountImposed: number;
  amountPaid: number;
  balanceRemaining: number;
}

export interface ISortState {
  imposition: 'ascending' | 'descending' | 'none';
  creditor: 'ascending' | 'descending' | 'none';
  amountImposed: 'ascending' | 'descending' | 'none';
  amountPaid: 'ascending' | 'descending' | 'none';
  balanceRemaining: 'ascending' | 'descending' | 'none';
}
