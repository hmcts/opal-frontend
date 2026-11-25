import { FormControl, Validators } from '@angular/forms';
import { NUMERIC_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

export function createSuspenseItemReferenceControl(initialReference: string): FormControl<string> {
  return new FormControl(initialReference, {
    nonNullable: true,
    validators: [
      Validators.required,
      patternValidator(NUMERIC_PATTERN, 'numericalTextPattern'),
      patternValidator(/^0*\d{1,18}$/, 'maxlength'),
    ],
  });
}
