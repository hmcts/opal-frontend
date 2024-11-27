import { TestBed } from '@angular/core/testing';
import { SortService } from './sort-service';
import { SORT_OBJECT_INPUT_MOCK } from './mocks/sort-service-object-input-mock';
import { ISortServiceValues } from './interfaces/sort-service-values';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('arraySortAsc', () => {
    it('should sort an array of numbers in ascending order', () => {
      const input = [5, 3, 8, 1];
      const result = service.arraySortAsc(input);
      expect(result).toEqual([1, 3, 5, 8]);
    });
    it('should sort an array of strings in ascending order', () => {
      const input = ['banana', 'apple', 'cherry'];
      const result = service.arraySortAsc(input);
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should handle an empty array', () => {
      const input: number[] = [];
      const result = service.arraySortAsc(input);
      expect(result).toEqual([]);
    });
  });

  describe('arraySortDsc', () => {
    it('should sort an array of numbers in descending order', () => {
      const input = [5, 3, 8, 1];
      const result = service.arraySortDesc(input);
      expect(result).toEqual([8, 5, 3, 1]);
    });

    it('should sort an array of strings in descending order', () => {
      const input = ['banana', 'apple', 'cherry'];
      const result = service.arraySortDesc(input);
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should handle an empty array', () => {
      const input: number[] = [];
      const result = service.arraySortDesc(input);
      expect(result).toEqual([]);
    });
  });

  describe('sortObjectsAsc', () => {
    it('should sort an array of objects in ascending order by a specified key', () => {
      const result = service.sortObjectArrayAsc(SORT_OBJECT_INPUT_MOCK, 'id');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should handle an empty array', () => {
      const input: [] = [];
      const result = service.sortObjectArrayAsc(input, 'id');
      expect(result).toEqual([]);
    });

    it('should handle invalid key gracefully', () => {
      const result = service.sortObjectArrayAsc(SORT_OBJECT_INPUT_MOCK, 'age');
      expect(result).toEqual(SORT_OBJECT_INPUT_MOCK);
    });
  });

  describe('sortObjectsDsc', () => {
    it('should sort an array of objects in descending order by a specified key', () => {
      const result = service.sortObjectArrayDesc(SORT_OBJECT_INPUT_MOCK, 'id');
      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });

    it('should handle an empty array', () => {
      const input: [] = [];
      const result = service.sortObjectArrayDesc(input, 'id');
      expect(result).toEqual([]);
    });

    it('should handle invalid key gracefully', () => {
      const result = service.sortObjectArrayDesc(SORT_OBJECT_INPUT_MOCK, 'age');
      expect(result).toEqual(SORT_OBJECT_INPUT_MOCK);
    });
  });

  describe('getObjects (private)', () => {
    it('should return the array if it is empty', () => {
      const input: [] = [];
      const result = service['sortObjectArray'](input, { key: 'id', sortType: 'ascending' });
      expect(result).toEqual(input);
    });

    it('should return the array if config key is not provided', () => {
      const result = service['sortObjectArray'](SORT_OBJECT_INPUT_MOCK, { key: '', sortType: 'ascending' });
      expect(result).toEqual(SORT_OBJECT_INPUT_MOCK);
    });

    it('should return the array if it is not an array', () => {
      const input = null;
      const result = service['sortObjectArray'](input as ISortServiceValues<string | number | boolean>[] | null, {
        key: 'id',
        sortType: 'ascending',
      });
      expect(result).toEqual(input);
    });

    it('should sort objects in ascending order if sortType is "ascending"', () => {
      // Access via the public sortObjectsAsc method
      const result = service.sortObjectArrayAsc(SORT_OBJECT_INPUT_MOCK, 'id');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should sort objects in descending order if sortType is "descending"', () => {
      const result = service.sortObjectArrayDesc(SORT_OBJECT_INPUT_MOCK, 'id');
      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });
  });
});
