export interface ISortServiceInterface {
  key: string;
  sortType: 'ascending' | 'descending';
}

export interface IObjectSortableInterface<T extends string | number | boolean> {
  [key: string]: T;
}
