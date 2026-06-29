import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { nonNegativeValueValidator } from '@hmcts/opal-frontend-common/validators/non-negative-value';
import { nonZeroValueValidator } from '@hmcts/opal-frontend-common/validators/non-zero-value';
import { IFinesMacOffenceDetailsPositiveAmountValidatorOptions } from './interfaces/fines-mac-offence-details-positive-amount-validator-options.interface';

/**
 * Validates that an entered amount is greater than zero, or zero and above when allowZero is true.
 *
 * Returns null for empty or non-numeric values so the existing required and amount validators can surface their own errors.
 */
export function finesMacOffenceDetailsPositiveAmountValidator(
  options: IFinesMacOffenceDetailsPositiveAmountValidatorOptions,
): ValidatorFn {
  const nonNegativeAmountValidator = nonNegativeValueValidator();
  const nonZeroAmountValidator = nonZeroValueValidator();

  return (control: AbstractControl): ValidationErrors | null => {
    if (!options.allowZero) {
      const zeroAmountError = nonZeroAmountValidator(control);
      if (zeroAmountError?.['zeroValue']) {
        return { invalidZeroAmount: true };
      }
    }

    const negativeAmountError = nonNegativeAmountValidator(control);
    if (negativeAmountError?.['negativeValue']) {
      return { invalidNegativeAmount: true };
    }

    return null;
  };
}
