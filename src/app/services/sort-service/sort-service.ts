import { Injectable } from '@angular/core';
import { sort } from 'fast-sort';
import { ISortServiceInterface, IObjectSortableInterface } from './interfaces/sort-service-interface';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  public arraySortAsc(array: (string | number)[]): (string | number)[] {
    return sort(array).asc();
  }

  public arraySortDsc(array: (string | number)[]): (string | number)[] {
    return sort(array).desc();
  }

  private getObjects(
    array: IObjectSortableInterface<string | number | boolean>[],
    config: ISortServiceInterface,
  ): { [key: string]: string | number | boolean }[] {
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

  public sortObjectsAsc(
    array: IObjectSortableInterface<string | number | boolean>[],
    key: string,
  ): IObjectSortableInterface<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'ascending' });
  }

  public sortObjectsDsc(
    array: IObjectSortableInterface<string | number | boolean>[],
    key: string,
  ): IObjectSortableInterface<string | number | boolean>[] {
    return this.getObjects(array, { key, sortType: 'descending' });
  }
}
