import { AbstractControl } from '@angular/forms';

export interface IGetNormalizedStringValueOptions {
  stripWhitespace?: boolean;
}

/**
 * Gets a normalized string value from a control.
 * Trims whitespace by default and can optionally strip all whitespace.
 * Returns null if the value is empty or not a string.
 *
 * @param control The control to extract the value from
 * @param options Normalization options
 * @returns The normalized value or null
 */
export function getNormalizedStringValue(
  control: AbstractControl | null,
  options: IGetNormalizedStringValueOptions = {},
): string | null {
  if (!control) return null;
  const value = control.value;
  if (typeof value === 'string') {
    const normalized = options.stripWhitespace ? value.replace(/\s+/g, '') : value.trim();
    return normalized.length > 0 ? normalized : null;
  }
  return value ?? null;
}
