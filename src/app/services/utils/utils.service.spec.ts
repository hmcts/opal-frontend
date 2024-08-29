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

  it('should return true if the date is valid', () => {
    const date = DateTime.fromISO('2022-01-01');
    const result = service.isValidDate(date);
    expect(result).toBeTrue();
  });

  it('should return false if the date is invalid', () => {
    const date = '31/02/2022';
    const result = service.isValidDate(date);
    expect(result).toBeFalse();
  });

  it('should add duration to a date', () => {
    const date = '01/01/2022';
    const years = 1;
    const months = 2;
    const weeks = 3;
    const days = 4;
    const result = service.addDurationToDate(date, years, months, weeks, days);
    const expectedDate = DateTime.fromISO('2023-03-26').toFormat('dd/MM/yyyy');
    expect(result).toEqual(expectedDate);
  });

  it('should add duration to a date with default values', () => {
    const date = '01/01/2022';
    const result = service.addDurationToDate(date);
    expect(result).toEqual(date);
  });

  it('should calculate the number of days between two dates', () => {
    const startDate = '01/01/2022';
    const endDate = '01/05/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(120);
  });

  it('should return 0 if the end date is before the start date', () => {
    const startDate = '01/05/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(-120);
  });

  it('should return 0 if the start and end dates are the same', () => {
    const startDate = '01/01/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(0);
  });
});
