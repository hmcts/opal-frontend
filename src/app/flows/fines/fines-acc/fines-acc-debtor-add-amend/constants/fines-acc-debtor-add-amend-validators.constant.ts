import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator for employer fields.
 * If any employer field is filled out, then employer reference and employer company name are required.
 */
export const employerFieldsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control || !control.parent) {
    return null;
  }

  const employerCompanyName = control.parent.get('facc_debtor_add_amend_employer_details_employer_company_name')?.value;
  const employerReference = control.parent.get('facc_debtor_add_amend_employer_details_employer_reference')?.value;
  const employerEmail = control.parent.get('facc_debtor_add_amend_employer_details_employer_email_address')?.value;
  const employerTelephone = control.parent.get(
    'facc_debtor_add_amend_employer_details_employer_telephone_number',
  )?.value;
  const employerAddress1 = control.parent.get('facc_debtor_add_amend_employer_details_employer_address_line_1')?.value;
  const employerAddress2 = control.parent.get('facc_debtor_add_amend_employer_details_employer_address_line_2')?.value;
  const employerAddress3 = control.parent.get('facc_debtor_add_amend_employer_details_employer_address_line_3')?.value;
  const employerAddress4 = control.parent.get('facc_debtor_add_amend_employer_details_employer_address_line_4')?.value;
  const employerAddress5 = control.parent.get('facc_debtor_add_amend_employer_details_employer_address_line_5')?.value;
  const employerPostCode = control.parent.get('facc_debtor_add_amend_employer_details_employer_post_code')?.value;

  const hasAnyEmployerField =
    employerCompanyName ||
    employerReference ||
    employerEmail ||
    employerTelephone ||
    employerAddress1 ||
    employerAddress2 ||
    employerAddress3 ||
    employerAddress4 ||
    employerAddress5 ||
    employerPostCode;

  // If any employer field is filled but company name or reference is missing, return error
  if (hasAnyEmployerField) {
    const controlName = control?.parent?.controls
      ? Object.keys(control.parent.controls).find((key) => control.parent?.get(key) === control)
      : '';

    if (controlName === 'facc_debtor_add_amend_employer_details_employer_company_name' && !employerCompanyName) {
      return { required: true };
    }

    if (controlName === 'facc_debtor_add_amend_employer_details_employer_reference' && !employerReference) {
      return { required: true };
    }

    if (controlName === 'facc_debtor_add_amend_employer_details_employer_address_line_1' && !employerAddress1) {
      return { required: true };
    }
  }

  return null;
};
