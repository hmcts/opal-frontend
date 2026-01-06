import { AbstractControl, ValidatorFn } from '@angular/forms';
import { IFinesAccPaymentTermsAmendForm } from '../interfaces/fines-acc-payment-terms-amend-form.interface';
import { IFinesAccPaymentTermsAmendState } from '../interfaces/fines-acc-payment-terms-amend-state.interface';
import { FINES_ACC_PAYMENT_TERMS_AMEND_FORM_FIELDS_TO_CHECK } from '../constants/fines-acc-payment-terms-amend-form-fields-to-check.constant';

/**
 * Checks if any form fields have been modified from their initial values
 * @param currentFormValue - Current form values
 * @param initialFormValue - Initial form values
 * @returns boolean indicating if changes have been made
 */
function hasFormFieldsChanged(
  currentFormValue: IFinesAccPaymentTermsAmendState,
  initialFormValue: IFinesAccPaymentTermsAmendState,
): boolean {
  if (!initialFormValue) {
    return true; // If no initial form data, consider it as changes made
  }

  return FINES_ACC_PAYMENT_TERMS_AMEND_FORM_FIELDS_TO_CHECK.some((field) => {
    const currentValue = currentFormValue[field as keyof typeof currentFormValue];
    const initialValue = initialFormValue[field as keyof typeof initialFormValue];

    // Handle null/undefined/empty string comparisons
    const normalizedCurrent = currentValue || null;
    const normalizedInitial = initialValue || null;

    return normalizedCurrent !== normalizedInitial;
  });
}

/**
 * Custom form validator that checks if change letter is selected without making form changes
 * @param initialFormData - The initial form data to compare against
 * @returns ValidatorFn that validates change letter restrictions
 */
export function changeLetterWithoutChangesValidator(
  initialFormData: IFinesAccPaymentTermsAmendForm | undefined,
): ValidatorFn {
  return (formGroup: AbstractControl) => {
    const changeLetterControl = formGroup.get('facc_payment_terms_change_letter');
    if (!changeLetterControl) {
      return null;
    }

    const changeLetterValue = changeLetterControl.value;
    const currentFormValue = formGroup.value;

    // Helper function to manage validation errors
    const manageNoChangesError = (hasError: boolean): void => {
      const currentErrors = changeLetterControl.errors || {};

      if (hasError) {
        changeLetterControl.setErrors({ ...currentErrors, noChangesMade: true });
      } else if (currentErrors['noChangesMade']) {
        delete currentErrors['noChangesMade'];
        changeLetterControl.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      }
    };

    // Early exits - no validation needed
    if (!changeLetterValue || !initialFormData?.formData || !currentFormValue) {
      manageNoChangesError(false);
      return null;
    }

    const hasChanges = hasFormFieldsChanged(currentFormValue, initialFormData.formData);

    // Show error if change letter is checked but no changes made
    if (!hasChanges) {
      manageNoChangesError(true);
      return { noChangesMade: true };
    }

    // Clear errors when changes are detected
    manageNoChangesError(false);
    return null;
  };
}
