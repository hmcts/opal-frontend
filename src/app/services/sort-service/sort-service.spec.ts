import { TestBed } from '@angular/core/testing';
import { SortService } from './sort-service';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SortService],
    });
    service = TestBed.inject(SortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('arraySortAsc', () => {
    it('should sort an array of numbers in ascending order', () => {
      const input = [5, 2, 9, 1, 4];
      const expected = [1, 2, 4, 5, 9];
      expect(service.arraySortAsc(input)).toEqual(expected);
    });

    it('should sort an array of strings in ascending order', () => {
      const input = ['banana', 'apple', 'cherry'];
      const expected = ['apple', 'banana', 'cherry'];
      expect(service.arraySortAsc(input)).toEqual(expected);
    });

    it('should sort a mixed array of numbers and strings in ascending order', () => {
      const input = ['banana', 5, 'apple', 1];
      const expected = [1, 5, 'apple', 'banana'];
      expect(service.arraySortAsc(input)).toEqual(expected);
    });

    it('should return an empty array when input is empty', () => {
      const input: (string | number)[] = [];
      expect(service.arraySortAsc(input)).toEqual([]);
    });
  });

  describe('arraySortDsc', () => {
    it('should sort an array of numbers in descending order', () => {
      const input = [5, 2, 9, 1, 4];
      const expected = [9, 5, 4, 2, 1];
      expect(service.arraySortDsc(input)).toEqual(expected);
    });

    it('should sort an array of strings in descending order', () => {
      const input = ['banana', 'apple', 'cherry'];
      const expected = ['cherry', 'banana', 'apple'];
      expect(service.arraySortDsc(input)).toEqual(expected);
    });

    it('should sort a mixed array of numbers and strings in descending order', () => {
      const input = ['banana', 5, 'apple', 1];
      const expected = ['banana', 'apple', 5, 1];
      expect(service.arraySortDsc(input)).toEqual(expected);
    });

    it('should return an empty array when input is empty', () => {
      const input: (string | number)[] = [];
      expect(service.arraySortDsc(input)).toEqual([]);
    });
  });

  describe('sortObjectsAsc', () => {
    it('should sort an array of objects in ascending order by a given key', () => {
      const input = [
        { id: 3, name: 'John' },
        { id: 1, name: 'Jane' },
        { id: 2, name: 'Sam' },
      ];
      const expected = [
        { id: 1, name: 'Jane' },
        { id: 2, name: 'Sam' },
        { id: 3, name: 'John' },
      ];
      expect(service.sortObjectsAsc(input, 'id')).toEqual(expected);
    });

    it('should handle an empty array gracefully', () => {
      const input: { [key: string]: unknown }[] = [];
      expect(service.sortObjectsAsc(input, 'id')).toEqual([]);
    });
  });

  describe('sortObjectsDsc', () => {
    it('should sort an array of objects in descending order by a given key', () => {
      const input = [
        { id: 3, name: 'John' },
        { id: 1, name: 'Jane' },
        { id: 2, name: 'Sam' },
      ];
      const expected = [
        { id: 3, name: 'John' },
        { id: 2, name: 'Sam' },
        { id: 1, name: 'Jane' },
      ];
      expect(service.sortObjectsDsc(input, 'id')).toEqual(expected);
    });

    it('should handle an empty array gracefully', () => {
      const input: { [key: string]: unknown }[] = [];
      expect(service.sortObjectsDsc(input, 'id')).toEqual([]);
    });

    it('should handle missing keys gracefully', () => {
      const input = [{ id: 3, name: 'John' }, { name: 'Jane' }, { id: 2, name: 'Sam' }];
      const expected = [{ id: 3, name: 'John' }, { id: 2, name: 'Sam' }, { name: 'Jane' }];
      expect(service.sortObjectsDsc(input, 'id')).toEqual(expected);
    });
  });

  describe('getObjects (indirectly via sortObjectsAsc and sortObjectsDsc)', () => {
    it('should return the original array if the config is invalid', () => {
      const input = [{ id: 3 }, { id: 1 }];
      const result = service['getObjects'](input, { key: '', sortType: 'asc' });
      expect(result).toEqual(input);
    });

    it('should return the original array if the input is not an array', () => {
      const input = null as unknown as { [key: string]: unknown }[];
      const result = service['getObjects'](input, { key: 'id', sortType: 'asc' });
      expect(result).toEqual(input);
    });
  });
});
