import { Injectable } from '@angular/core';
import { sort } from 'fast-sort';
import { ISortServiceConfig } from './interfaces/sort-service-interface';
import { ISortServiceValues, ISortServiceArrayValues } from './interfaces/sort-service-values';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  public arraySortAsc(array: ISortServiceArrayValues): ISortServiceArrayValues {
    return sort(array).asc();
  } //** Sorts and array in ascending order. Pass in an array with string | number | boolean types */

  public arraySortDsc(array: ISortServiceArrayValues): ISortServiceArrayValues {
    return sort(array).desc();
  } //** Sorts and array in descending order. Pass in an array with string | number | boolean types */

  private getObjects(
    array: ISortServiceValues<string | number | boolean>[],
    config: ISortServiceConfig,
  ): ISortServiceValues<string | number | boolean>[] {
    if (!Array.isArray(array) || !config.key) {
      return array;
    }

    const { key, sortType } = config;

    if (sortType === 'ascending') {
      return sort(array).asc((obj) => obj[key]);
    } else {
      return sort(array).desc((obj) => obj[key]);
    }
  } //** Takes in an object and seperates it into arrays, sorts each arrays and reconstructs the object into the key:value pairs. */

  public sortObjectsAsc(
    array: ISortServiceValues<string | number | boolean>[],
    key: string,
  ): ISortServiceValues<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'ascending' });
  } //** This will be used to help call the getObject function by passing it in the correct format. */

  public sortObjectsDsc(
    array: ISortServiceValues<string | number | boolean>[],
    key: string,
  ): ISortServiceValues<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'descending' });
  } //** This will be used to help call the getObject function by passing it in the correct format. */
}
