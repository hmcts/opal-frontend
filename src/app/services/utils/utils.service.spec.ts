import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { DateTime } from 'luxon';

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

  it('should calculate the difference in minutes between two dates', () => {
    const startDate = DateTime.fromISO('2022-01-01T10:00:00');
    const endDate = DateTime.fromISO('2022-01-01T11:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(90);
  });

  it('should return 0 if the end date is before the start date', () => {
    const startDate = DateTime.fromISO('2022-01-01T12:00:00');
    const endDate = DateTime.fromISO('2022-01-01T10:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(0);
  });

  it('should convert milliseconds to minutes', () => {
    const milliseconds = 60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(1);
  });

  it('should return 0 if milliseconds is 0', () => {
    const milliseconds = 0;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });

  it('should return 0 if milliseconds is negative', () => {
    const milliseconds = -60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });
});
