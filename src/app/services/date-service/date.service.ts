import { Injectable } from '@angular/core';
import { DateTime, Duration, DurationLikeObject } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * Calculates the difference in minutes between two DateTime objects.
   * @param startDate The start date and time.
   * @param endDate The end date and time.
   * @returns The difference in minutes between the start and end dates.
   */
  public calculateMinutesDifference(startDate: DateTime, endDate: DateTime): number {
    const minuteDifference = endDate.diff(startDate, 'minutes');
    return Math.max(0, Math.ceil(minuteDifference.minutes));
  }

  /**
   * Converts milliseconds to minutes.
   * @param milliseconds - The number of milliseconds to convert.
   * @returns The equivalent number of minutes.
   */
  public convertMillisecondsToMinutes(milliseconds: number): number {
    const minutes = Duration.fromMillis(milliseconds).as('minutes');
    return Math.max(0, Math.ceil(minutes));
  }

  /**
   * Calculates the age based on the given date of birth.
   * @param dateOfBirth - The date of birth to calculate the age from.
   * @param format - The format of the date of birth. Defaults to 'dd/MM/yyyy'.
   * @returns The calculated age.
   */
  public calculateAge(dateOfBirth: DateTime | string, format: string = 'dd/MM/yyyy'): number {
    const date = typeof dateOfBirth === 'string' ? this.getFromFormat(dateOfBirth, format) : dateOfBirth;

    return Math.floor(DateTime.now().diff(date, 'years').years);
  }

  /**
   * Checks if a given date is valid.
   * @param dateInput - The date to be checked. It can be a DateTime object, a string, or null.
   * @param format - The format of the date string (default: 'dd/MM/yyyy').
   * @returns A boolean indicating whether the date is valid or not.
   */
  public isValidDate(dateInput: DateTime | string | null, format: string = 'dd/MM/yyyy'): boolean {
    if (dateInput) {
      const date = typeof dateInput === 'string' ? this.getFromFormat(dateInput, format) : dateInput;
      return date.isValid;
    }
    return false;
  }

  /**
   * Returns a string representation of a date subtracted by the given duration.
   * @param duration A DurationLikeObject representing the amount of time to subtract from the current date.
   * @returns A string representing the subtracted date in the format specified by the current locale.
   */
  public getPreviousDate(duration: DurationLikeObject): string {
    return DateTime.now().minus(duration).setLocale('en-gb').toLocaleString();
  }

  /**
   * Parses a string value into a DateTime object based on the specified format.
   * @param value - The string value to parse.
   * @param format - The format of the string value.
   * @returns A DateTime object representing the parsed value.
   */
  public getFromFormat(value: string, format: string): DateTime<true> | DateTime<false> {
    return DateTime.fromFormat(value, format);
  }

  /**
   * Parses a string value into a native JavaScript Date object based on the specified format.
   * @param value - The string value to parse.
   * @param format - The format of the string value.
   * @returns A Date object representing the parsed value, or null if parsing fails.
   */
  public getDateFromFormat(value: string, format: string): Date | null {
    const dateTime = DateTime.fromFormat(value, format);
    return dateTime.isValid ? dateTime.toJSDate() : null;
  }

  /**
   * Converts a DateTime value to a formatted string.
   *
   * @param value - The DateTime value to format.
   * @param format - The format string to apply to the DateTime value.
   * @returns The formatted string representation of the DateTime value.
   */
  public toFormat(value: DateTime<true> | DateTime<false>, format: string): string {
    return value.toFormat(format);
  }

  /**
   * Converts a given Date object to a formatted string based on the specified format.
   *
   * @param value - The Date object to be formatted.
   * @param format - The string format to apply to the Date object.
   * @returns The formatted date string.
   */
  public toDateStringFormat(value: Date, format: string): string {
    return DateTime.fromJSDate(value).toFormat(format);
  }

  /**
   * Converts a string in ISO format to a DateTime object.
   * @param value - The string value in ISO format.
   * @returns A DateTime object representing the given value.
   */
  public getFromIso(value: string): DateTime {
    return DateTime.fromISO(value);
  }

  /**
   * Returns the current date and time.
   * @returns {DateTime} The current date and time.
   */
  public getDateNow(): DateTime {
    return DateTime.now();
  }

  /**
   * Adds a duration to a given date and returns the result in the specified format.
   * @param date - The date to which the duration will be added.
   * @param years - The number of years to add to the date (default: 0).
   * @param months - The number of months to add to the date (default: 0).
   * @param weeks - The number of weeks to add to the date (default: 0).
   * @param days - The number of days to add to the date (default: 0).
   * @param format - The format in which the resulting date will be returned (default: 'dd/MM/yyyy').
   * @returns The resulting date in the specified format.
   */
  public addDurationToDate(
    date: string,
    years: number = 0,
    months: number = 0,
    weeks: number = 0,
    days: number = 0,
    format: string = 'dd/MM/yyyy',
  ): string {
    const dateObj = this.getFromFormat(date, format);
    const newDate = dateObj.plus({ years, months, weeks, days });
    return newDate.toFormat(format);
  }

  /**
   * Calculates the number of days between two dates.
   * @param startDate - The start date in the specified format.
   * @param endDate - The end date in the specified format.
   * @param format - The format of the dates (default: 'dd/MM/yyyy').
   * @returns The number of days between the start and end dates.
   */
  public calculateDaysBetweenDates(startDate: string, endDate: string, format: string = 'dd/MM/yyyy'): number {
    const start = this.getFromFormat(startDate, format);
    const end = this.getFromFormat(endDate, format);
    const diff = end.diff(start, 'days');
    return diff.days;
  }

  /**
   * Checks if a given date is in the past.
   * @param date - The date to check.
   * @param format - The format of the date string. Defaults to 'dd/MM/yyyy'.
   * @returns True if the date is in the past, false otherwise.
   */
  public isDateInThePast(date: string, format: string = 'dd/MM/yyyy'): boolean {
    return this.getFromFormat(date, format) < DateTime.now();
  }

  /**
   * Checks if a given date is in the future.
   * @param date - The date to check.
   * @param yearsInTheFuture - Optional. The number of years in the future to compare against. If not provided, the current date is used.
   * @param format - Optional. The format of the input date. Defaults to 'dd/MM/yyyy'.
   * @returns True if the date is in the future, false otherwise.
   */
  public isDateInTheFuture(date: string, yearsInTheFuture?: number, format: string = 'dd/MM/yyyy'): boolean {
    const now = DateTime.now();
    const dateValue = this.getFromFormat(date, format);

    if (yearsInTheFuture) {
      const futureDate = now.plus({ years: yearsInTheFuture });
      return dateValue > futureDate;
    }

    return dateValue > now;
  }

  /**
   * Converts a date string from one format to another.
   *
   * @param date - The date string to be converted.
   * @param fromFormat - The format of the input date string.
   * @param toFormat - The desired format of the output date string.
   * @returns The date string in the desired format.
   */
  public getFromFormatToFormat(date: string, fromFormat: string, toFormat: string): string {
    return this.getFromFormat(date, fromFormat).toFormat(toFormat);
  }
}
