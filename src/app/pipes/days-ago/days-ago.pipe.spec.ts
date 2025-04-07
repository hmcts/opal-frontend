// New unit test file: daysAgo.pipe.spec.ts
import { DaysAgoPipe } from './days-ago.pipe';

describe('DaysAgoPipe', () => {
  const pipe = new DaysAgoPipe();

  it('should return "Today" for 0', () => {
    expect(pipe.transform(0)).toBe('Today');
  });

  it('should return "1 day ago" for 1', () => {
    expect(pipe.transform(1)).toBe('1 day ago');
  });

  it('should return "Tomorrow" for -1', () => {
    expect(pipe.transform(-1)).toBe('Tomorrow');
  });

  it('should return "2 days ago" for 2', () => {
    expect(pipe.transform(2)).toBe('2 days ago');
  });

  it('should return "In 2 days" for -2', () => {
    expect(pipe.transform(-2)).toBe('In 2 days');
  });

  it('should return "Invalid date" for NaN', () => {
    expect(pipe.transform(Number.NaN)).toBe('Invalid date');
  });

  it('should return "Infinity days ago" for Infinity', () => {
    expect(pipe.transform(Number.POSITIVE_INFINITY)).toBe('Infinity days ago');
  });
});
