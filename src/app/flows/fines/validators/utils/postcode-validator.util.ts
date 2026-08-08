import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';

import { getNormalizedStringValue } from './get-normalized-string-value.util';

function getNormalizedPostcodeValue(control: AbstractControl | null): string {
  return getNormalizedStringValue(control, { stripWhitespace: true }) ?? '';
}

/**
 * Builds a postcode validator that ignores whitespace before checking the pattern.
 */
export function postcodePatternValidator(errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const postcode = getNormalizedPostcodeValue(control);

    if (postcode.length === 0) {
      return null;
    }

    return ALPHANUMERIC_WITH_SPACES_PATTERN.test(postcode) ? null : { [errorKey]: true };
  };
}

/**
 * Builds a postcode max-length validator that ignores whitespace before checking length.
 */
export function postcodeMaxLengthValidator(maxLength = 8): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const postcode = getNormalizedPostcodeValue(control);

    if (postcode.length === 0) {
      return null;
    }

    return postcode.length <= maxLength
      ? null
      : {
          maxlength: {
            actualLength: postcode.length,
            requiredLength: maxLength,
          },
        };
  };
}
