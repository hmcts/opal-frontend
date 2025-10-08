import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Record-level: ensures at least one business unit checkbox is selected.
 */
export const atLeastOneBusinessUnitSelectedRecordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value as Record<string, boolean> | null | undefined;
  if (!value || typeof value !== 'object') return { required: true };
  for (const k of Object.keys(value)) {
    if (value[k] === true) return null;
  }
  return { required: true };
};

/**
 * Root-level mirror: reflects a nested record's { required:true } up onto the FormGroup
 * under the same key so field error mapping / summaries that read form.errors work.
 */
export const businessUnitSelectionRootMirrorValidator =
  (recordControlName: string): ValidatorFn =>
  (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) return null;
    const record = group.get(recordControlName);
    if (!record) return null;
    return record.errors?.['required'] ? { [recordControlName]: { required: true } } : null;
  };
