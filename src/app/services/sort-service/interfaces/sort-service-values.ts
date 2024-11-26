export interface ISortServiceValues<T extends string | number | boolean> {
  [key: string]: T;
}

export interface ISortServiceArrayValues extends Array<string | number | boolean> {
  [key: number]: string | number | boolean;
}
