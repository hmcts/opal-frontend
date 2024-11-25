export interface ISortServiceInterface {
  key: string;
  sortType: 'ascending' | 'descending';
}

export interface IObjectSortableInterface {
  [key: string]: string | number | boolean;
}
