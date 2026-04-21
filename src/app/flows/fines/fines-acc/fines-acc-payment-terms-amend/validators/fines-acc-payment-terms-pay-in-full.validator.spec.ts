import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it, vi } from 'vitest';
import { payInFullPaymentCardValidator } from './fines-acc-payment-terms-pay-in-full.validator';

describe('payInFullPaymentCardValidator', () => {
  it('should return null when the payment card control is missing', () => {
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
    });

    const validator = payInFullPaymentCardValidator(false);

    expect(validator(form)).toBeNull();
  });

  it('should clear the requested payment card value when prevention is enabled', () => {
    const paymentCardControl = new FormControl(true);
    const setValueSpy = vi.spyOn(paymentCardControl, 'setValue');
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
      facc_payment_terms_payment_card_request: paymentCardControl,
    });

    const validator = payInFullPaymentCardValidator(true);

    expect(validator(form)).toBeNull();
    expect(setValueSpy).toHaveBeenCalledWith(null);
  });

  it('should clear the pay-in-full error without resetting the value when prevention is enabled and the field is already null', () => {
    const paymentCardControl = new FormControl(null);
    paymentCardControl.setErrors({ payInFullRestriction: true });
    const setValueSpy = vi.spyOn(paymentCardControl, 'setValue');
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
      facc_payment_terms_payment_card_request: paymentCardControl,
    });

    const validator = payInFullPaymentCardValidator(true);

    expect(validator(form)).toBeNull();
    expect(setValueSpy).not.toHaveBeenCalled();
    expect(paymentCardControl.errors).toBeNull();
  });

  it('should add an error when pay in full requests a payment card', () => {
    const paymentCardControl = new FormControl(true);
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
      facc_payment_terms_payment_card_request: paymentCardControl,
    });

    const validator = payInFullPaymentCardValidator(false);

    expect(validator(form)).toEqual({ payInFullRestriction: true });
    expect(paymentCardControl.errors).toEqual({ payInFullRestriction: true });
  });

  it('should clear pay-in-full errors when the selection no longer violates the rule', () => {
    const paymentCardControl = new FormControl(false);
    paymentCardControl.setErrors({ payInFullRestriction: true });
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('instalmentsOnly'),
      facc_payment_terms_payment_card_request: paymentCardControl,
    });

    const validator = payInFullPaymentCardValidator(false);

    expect(validator(form)).toBeNull();
    expect(paymentCardControl.errors).toBeNull();
  });

  it('should preserve unrelated errors when clearing only the pay-in-full restriction', () => {
    const paymentCardControl = new FormControl(false);
    paymentCardControl.setErrors({ payInFullRestriction: true, customError: true });
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('instalmentsOnly'),
      facc_payment_terms_payment_card_request: paymentCardControl,
    });

    const validator = payInFullPaymentCardValidator(false);

    expect(validator(form)).toBeNull();
    expect(paymentCardControl.errors).toEqual({ customError: true });
  });
});
