import { Injectable } from '@angular/core';
import { DateTime, Duration } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  /**
   * Converts the first letter of a string to uppercase.
   * @param str - The input string.
   * @returns The input string with the first letter capitalized.
   */
  public upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
   * Checks if a given date is valid.
   *
   * @param dateInput - The date to be checked. It can be either a `DateTime` object or a string in the format 'dd/MM/yyyy'.
   * @returns `true` if the date is valid, `false` otherwise.
   */
  public isValidDate(dateInput: DateTime | string): boolean {
    const date = typeof dateInput === 'string' ? DateTime.fromFormat(dateInput, 'dd/MM/yyyy') : dateInput;
    return date.isValid;
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
    const start = DateTime.fromFormat(startDate, 'dd/MM/yyyy');
    const end = DateTime.fromFormat(endDate, 'dd/MM/yyyy');
    const diff = end.diff(start, 'days');
    return diff.days;
  }
}
