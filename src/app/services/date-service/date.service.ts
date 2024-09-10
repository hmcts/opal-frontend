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
   *
   * @param dateOfBirth - The date of birth to calculate the age from.
   * @returns The calculated age as a number.
   */
  public calculateAge(dateOfBirth: DateTime | string): number {
    const date = typeof dateOfBirth === 'string' ? DateTime.fromFormat(dateOfBirth, 'dd/MM/yyyy') : dateOfBirth;

    return Math.floor(DateTime.now().diff(date, 'years').years);
  }

  /**
   * Checks if a given date is valid.
   *
   * @param dateInput - The date to be checked. It can be a DateTime object, a string in the format 'dd/MM/yyyy', or null.
   * @returns A boolean indicating whether the date is valid or not.
   */
  public isValidDate(dateInput: DateTime | string | null): boolean {
    if (dateInput) {
      const date = typeof dateInput === 'string' ? DateTime.fromFormat(dateInput, 'dd/MM/yyyy') : dateInput;
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
   * Adds a duration to a given date and returns the resulting date.
   * @param date - The date to which the duration will be added. Should be in the format 'dd/MM/yyyy'.
   * @param years - The number of years to add to the date. Default is 0.
   * @param months - The number of months to add to the date. Default is 0.
   * @param weeks - The number of weeks to add to the date. Default is 0.
   * @param days - The number of days to add to the date. Default is 0.
   * @returns The resulting date after adding the duration, in the format 'dd/MM/yyyy'.
   */
  public addDurationToDate(
    date: string,
    years: number = 0,
    months: number = 0,
    weeks: number = 0,
    days: number = 0,
  ): string {
    const dateObj = DateTime.fromFormat(date, 'dd/MM/yyyy');
    const newDate = dateObj.plus({ years, months, weeks, days });
    return newDate.toFormat('dd/MM/yyyy');
  }

  /**
   * Calculates the number of days between two dates.
   * @param startDate - The start date in the format 'dd/MM/yyyy'.
   * @param endDate - The end date in the format 'dd/MM/yyyy'.
   * @returns The number of days between the start and end dates.
   */
  public calculateDaysBetweenDates(startDate: string, endDate: string): number {
    const start = this.getFromFormat(startDate, 'dd/MM/yyyy');
    const end = this.getFromFormat(endDate, 'dd/MM/yyyy');
    const diff = end.diff(start, 'days');
    return diff.days;
  }

  /**
   * Checks if a given date is in the past.
   * @param date - The date to check.
   * @returns A boolean indicating whether the date is in the past or not.
   */
  public isDateInThePast(date: string): boolean {
    return this.getFromFormat(date, 'dd/MM/yyyy') < DateTime.now();
  }

  /**
   * Checks if a given date is in the future.
   * @param date - The date to check.
   * @param yearsInTheFuture - Optional. The number of years in the future to compare against. Default is undefined.
   * @returns A boolean indicating whether the date is in the future or not.
   */
  public isDateInTheFuture(date: string, yearsInTheFuture?: number): boolean {
    const now = DateTime.now();
    const dateValue = this.getFromFormat(date, 'dd/MM/yyyy');

    if (yearsInTheFuture) {
      const futureDate = now.plus({ years: yearsInTheFuture });
      return dateValue > futureDate;
    }

    return dateValue > now;
  }
}
