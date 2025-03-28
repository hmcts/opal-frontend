import { SortableValues } from '@hmcts/opal-frontend-common/core/types';

export interface IAbstractSortState {
  [key: string]: 'ascending' | 'descending' | 'none';
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
