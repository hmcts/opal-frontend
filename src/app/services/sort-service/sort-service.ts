import { Injectable } from '@angular/core';
import { sort } from 'fast-sort';
import { ISortServiceInterface } from './interfaces/sort-service-interface';

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

  private getObjects(array: { [key: string]: unknown }[], config: ISortServiceInterface): { [key: string]: unknown }[] {
    if (!array || !Array.isArray(array) || !config || !config.key) {
      return array;
    }

    const { key, sortType } = config;

    if (sortType === 'asc') {
      return sort(array).asc((obj) => obj[key]);
    } else {
      return sort(array).desc((obj) => obj[key]);
    }
  }

  public sortObjectsAsc(array: { [key: string]: unknown }[], key: string): { [key: string]: unknown }[] {
    return this.getObjects(array, { key, sortType: 'asc' });
  }

  public sortObjectsDsc(array: { [key: string]: unknown }[], key: string): { [key: string]: unknown }[] {
    return this.getObjects(array, { key, sortType: 'desc' });
  }
}
