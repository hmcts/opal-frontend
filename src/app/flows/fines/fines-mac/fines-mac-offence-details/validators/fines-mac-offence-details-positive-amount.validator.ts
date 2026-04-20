import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { nonNegativeValueValidator } from '@hmcts/opal-frontend-common/validators/non-negative-value';
import { nonZeroValueValidator } from '@hmcts/opal-frontend-common/validators/non-zero-value';

/**
 * Validates that the amount imposed is greater than zero.
 *
 * Returns null for empty or non-numeric values so the existing required and amount validators can surface their own errors.
 */
export function finesMacOffenceDetailsPositiveAmountValidator(): ValidatorFn {
  const nonNegativeAmountValidator = nonNegativeValueValidator();
  const nonZeroAmountValidator = nonZeroValueValidator();

  return (control: AbstractControl): ValidationErrors | null => {
    const zeroAmountError = nonZeroAmountValidator(control);
    if (zeroAmountError?.['zeroValue']) {
      return { invalidZeroAmount: true };
    }

    const negativeAmountError = nonNegativeAmountValidator(control);
    if (negativeAmountError?.['negativeValue']) {
      return { invalidNegativeAmount: true };
    }

    return null;
  };
}
