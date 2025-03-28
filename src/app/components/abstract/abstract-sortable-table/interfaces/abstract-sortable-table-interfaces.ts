import { SortableValues } from '@hmcts/opal-frontend-common/types';

export interface IAbstractSortState {
  [key: string]: 'ascending' | 'descending' | 'none';
}
export interface IAbstractTableData<T extends SortableValues> {
  [key: string]: T;
}
