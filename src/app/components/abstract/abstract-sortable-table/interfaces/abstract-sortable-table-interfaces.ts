import { SortableValues } from '@services/sort-service/types/sort-service-type';
import { SortDirectionType } from '../types/abstract-sortable-table.type';
export interface IAbstractSortState {
  [key: string]: SortDirectionType;
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
