import { FormControl, FormGroup } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { changeLetterWithoutChangesValidator } from './fines-acc-payment-terms-change-letter.validator';
import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { IFinesAccPaymentTermsAmendState } from '../interfaces/fines-acc-payment-terms-amend-state.interface';

describe('changeLetterWithoutChangesValidator', () => {
  it('should return null when the change letter control is missing', () => {
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
    });

    const validator = changeLetterWithoutChangesValidator(undefined);

    expect(validator(form)).toBeNull();
  });

  it('should treat a missing initial form value as changed when it becomes unavailable during validation', () => {
    const form = new FormGroup({
      facc_payment_terms_payment_terms: new FormControl('payInFull'),
      facc_payment_terms_change_letter: new FormControl(true),
    });

    const initialState = {
      facc_payment_terms_payment_terms: 'payInFull',
    } as IFinesAccPaymentTermsAmendState;

    let formDataAccesses = 0;
    const initialFormData = { nestedFlow: false } as IFinesAccPaymentTermsAmendForm;

    Object.defineProperty(initialFormData, 'formData', {
      configurable: true,
      get: () => {
        formDataAccesses += 1;
        return formDataAccesses === 1 ? initialState : null;
      },
    });

    const validator = changeLetterWithoutChangesValidator(initialFormData);

    expect(validator(form)).toBeNull();
    expect(formDataAccesses).toBe(2);
    expect(form.get('facc_payment_terms_change_letter')?.errors).toBeNull();
  });
});
