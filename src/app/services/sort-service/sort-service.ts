import { Injectable } from '@angular/core';
import { sort } from 'fast-sort';
import { ISortServiceConfig } from './interfaces/sort-service-interface';
import { ISortServiceValues, ISortServiceArrayValues } from './interfaces/sort-service-values';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  /**
   * Sorts an array of values in ascending order.
   *
   * @param array - The array of values to be sorted.
   * @returns The sorted array in ascending order.
   */
  public arraySortAsc(array: ISortServiceArrayValues): ISortServiceArrayValues {
    return sort(array).asc();
  }

  /**
   * Sorts an array of values in descending order.
   *
   * @param array - The array of values to be sorted.
   * @returns The sorted array in descending order.
   */
  public arraySortDsc(array: ISortServiceArrayValues): ISortServiceArrayValues {
    return sort(array).desc();
  }

  /**
   * Sorts an array of objects based on a specified key and sort type.
   *
   * @param array - The array of objects to be sorted. Each object should implement the `ISortServiceValues` interface.
   * @param config - The configuration object containing the key to sort by and the sort type (ascending or descending).
   * @returns The sorted array of objects.
   *
   * @remarks
   * - If the input array is not an array or the config key is not provided, the original array is returned.
   * - The `sortType` can be either 'ascending' or 'descending'.
   *
   * @example
   * ```typescript
   * const array = [
   *   { name: 'Alice', age: 30 },
   *   { name: 'Bob', age: 25 },
   * ];
   * const config = { key: 'age', sortType: 'ascending' };
   * const sortedArray = getObjects(array, config);
   * // sortedArray will be:
   * // [
   * //   { name: 'Bob', age: 25 },
   * //   { name: 'Alice', age: 30 },
   * // ]
   * ```
   */
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
  }

  /**
   * Sorts an array of objects in ascending order based on the specified key.
   *
   * @param array - The array of objects to be sorted.
   * @param key - The key of the object property to sort by.
   * @returns The sorted array of objects.
   */
  public sortObjectsAsc(
    array: ISortServiceValues<string | number | boolean>[],
    key: string,
  ): ISortServiceValues<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'ascending' });
  }

  /**
   * Sorts an array of objects in descending order based on the specified key.
   *
   * @param array - The array of objects to be sorted. Each object should implement the ISortServiceValues interface.
   * @param key - The key of the object property to sort by.
   * @returns The sorted array of objects in descending order.
   */
  public sortObjectsDsc(
    array: ISortServiceValues<string | number | boolean>[],
    key: string,
  ): ISortServiceValues<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'descending' });
  }
}
