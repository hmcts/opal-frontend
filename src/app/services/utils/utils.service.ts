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
   * Removes the specified index from the target object by copying the corresponding values from the data object.
   * The target object is modified in-place.
   *
   * @param target - The target object from which to remove the index.
   * @param data - The data object containing the values to copy.
   * @param index - The index to remove.
   * @returns The modified target object.
   */
  public removeIndexFromData(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: { [key: string]: any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { [key: string]: any },
    index: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): { [key: string]: any } {
    const suffix = `_${index}`;

    Object.entries(target).forEach(([key]) => {
      const keyWithSuffix = `${key}${suffix}`;
      if (data[keyWithSuffix] !== undefined) {
        target[key] = data[keyWithSuffix];
      }
    });

    return target;
  }
}
