import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Ensures at least one business unit checkbox is selected in a FormRecord.
 *
 * @param control - The FormRecord control containing business-unit boolean values.
 * @returns A required error when no business unit is selected.
 */
export const atLeastOneBusinessUnitSelectedRecordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value as Record<string, boolean> | null | undefined;

  if (!value || typeof value !== 'object') {
    return { required: true };
  }

  for (const key of Object.keys(value)) {
    if (value[key] === true) {
      return null;
    }
  }

  return { required: true };
};

/**
 * Mirrors a nested business-unit record validation error onto the root form group.
 *
 * @param recordControlName - The nested FormRecord control name.
 * @returns A form-group validator that exposes the record required error at root level.
 */
export const businessUnitSelectionRootMirrorValidator =
  (recordControlName: string): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) {
      return null;
    }

    const record = group.get(recordControlName);
    return record?.errors?.['required'] ? { [recordControlName]: { required: true } } : null;
  };
