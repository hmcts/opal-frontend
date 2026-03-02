import { AbstractControl } from '@angular/forms';
import { isFormGroup } from './is-form-group.util';

/**
 * Recursively checks whether any value exists within a control.
 * - For FormGroups, it checks all nested controls.
 * - For individual controls, it checks that the value is non-empty (excluding whitespace).
 *
 * @param control The control to inspect
 * @returns True if any nested value is populated
 */
export function hasNestedValue(control: AbstractControl): boolean {
  if (isFormGroup(control)) {
    return Object.values(control.controls).some(hasNestedValue);
  }
  const value = control.value;
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value).trim() !== '';
}
