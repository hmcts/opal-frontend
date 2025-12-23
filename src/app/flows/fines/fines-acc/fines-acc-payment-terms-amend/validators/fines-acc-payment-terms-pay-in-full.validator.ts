import { AbstractControl, ValidatorFn } from '@angular/forms';

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

    // Helper function to clear validation errors
    const clearPayInFullError = (): void => {
      if (paymentCardControl.errors?.['payInFullRestriction']) {
        const errors = { ...paymentCardControl.errors };
        delete errors['payInFullRestriction'];
        paymentCardControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    };

    // If payment card is prevented, clear value and errors
    if (preventPaymentCard) {
      if (paymentCardRequestValue !== null) {
        paymentCardControl.setValue(null);
      }
      clearPayInFullError();
      return null;
    }

    // If pay in full is selected and payment card is requested, show error
    if (paymentTermsValue === 'payInFull' && paymentCardRequestValue) {
      paymentCardControl.setErrors({ payInFullRestriction: true });
      return { payInFullRestriction: true };
    }

    // Clear errors in all other cases
    clearPayInFullError();
    return null;
  };
}
