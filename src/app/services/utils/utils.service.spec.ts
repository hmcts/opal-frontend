import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should capitalise the first letter of a string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const str = 'hello';
    const result = service.upperCaseFirstLetter(str);
    expect(result).toEqual('Hello');
  });

  it('should convert the entire string to uppercase', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const str = 'hello';
    const result = service.upperCaseAllLetters(str);
    expect(result).toEqual('HELLO');
  });

  it('should convert a number to a monetary string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const amount = 10.5;
    const result = service.convertToMonetaryString(amount);
    expect(result).toEqual('£10.50');
  });

  it('should convert a number to a monetary string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const amount = '10.5';
    const result = service.convertToMonetaryString(amount);
    expect(result).toEqual('£10.50');
  });

  it('should format the sort code correctly', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = 123456;
    const result = service.formatSortCode(value);
    expect(result).toEqual('12-34-56');
  });

  it('should format the sort code correctly when value is a string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '123456';
    const result = service.formatSortCode(value);
    expect(result).toEqual('12-34-56');
  });

  it('should format the address correctly with a comma delimiter', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const address = ['123 Main St', 'Apt 4B', 'New York', 'NY', '10001'];
    const result = service.formatAddress(address);
    expect(result).toEqual(['123 Main St', 'Apt 4B', 'New York', 'NY', '10001']);
  });

  it('should skip null or empty address lines', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const address = ['123 Main St', null, 'New York', '', '10001'];
    const result = service.formatAddress(address);
    expect(result).toEqual(['123 Main St', 'New York', '10001']);
  });

  it('should return an empty string if all address lines are null or empty', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const address = [null, '', '   '];
    const result = service.formatAddress(address);
    expect(result).toEqual([]);
  });
});
