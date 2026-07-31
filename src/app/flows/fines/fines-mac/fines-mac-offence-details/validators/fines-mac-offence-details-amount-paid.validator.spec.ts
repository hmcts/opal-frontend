import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { finesMacOffenceDetailsAmountPaidValidator } from './fines-mac-offence-details-amount-paid.validator';

function createAmountPaidControl(amountImposed: unknown, amountPaid: unknown): FormControl {
  const form = new FormGroup({
    fm_offence_details_amount_imposed_0: new FormControl(amountImposed),
    fm_offence_details_amount_paid_0: new FormControl(amountPaid, finesMacOffenceDetailsAmountPaidValidator),
  });
  form.controls.fm_offence_details_amount_paid_0.updateValueAndValidity();

  return form.controls.fm_offence_details_amount_paid_0;
}

describe('finesMacOffenceDetailsAmountPaidValidator', () => {
  it('should return an error when amount paid is greater than amount imposed', () => {
    const control = createAmountPaidControl('100.00', '100.01');

    expect(control.errors).toEqual({ amountPaidExceedsAmountImposed: true });
  });

  it('should allow amount paid to equal amount imposed', () => {
    const control = createAmountPaidControl('100.00', '100');

    expect(control.errors).toBeNull();
  });

  it('should allow amount paid to be less than amount imposed', () => {
    const control = createAmountPaidControl('100.00', '99.99');

    expect(control.errors).toBeNull();
  });

  it('should compare large values without losing decimal precision', () => {
    const control = createAmountPaidControl('999999999999999999.98', '999999999999999999.99');

    expect(control.errors).toEqual({ amountPaidExceedsAmountImposed: true });
  });

  it('should leave empty and invalid values to the existing field validators', () => {
    expect(createAmountPaidControl(null, '10').errors).toBeNull();
    expect(createAmountPaidControl('100', null).errors).toBeNull();
    expect(createAmountPaidControl('invalid', '10').errors).toBeNull();
    expect(createAmountPaidControl('100', 'invalid').errors).toBeNull();
  });

  it('should return null before the control has a parent', () => {
    const control = new FormControl('100.01');

    expect(finesMacOffenceDetailsAmountPaidValidator(control)).toBeNull();
  });
});
