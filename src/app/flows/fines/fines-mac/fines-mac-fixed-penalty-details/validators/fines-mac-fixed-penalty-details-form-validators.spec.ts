import { FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS } from './fines-mac-fixed-penalty-details-form-validators';

function getPostcodeValidators(
  fieldName: 'fm_fp_personal_details_post_code' | 'fm_fp_company_details_postcode',
): ValidatorFn[] {
  return FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS[fieldName] ?? [];
}

function runValidators(
  fieldName: 'fm_fp_personal_details_post_code' | 'fm_fp_company_details_postcode',
  value: string,
): ValidationErrors | null {
  const validators = getPostcodeValidators(fieldName);

  const control = new FormControl(value);
  return validators.reduce<ValidationErrors | null>((errors, validator) => {
    const result = validator(control);
    if (!result) {
      return errors;
    }

    return {
      ...(errors ?? {}),
      ...result,
    };
  }, null);
}

describe('FINES_MAC_FIXED_PENALTY_DETAILS_FORM_VALIDATORS postcode validators', () => {
  it.each([
    {
      fieldName: 'fm_fp_personal_details_post_code',
      validValue: 'SW1A 1AA',
      invalidPatternValue: 'SW1A@1AA',
      invalidLengthValue: 'SW1A 1AAA',
    },
    {
      fieldName: 'fm_fp_company_details_postcode',
      validValue: 'B12 3CD',
      invalidPatternValue: 'B12@3CD',
      invalidLengthValue: 'B12 3CDEF',
    },
  ] as const)(
    'should validate $fieldName postcode rules',
    ({ fieldName, validValue, invalidPatternValue, invalidLengthValue }) => {
      expect(runValidators(fieldName, validValue)).toBeNull();

      expect(runValidators(fieldName, invalidPatternValue)).toEqual({ alphanumericTextPattern: true });

      expect(runValidators(fieldName, invalidLengthValue)).toEqual({
        maxlength: {
          actualLength: 9,
          requiredLength: 8,
        },
      });
    },
  );
});
