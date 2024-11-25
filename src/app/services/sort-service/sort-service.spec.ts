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

  describe('arraySortAsc', () => {
    it('should sort an array of numbers in ascending order', () => {
      const array = [3, 1, 2];
      const result = service.arraySortAsc(array);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should sort an array of strings in ascending order', () => {
      const array = ['banana', 'apple', 'cherry'];
      const result = service.arraySortAsc(array);
      expect(result).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should return an empty array when passed an empty array', () => {
      const array: string[] = [];
      const result = service.arraySortAsc(array);
      expect(result).toEqual([]);
    });
  });

  describe('arraySortDsc', () => {
    it('should sort an array of numbers in descending order', () => {
      const array = [3, 1, 2];
      const result = service.arraySortDsc(array);
      expect(result).toEqual([3, 2, 1]);
    });

    it('should sort an array of strings in descending order', () => {
      const array = ['banana', 'apple', 'cherry'];
      const result = service.arraySortDsc(array);
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should return an empty array when passed an empty array', () => {
      const array: string[] = [];
      const result = service.arraySortDsc(array);
      expect(result).toEqual([]);
    });
  });

  describe('sortObjectsAsc', () => {
    it('should sort an array of objects by a key in ascending order', () => {
      const array = [
        { name: 'Charlie', age: 35 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];
      const result = service.sortObjectsAsc(array, 'name');
      expect(result).toEqual([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ]);
    });

    it('should handle an empty array gracefully', () => {
      const array: { [key: string]: string | number }[] = [];
      const result = service.sortObjectsAsc(array, 'name');
      expect(result).toEqual([]);
    });

    it('should return the same array if the key does not exist', () => {
      const array = [
        { name: 'Charlie', age: 35 },
        { name: 'Alice', age: 25 },
      ];
      const result = service.sortObjectsAsc(array, 'nonexistent');
      expect(result).toEqual(array);
    });
  });

  describe('sortObjectsDsc', () => {
    it('should sort an array of objects by a key in descending order', () => {
      const array = [
        { name: 'Charlie', age: 35 },
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
      ];
      const result = service.sortObjectsDsc(array, 'age');
      expect(result).toEqual([
        { name: 'Charlie', age: 35 },
        { name: 'Bob', age: 30 },
        { name: 'Alice', age: 25 },
      ]);
    });

    it('should handle an empty array gracefully', () => {
      const array: { [key: string]: string | number }[] = [];
      const result = service.sortObjectsDsc(array, 'name');
      expect(result).toEqual([]);
    });

    it('should return the same array if the key does not exist', () => {
      const array = [
        { name: 'Charlie', age: 35 },
        { name: 'Alice', age: 25 },
      ];
      const result = service.sortObjectsDsc(array, 'nonexistent');
      expect(result).toEqual(array);
    });
  });

  describe('getObjects (private method)', () => {
    it('should return the original array if config is invalid', () => {
      // Bypass private access with a cast to `any`
      const array = [
        { name: 'Charlie', age: 35 },
        { name: 'Alice', age: 25 },
      ];
      const result = (service as any).getObjects(array, { key: '', sortType: 'ascending' });
      expect(result).toEqual(array);
    });

    it('should return the original array if the input is not an array', () => {
      const array: any = 'not an array';
      const result = (service as any).getObjects(array, { key: 'name', sortType: 'ascending' });
      expect(result).toEqual(array);
    });
  });
});
