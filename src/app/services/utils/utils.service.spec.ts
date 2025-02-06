import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should capitalise the first letter of a string', () => {
    const str = 'hello';
    const result = service.upperCaseFirstLetter(str);
    expect(result).toEqual('Hello');
  });

  it('should convert the entire string to uppercase', () => {
    const str = 'hello';
    const result = service.upperCaseAllLetters(str);
    expect(result).toEqual('HELLO');
  });

  it('should convert a number to a monetary string', () => {
    const amount = 10.5;
    const result = service.convertToMonetaryString(amount);
    expect(result).toEqual('£10.50');
  });

  it('should convert a number to a monetary string', () => {
    const amount = '10.5';
    const result = service.convertToMonetaryString(amount);
    expect(result).toEqual('£10.50');
  });

  it('should format the sort code correctly', () => {
    const value = 123456;
    const result = service.formatSortCode(value);
    expect(result).toEqual('12-34-56');
  });

  it('should format the sort code correctly when value is a string', () => {
    const value = '123456';
    const result = service.formatSortCode(value);
    expect(result).toEqual('12-34-56');
  });

  it('should format the address correctly with a comma delimiter', () => {
    const address = ['123 Main St', 'Apt 4B', 'New York', 'NY', '10001'];
    const result = service.formatAddress(address);
    expect(result).toEqual(['123 Main St', 'Apt 4B', 'New York', 'NY', '10001']);
  });

  it('should skip null or empty address lines', () => {
    const address = ['123 Main St', null, 'New York', '', '10001'];
    const result = service.formatAddress(address);
    expect(result).toEqual(['123 Main St', 'New York', '10001']);
  });

  it('should return an empty string if all address lines are null or empty', () => {
    const address = [null, '', '   '];
    const result = service.formatAddress(address);
    expect(result).toEqual([]);
  });

  it('should scroll to the top of the page', () => {
    const viewportScrollerSpy = spyOn(service['viewportScroller'], 'scrollToPosition');
    service.scrollToTop();
    expect(viewportScrollerSpy).toHaveBeenCalledWith([0, 0]);
  });

  it('should check if form values are provided', () => {
    const form = { name: 'John', age: 30 };
    const result = service.checkFormValues(form);
    expect(result).toBeTrue();
  });

  it('should check if form values are not provided', () => {
    const form = { name: '', age: null };
    const result = service.checkFormValues(form);
    expect(result).toBeFalse();
  });

  it('should check if all form array values are provided', () => {
    const forms = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];
    const result = service.checkFormArrayValues(forms);
    expect(result).toBeTrue();
  });

  it('should check if not all form array values are provided', () => {
    const forms = [
      { name: 'John', age: 30 },
      { name: '', age: null },
    ];
    const result = service.checkFormArrayValues(forms);
    expect(result).toBeFalse();
  });

  it('should get form status as provided', () => {
    const form = { name: 'John', age: 30 };
    const result = service.getFormStatus(form, 'Provided', 'Not Provided');
    expect(result).toEqual('Provided');
  });

  it('should get form status as not provided', () => {
    const form = { name: '', age: null };
    const result = service.getFormStatus(form, 'Provided', 'Not Provided');
    expect(result).toEqual('Not Provided');
  });

  it('should get array form status as provided', () => {
    const forms = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ];
    const result = service.getArrayFormStatus(forms, 'Provided', 'Not Provided');
    expect(result).toEqual('Provided');
  });

  it('should get array form status as not provided', () => {
    const forms = [
      { name: 'John', age: 30 },
      { name: '', age: null },
    ];
    const result = service.getArrayFormStatus(forms, 'Provided', 'Not Provided');
    expect(result).toEqual('Not Provided');
  });

  it('should return true if an array contains values', () => {
    const form = { key1: [1, 2, 3] };
    expect(service.checkFormValues(form)).toBeTrue();
  });

  it('should return false if an array is empty', () => {
    const form = { key1: [] };
    expect(service.checkFormValues(form)).toBeFalse();
  });

  it('should return true for a non-empty string', () => {
    const form = { key1: 'some value' };
    expect(service.checkFormValues(form)).toBeTrue();
  });

  it('should return false for an empty string', () => {
    const form = { key1: '' };
    expect(service.checkFormValues(form)).toBeFalse();
  });

  it('should return false for null', () => {
    const form = { key1: null };
    expect(service.checkFormValues(form)).toBeFalse();
  });

  it('should return false for undefined', () => {
    const form = { key1: undefined };
    expect(service.checkFormValues(form)).toBeFalse();
  });
});
