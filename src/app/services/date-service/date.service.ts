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
   * @param dateInput - The date to be checked. It can be either a `DateTime` object or a string in the format 'dd/MM/yyyy'.
   * @returns `true` if the date is valid, `false` otherwise.
   */
  public isValidDate(dateInput: DateTime | string): boolean {
    const date = typeof dateInput === 'string' ? DateTime.fromFormat(dateInput, 'dd/MM/yyyy') : dateInput;
    return date.isValid;
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
}
