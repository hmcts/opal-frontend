import { SortableValues } from 'opal-frontend-common';

export interface IAbstractSortState {
  [key: string]: 'ascending' | 'descending' | 'none';
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
