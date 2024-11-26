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

  /**
   * Formats a 6-digit number or string as a sort code.
   * @param value - The 6-digit value to format.
   * @returns The formatted sort code string (xx-xx-xx).
   */
  public formatSortCode(value: string | number): string {
    const sortCode = value.toString();
    return `${sortCode.slice(0, 2)}-${sortCode.slice(2, 4)}-${sortCode.slice(4, 6)}`;
  }

  /**
   * Formats an address by joining non-empty lines with a specified delimiter.
   *
   * @param address - An array of address lines.
   * @param delimiter - The delimiter to use for joining the address lines.
   * @returns The formatted address as a single string.
   */
  public formatAddress(address: (string | null)[], delimiter: string): string {
    return address.filter((line) => line?.trim()).join(delimiter);
  }
}
