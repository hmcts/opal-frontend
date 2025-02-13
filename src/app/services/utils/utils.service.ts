import { ViewportScroller } from '@angular/common';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private readonly viewportScroller = inject(ViewportScroller);

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
   * Filters out null or empty strings from an array of address lines.
   *
   * @param address - An array of address lines which may contain strings or null values.
   * @returns A new array containing only non-empty strings from the input array.
   */
  public formatAddress(address: (string | null)[]): string[] {
    return address.filter((line): line is string => !!line?.trim());
  }

  /**
   * Scrolls the viewport to the top of the page.
   * Utilizes the `viewportScroller` service to scroll to the position [0, 0].
   */
  public scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public checkFormValues(form: { [key: string]: any }): boolean {
    return Object.values(form).some((value) => {
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public checkFormArrayValues(forms: { [key: string]: any }[]): boolean {
    return forms.every((form) => this.checkFormValues(form));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getFormStatus(form: { [key: string]: any }, providedMessage: string, notProvidedMessage: string): string {
    return this.checkFormValues(form) ? providedMessage : notProvidedMessage;
  }

  public getArrayFormStatus(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forms: { [key: string]: any }[],
    providedMessage: string,
    notProvidedMessage: string,
  ): string {
    return forms.every((form) => this.checkFormValues(form)) ? providedMessage : notProvidedMessage;
  }
}
