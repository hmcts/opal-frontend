import { Injectable } from '@angular/core';

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
   * Converts the entire string to uppercase.
   * @param str - The input string.
   * @returns The input string in uppercase.
   */
  public upperCaseAllLetters(str: string): string {
    return str.toUpperCase();
  }

  /**
   * Converts a string to a monetary string format.
   * If the input is not a valid number, it returns 'Invalid input'.
   * Otherwise, it returns the input string prefixed with the pound sign (£).
   *
   * @param str - The string to convert.
   * @returns The monetary string representation of the input.
   */
  public convertToMonetaryString(str: string): string {
    const num = Number(str);
    return isNaN(num) ? 'Invalid input' : `£${num.toFixed(2)}`;
  }
}
