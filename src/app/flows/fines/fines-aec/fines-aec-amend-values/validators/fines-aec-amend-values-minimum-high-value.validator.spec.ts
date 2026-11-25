import { FormControl, FormGroup, Validators } from '@angular/forms';
import { amountValidator } from '@hmcts/opal-frontend-common/validators/amount';
import { nonNegativeValueValidator } from '@hmcts/opal-frontend-common/validators/non-negative-value';
import { beforeEach, describe, expect, it } from 'vitest';
import { FINES_AEC_AMEND_VALUES_VALIDATION } from '../constants/fines-aec-amend-values-validation.constant';
import { finesAecMinimumHighValueValidator } from './fines-aec-amend-values-minimum-high-value.validator';

describe('finesAecMinimumHighValueValidator', () => {
  let form: FormGroup<{ minimum_balance: FormControl<string>; high_value: FormControl<string> }>;

  beforeEach(() => {
    form = new FormGroup(
      {
        minimum_balance: new FormControl('10.00', {
          nonNullable: true,
          validators: [
            Validators.required,
            amountValidator(
              FINES_AEC_AMEND_VALUES_VALIDATION.minimumBalanceIntegerDigits,
              FINES_AEC_AMEND_VALUES_VALIDATION.decimalPlaces,
            ),
            nonNegativeValueValidator(),
          ],
        }),
        high_value: new FormControl('100.00', {
          nonNullable: true,
          validators: [
            amountValidator(
              FINES_AEC_AMEND_VALUES_VALIDATION.highValueIntegerDigits,
              FINES_AEC_AMEND_VALUES_VALIDATION.decimalPlaces,
            ),
            nonNegativeValueValidator(),
          ],
        }),
      },
      { validators: [finesAecMinimumHighValueValidator()] },
    );
  });

  it.each(['10.00', '100.00', ''])('allows a high value of %j for a minimum of 10.00', (highValue) => {
    form.controls.high_value.setValue(highValue);

    expect(form.valid).toBe(true);
    expect(form.controls.minimum_balance.errors).toBeNull();
  });

  it('accepts equal zero thresholds', () => {
    form.setValue({ minimum_balance: '0.00', high_value: '0.00' });

    expect(form.valid).toBe(true);
  });

  it('associates an ordering error with the minimum field and clears it when high is corrected', () => {
    form.controls.high_value.setValue('9.99');

    expect(form.hasError('minHigherThanHigh')).toBe(true);
    expect(form.controls.minimum_balance.errors).toEqual({ minHigherThanHigh: true });

    form.controls.high_value.setValue('10.00');

    expect(form.valid).toBe(true);
    expect(form.controls.minimum_balance.errors).toBeNull();
  });

  it.each(['', 'invalid', '-1'])('clears a stale ordering error when high becomes %j', (highValue) => {
    form.controls.high_value.setValue('5.00');
    expect(form.controls.minimum_balance.hasError('minHigherThanHigh')).toBe(true);

    form.controls.high_value.setValue(highValue);

    expect(form.hasError('minHigherThanHigh')).toBe(false);
    expect(form.controls.minimum_balance.errors).toBeNull();
    expect(form.valid).toBe(highValue === '');
  });

  it.each([
    ['', 'required'],
    ['10000', 'invalidAmount'],
    ['invalid', 'invalidAmountValue'],
    ['-1', 'negativeValue'],
  ])('preserves the minimum field error for %j without adding an ordering error', (minimum, error) => {
    form.controls.minimum_balance.setValue(minimum);
    form.controls.high_value.setValue('0');

    expect(form.controls.minimum_balance.errors).toEqual({ [error]: true });
    expect(form.hasError('minHigherThanHigh')).toBe(false);
  });

  it('preserves an unrelated field error when removing its own stale error', () => {
    form.controls.minimum_balance.setErrors({ server: true, minHigherThanHigh: true });

    form.updateValueAndValidity();

    expect(form.controls.minimum_balance.errors).toEqual({ server: true });
    expect(form.hasError('minHigherThanHigh')).toBe(false);
  });
});
