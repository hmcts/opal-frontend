import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Helper function to clear pay in full validation errors from a control
 * @param control - The form control to clear errors from
 */
function clearPayInFullError(control: AbstractControl): void {
  if (control.errors?.['payInFullRestriction']) {
    const errors = { ...control.errors };
    delete errors['payInFullRestriction'];
    control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }
}

/**
 * Custom form validator that checks if payment card is requested when payment terms are 'Pay in full'
 * @param preventPaymentCard - Function that returns whether payment card should be prevented
 * @returns ValidatorFn that validates payment card restrictions for pay in full terms
 */
export function payInFullPaymentCardValidator(preventPaymentCard?: boolean): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const paymentCardControl = formGroup.get('facc_payment_terms_payment_card_request');
    if (!paymentCardControl) {
      return null;
    }

    const paymentTermsValue = formGroup.get('facc_payment_terms_payment_terms')?.value;
    const paymentCardRequestValue = paymentCardControl.value;

    // If payment card is prevented, clear value and errors
    if (preventPaymentCard) {
      if (paymentCardRequestValue !== null) {
        paymentCardControl.setValue(null);
      }
      clearPayInFullError(paymentCardControl);
      return null;
    }

    // If pay in full is selected and payment card is requested, show error
    if (paymentTermsValue === 'payInFull' && paymentCardRequestValue) {
      paymentCardControl.setErrors({ payInFullRestriction: true });
      return { payInFullRestriction: true };
    }

    // Clear errors in all other cases
    clearPayInFullError(paymentCardControl);
    return null;
  };
}
