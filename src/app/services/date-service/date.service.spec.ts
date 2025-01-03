import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';
import { DateTime } from 'luxon';

describe('DateServiceService', () => {
  let service: DateService | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  afterAll(() => {
    service = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the difference in minutes between two dates', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = DateTime.fromISO('2022-01-01T10:00:00');
    const endDate = DateTime.fromISO('2022-01-01T11:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(90);
  });

  it('should return 0 if the end date is before the start date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = DateTime.fromISO('2022-01-01T12:00:00');
    const endDate = DateTime.fromISO('2022-01-01T10:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(0);
  });

  it('should convert milliseconds to minutes', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = 60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(1);
  });

  it('should return 0 if milliseconds is 0', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = 0;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });

  it('should return 0 if milliseconds is negative', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = -60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });

  it('should calculate the difference in minutes between two dates', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = DateTime.fromISO('2022-01-01T10:00:00');
    const endDate = DateTime.fromISO('2022-01-01T11:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(90);
  });

  it('should return 0 if the end date is before the start date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = DateTime.fromISO('2022-01-01T12:00:00');
    const endDate = DateTime.fromISO('2022-01-01T10:30:00');
    const result = service.calculateMinutesDifference(startDate, endDate);
    expect(result).toEqual(0);
  });

  it('should convert milliseconds to minutes', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = 60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(1);
  });

  it('should return 0 if milliseconds is 0', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = 0;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });

  it('should return 0 if milliseconds is negative', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const milliseconds = -60000;
    const result = service.convertMillisecondsToMinutes(milliseconds);
    expect(result).toEqual(0);
  });

  it('should correctly calculate age based on dateOfBirth', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = DateTime.fromISO('1990-08-19');
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(34);
  });

  it('should correctly calculate age based on dateOfBirth string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = '19/08/1990';
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(34);
  });

  it('should correctly calculate age for a dateOfBirth in the future', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = DateTime.fromISO('2025-08-19');
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(-1); // Future dateOfBirth should give a negative age
  });

  it('should correctly calculate age for a dateOfBirth in the future string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = '19/08/2025';
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(-1); // Future dateOfBirth should give a negative age
  });

  it('should return true for a valid date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const validDate = DateTime.fromISO('2024-08-19');
    const result = service.isValidDate(validDate);

    expect(result).toBe(true);
  });

  it('should return true for a valid date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const validDate = '19/08/2024';
    const result = service.isValidDate(validDate);

    expect(result).toBe(true);
  });

  it('should return false for an invalid date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const invalidDate = DateTime.fromISO('2024-02-30'); // invalid date
    const result = service.isValidDate(invalidDate);

    expect(result).toBe(false);
  });

  it('should return false for an invalid ISO string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const invalidDate = DateTime.fromISO('invalid-date-string');
    const result = service.isValidDate(invalidDate);

    expect(result).toBe(false);
  });

  it('should return false for null', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const result = service.isValidDate(null);

    expect(result).toBe(false);
  });

  it("should get yesterday's date", () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const yesterday = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();
    const result = service.getPreviousDate({ days: 1 });
    expect(result).toEqual(yesterday);
  });

  it('should return a DateTime object from a formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '2022-01-01T10:00:00';
    const format = "yyyy-MM-dd'T'HH:mm:ss";
    const result = service.getFromFormat(value, format);
    expect(result).toBeInstanceOf(DateTime);
    expect(result.isValid).toBe(true);
    expect(result.year).toBe(2022);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
    expect(result.hour).toBe(10);
    expect(result.minute).toBe(0);
    expect(result.second).toBe(0);
  });

  it('should return an invalid DateTime object from an invalid formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '2022-01-01T10:00:00';
    const format = 'dd/MM/yyyy';
    const result = service.getFromFormat(value, format);
    expect(result).toBeInstanceOf(DateTime);
    expect(result.isValid).toBe(false);
  });

  it('should return a DateTime object from an ISO string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '2022-01-01T10:00:00';
    const result = service.getFromIso(value);
    expect(result).toBeInstanceOf(DateTime);
    expect(result.isValid).toBe(true);
    expect(result.year).toBe(2022);
    expect(result.month).toBe(1);
    expect(result.day).toBe(1);
    expect(result.hour).toBe(10);
    expect(result.minute).toBe(0);
    expect(result.second).toBe(0);
  });

  it('should return the current date and time', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const result = service.getDateNow();
    const currentDate = DateTime.now();
    expect(result.hasSame(currentDate, 'minute')).toBeTrue();
  });

  it('should add duration to a date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

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
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = '01/01/2022';
    const result = service.addDurationToDate(date);
    expect(result).toEqual(date);
  });

  it('should calculate the number of days between two dates', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/01/2022';
    const endDate = '01/05/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(120);
  });

  it('should return 0 if the end date is before the start date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/05/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(-120);
  });

  it('should return 0 if the start and end dates are the same', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/01/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(0);
  });

  it('should add duration to a date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

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
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = '01/01/2022';
    const result = service.addDurationToDate(date);
    expect(result).toEqual(date);
  });

  it('should calculate the number of days between two dates', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/01/2022';
    const endDate = '01/05/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(120);
  });

  it('should return 0 if the end date is before the start date', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/05/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(-120);
  });

  it('should return 0 if the start and end dates are the same', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const startDate = '01/01/2022';
    const endDate = '01/01/2022';
    const result = service.calculateDaysBetweenDates(startDate, endDate);
    expect(result).toEqual(0);
  });

  it('should return true if the date is in the past', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const pastDate = DateTime.now().minus({ days: 1 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInThePast(pastDate)).toBeTrue();
  });

  it('should return false if the date is today', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const today = DateTime.now().toFormat('dd/MM/yyyy');
    expect(service.isDateInThePast(today)).toBeTrue();
  });

  it('should return false if the date is in the future', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const futureDate = DateTime.now().plus({ days: 1 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInThePast(futureDate)).toBeFalse();
  });

  it('should return true if the date is in the future', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const futureDate = DateTime.now().plus({ days: 1 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInTheFuture(futureDate)).toBeTrue();
  });

  it('should return false if the date is today', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const today = DateTime.now().toFormat('dd/MM/yyyy');
    expect(service.isDateInTheFuture(today)).toBeFalse();
  });

  it('should return false if the date is in the past', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const pastDate = DateTime.now().minus({ days: 1 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInTheFuture(pastDate)).toBeFalse();
  });

  it('should return true if the date is more than the specified years in the future', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const futureDate = DateTime.now().plus({ years: 5 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInTheFuture(futureDate, 3)).toBeTrue();
  });

  it('should return false if the date is less than the specified years in the future', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const futureDate = DateTime.now().plus({ years: 2 }).toFormat('dd/MM/yyyy');
    expect(service.isDateInTheFuture(futureDate, 3)).toBeFalse();
  });

  it('should return a Date object from a valid formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '01/01/2022';
    const format = 'dd/MM/yyyy';
    const result = service.getDateFromFormat(value, format);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2022);
    expect(result?.getMonth()).toBe(0); // Months are 0-indexed in JavaScript Date
    expect(result?.getDate()).toBe(1);
  });

  it('should return null from an invalid formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = 'invalid-date';
    const format = 'dd/MM/yyyy';
    const result = service.getDateFromFormat(value, format);
    expect(result).toBeNull();
  });

  it('should return null from a string that does not match the format', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '2022-01-01';
    const format = 'dd/MM/yyyy';
    const result = service.getDateFromFormat(value, format);
    expect(result).toBeNull();
  });

  it('should return a Date object from a valid formatted string with different format', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const value = '2022-01-01';
    const format = 'yyyy-MM-dd';
    const result = service.getDateFromFormat(value, format);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2022);
    expect(result?.getMonth()).toBe(0); // Months are 0-indexed in JavaScript Date
    expect(result?.getDate()).toBe(1);
  });

  it('should convert a Date object to a formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = new Date(2022, 0, 1); // January 1, 2022
    const format = 'dd/MM/yyyy';
    const result = service.toDateStringFormat(date, format);
    expect(result).toEqual('01/01/2022');
  });

  it('should convert a Date object to a different formatted string', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = new Date(2022, 0, 1); // January 1, 2022
    const format = 'yyyy-MM-dd';
    const result = service.toDateStringFormat(date, format);
    expect(result).toEqual('2022-01-01');
  });

  it('should handle invalid Date object', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = new Date('invalid-date');
    const format = 'dd/MM/yyyy';
    const result = service.toDateStringFormat(date, format);
    expect(result).toEqual('Invalid DateTime');
  });

  it('should convert date from one format to another', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = '01/01/2022';
    const fromFormat = 'dd/MM/yyyy';
    const toFormat = 'yyyy-MM-dd';
    const result = service.getFromFormatToFormat(date, fromFormat, toFormat);
    expect(result).toEqual('2022-01-01');
  });

  it('should convert date from one format to another with different formats', () => {
    if (!service) {
      fail('Required properties not properly initialised');
      return;
    }

    const date = '2022-01-01';
    const fromFormat = 'yyyy-MM-dd';
    const toFormat = 'dd/MM/yyyy';
    const result = service.getFromFormatToFormat(date, fromFormat, toFormat);
    expect(result).toEqual('01/01/2022');
  });
});
