import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Utility function to check if an AbstractControl is a FormGroup.
 *
 * @param control The control to check
 * @returns True if the control is a FormGroup, false otherwise
 */
export function isFormGroup(control: AbstractControl): control is FormGroup {
  return control instanceof FormGroup;
}
