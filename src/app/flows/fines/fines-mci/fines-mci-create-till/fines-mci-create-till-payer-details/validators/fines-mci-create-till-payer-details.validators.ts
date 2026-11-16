import { AbstractControl } from '@angular/forms';
import { ALPHANUMERIC_WITH_SPACES_PATTERN } from '@hmcts/opal-frontend-common/constants';
import { patternValidator } from '@hmcts/opal-frontend-common/validators/pattern-validator';

export const PAYER_POSTCODE_PATTERN_VALIDATOR = patternValidator(
  ALPHANUMERIC_WITH_SPACES_PATTERN,
  'alphanumericTextPattern',
);

const UK_POSTCODE_PATTERN = /^(?:GIR 0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i;

/** Validates a populated postcode against the UK postcode structure. */
export function ukPostcodeValidator(control: AbstractControl) {
  if (typeof control.value !== 'string' || control.value.length === 0) return null;
  return UK_POSTCODE_PATTERN.test(control.value.trim()) ? null : { ukPostcode: true };
}

/**
 * Requires a payer name to contain at least one non-whitespace character.
 * @param control - Name control being validated.
 * @returns A required error for a missing or whitespace-only name; otherwise null.
 */
export function nonWhitespaceRequiredValidator(control: AbstractControl) {
  return typeof control.value !== 'string' || !control.value.trim() ? { required: true } : null;
}
