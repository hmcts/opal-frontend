export interface IAbstractSortState {
  [key: string]: 'ascending' | 'descending' | 'none';
}
export interface IAbstractTableData<T extends string | number | boolean> {
  [key: string]: T;
}
