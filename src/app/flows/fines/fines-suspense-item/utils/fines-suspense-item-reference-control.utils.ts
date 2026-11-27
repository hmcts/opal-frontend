import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { NUMERIC_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

export function createSuspenseItemReferenceControl(initialReference: string): FormControl<string> {
  return new FormControl(initialReference, {
    nonNullable: true,
    validators: [
      Validators.required,
      patternValidator(NUMERIC_PATTERN, 'numericalTextPattern'),
      Validators.maxLength(18),
    ],
  });
}

/** Strip all leading zeroes before the shared submit handler validates and emits the reference. */
export function normaliseSuspenseItemReferenceControl(control: AbstractControl<string>): void {
  control.setValue(control.value.replace(/^0+/, ''));
}
