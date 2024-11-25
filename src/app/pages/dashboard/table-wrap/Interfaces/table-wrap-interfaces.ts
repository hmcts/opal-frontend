import { IObjectSortableInterface } from '@services/sort-service/interfaces/sort-service-interface';

export interface ITableComponentTableData extends IObjectSortableInterface {}

export interface ISortState {
  imposition: 'ascending' | 'descending' | 'none';
  creditor: 'ascending' | 'descending' | 'none';
  amountImposed: 'ascending' | 'descending' | 'none';
  amountPaid: 'ascending' | 'descending' | 'none';
  balanceRemaining: 'ascending' | 'descending' | 'none';
}
