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
   * Converts a number to a monetary string representation.
   * @param amount - The number to convert.
   * @returns The monetary string representation of the number.
   */
  public convertToMonetaryString(amount: number | string): string {
    if (typeof amount === 'string') {
      amount = parseFloat(amount);
    }
    return `£${amount.toFixed(2)}`;
  }
}
