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
});
