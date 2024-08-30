import { TestBed } from '@angular/core/testing';

import { DateService } from './date.service';
import { DateTime } from 'luxon';

describe('DateServiceService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

  it('should correctly calculate age based on dateOfBirth', () => {
    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = DateTime.fromISO('1990-08-19');
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(34);
  });

  it('should correctly calculate age based on dateOfBirth string', () => {
    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = '19/08/1990';
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(34);
  });

  it('should correctly calculate age for a dateOfBirth in the future', () => {
    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = DateTime.fromISO('2025-08-19');
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(-1); // Future dateOfBirth should give a negative age
  });

  it('should correctly calculate age for a dateOfBirth in the future string', () => {
    // Mock the current date to a fixed date
    const fixedDate = DateTime.fromISO('2024-08-19');
    spyOn(DateTime, 'now').and.returnValue(fixedDate as DateTime<true>);

    const dateOfBirth = '19/08/2025';
    const age = service.calculateAge(dateOfBirth);

    expect(age).toBe(-1); // Future dateOfBirth should give a negative age
  });

  it('should return true for a valid date', () => {
    const validDate = DateTime.fromISO('2024-08-19');
    const result = service.isValidDate(validDate);

    expect(result).toBe(true);
  });

  it('should return true for a valid date', () => {
    const validDate = '19/08/2024';
    const result = service.isValidDate(validDate);

    expect(result).toBe(true);
  });

  it('should return false for an invalid date', () => {
    const invalidDate = DateTime.fromISO('2024-02-30'); // invalid date
    const result = service.isValidDate(invalidDate);

    expect(result).toBe(false);
  });

  it('should return false for an invalid ISO string', () => {
    const invalidDate = DateTime.fromISO('invalid-date-string');
    const result = service.isValidDate(invalidDate);

    expect(result).toBe(false);
  });

  it("should get yesterday's date", () => {
    const yesterday = DateTime.now().minus({ days: 1 }).setLocale('en-gb').toLocaleString();
    const result = service.getPreviousDate({ days: 1 });
    expect(result).toEqual(yesterday);
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
