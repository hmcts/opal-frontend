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
}
