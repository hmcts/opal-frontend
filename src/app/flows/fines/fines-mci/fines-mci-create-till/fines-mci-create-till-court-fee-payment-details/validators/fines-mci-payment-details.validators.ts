import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Requires a text value containing at least one non-whitespace character.
 *
 * @param control The field to validate.
 * @returns A required error for an empty value, otherwise null.
 */
export function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  return typeof control.value === 'string' && control.value.trim() ? null : { required: true };
}
