import { TestBed } from '@angular/core/testing';
import { SortService } from './sort-service';

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
      const result = service.arraySortDsc(input);
      expect(result).toEqual([8, 5, 3, 1]);
    });

    it('should sort an array of strings in descending order', () => {
      const input = ['banana', 'apple', 'cherry'];
      const result = service.arraySortDsc(input);
      expect(result).toEqual(['cherry', 'banana', 'apple']);
    });

    it('should handle an empty array', () => {
      const input: number[] = [];
      const result = service.arraySortDsc(input);
      expect(result).toEqual([]);
    });
  });

  describe('sortObjectsAsc', () => {
    it('should sort an array of objects in ascending order by a specified key', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = service.sortObjectsAsc(input, 'id');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should handle an empty array', () => {
      const input: [] = [];
      const result = service.sortObjectsAsc(input, 'id');
      expect(result).toEqual([]);
    });

    it('should handle invalid key gracefully', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = service.sortObjectsAsc(input, 'age'); // 'age' doesn't exist in objects
      expect(result).toEqual(input); // Return unsorted array
    });
  });

  describe('sortObjectsDsc', () => {
    it('should sort an array of objects in descending order by a specified key', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = service.sortObjectsDsc(input, 'id');
      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });

    it('should handle an empty array', () => {
      const input: [] = [];
      const result = service.sortObjectsDsc(input, 'id');
      expect(result).toEqual([]);
    });

    it('should handle invalid key gracefully', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      const result = service.sortObjectsDsc(input, 'age'); // 'age' doesn't exist in objects
      expect(result).toEqual(input); // Return unsorted array
    });
  });

  describe('getObjects (private)', () => {
    it('should sort objects in ascending order if sortType is "ascending"', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      // Access via the public sortObjectsAsc method
      const result = service.sortObjectsAsc(input, 'id');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ]);
    });

    it('should sort objects in descending order if sortType is "descending"', () => {
      const input = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ];
      // Access via the public sortObjectsDsc method
      const result = service.sortObjectsDsc(input, 'id');
      expect(result).toEqual([
        { id: 3, name: 'Charlie' },
        { id: 2, name: 'Bob' },
        { id: 1, name: 'Alice' },
      ]);
    });
  });
});
