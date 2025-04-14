export interface ISortServiceValues<T extends string | number | boolean | null> {
  [key: string]: T;
}

export interface ISortServiceArrayValues extends Array<string | number | boolean | null> {
  [key: number]: string | number | boolean | null;
}
