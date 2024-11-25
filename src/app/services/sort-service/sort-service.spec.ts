import { TestBed } from '@angular/core/testing';
import { SortService } from './sort-service';
import { IObjectSortableInterface } from './interfaces/sort-service-interface';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortService],
    });

    service = TestBed.inject(SortService);
  });

  describe('arraySortAsc', () => {
    it('should sort a string array in ascending order', () => {
      const array = ['banana', 'apple', 'cherry'];
      const sortedArray = service.arraySortAsc(array);

      expect(sortedArray).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should sort a numeric array in ascending order', () => {
      const array = [5, 2, 9, 1];
      const sortedArray = service.arraySortAsc(array);

      expect(sortedArray).toEqual([1, 2, 5, 9]);
    });

    it('should return an empty array when input is empty', () => {
      const array: number[] = [];
      const sortedArray = service.arraySortAsc(array);

      expect(sortedArray).toEqual([]);
    });
  });

  describe('arraySortDsc', () => {
    it('should sort a string array in descending order', () => {
      const array = ['banana', 'apple', 'cherry'];
      const sortedArray = service.arraySortDsc(array);

      expect(sortedArray).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should sort a numeric array in descending order', () => {
      const array = [5, 2, 9, 1];
      const sortedArray = service.arraySortDsc(array);

      expect(sortedArray).toEqual([9, 5, 2, 1]);
    });

    it('should return an empty array when input is empty', () => {
      const array: number[] = [];
      const sortedArray = service.arraySortDsc(array);

      expect(sortedArray).toEqual([]);
    });
  });

  describe('sortObjectsAsc', () => {
    it('should sort an array of objects by a specified key in ascending order', () => {
      const array: IObjectSortableInterface[] = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const sortedArray = service.sortObjectsAsc(array, 'id');

      expect(sortedArray).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should handle sorting when all keys have the same value', () => {
      const array: IObjectSortableInterface[] = [
        { id: 1, name: 'Alice' },
        { id: 1, name: 'Bob' },
        { id: 1, name: 'Charlie' },
      ];
      const sortedArray = service.sortObjectsAsc(array, 'id');

      expect(sortedArray).toEqual(array);
    });

    it('should return the input array if the key does not exist', () => {
      const array: IObjectSortableInterface[] = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const sortedArray = service.sortObjectsAsc(array, 'nonExistentKey');

      expect(sortedArray).toEqual(array);
    });
  });

  describe('sortObjectsDsc', () => {
    it('should sort an array of objects by a specified key in descending order', () => {
      const array: IObjectSortableInterface[] = [
        { id: 1, name: 'Alice' },
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
      ];
      const sortedArray = service.sortObjectsDsc(array, 'id');

      expect(sortedArray).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });

    it('should handle sorting when all keys have the same value', () => {
      const array: IObjectSortableInterface[] = [
        { id: 1, name: 'Alice' },
        { id: 1, name: 'Bob' },
        { id: 1, name: 'Charlie' },
      ];
      const sortedArray = service.sortObjectsDsc(array, 'id');

      expect(sortedArray).toEqual(array);
    });

    it('should return the input array if the key does not exist', () => {
      const array: IObjectSortableInterface[] = [
        { id: 1, name: 'Alice' },
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
      ];
      const sortedArray = service.sortObjectsDsc(array, 'nonExistentKey');

      expect(sortedArray).toEqual(array);
    });
  });
});
