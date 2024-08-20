import { Injectable } from '@angular/core';
import { DateTime, Duration } from 'luxon';

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
}
