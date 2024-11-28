import { SortableValues } from '@services/sort-service/types/sort-service-type';
export interface IAbstractSortState {
  [key: string]: 'ascending' | 'descending' | 'none';
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
