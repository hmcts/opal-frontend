import { AbstractControl } from '@angular/forms';

/**
 * Gets a normalized string value from a control, trimming whitespace.
 * Returns null if the value is empty or not a string.
 *
 * @param control The control to extract the value from
 * @returns The normalized value or null
 */
export function getNormalizedStringValue(control: AbstractControl | null): string | null {
  if (!control) return null;
  const value = control.value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return value ?? null;
}
