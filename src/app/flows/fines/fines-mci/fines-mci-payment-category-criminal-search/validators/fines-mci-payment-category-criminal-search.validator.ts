import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { hasNestedValue } from '@app/flows/fines/validators/utils/has-nested-value.util';

const syncRequiredValidator = (control: AbstractControl | null, required: boolean): void => {
  if (!control) {
    return;
  }

  const hasRequiredValidator = control.hasValidator(Validators.required);

  if (required && !hasRequiredValidator) {
    control.addValidators(Validators.required);
    control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  if (!required && hasRequiredValidator) {
    control.removeValidators(Validators.required);
    control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }
};

export const finesMciPaymentCategoryCriminalSearchIndividualsValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }

  const lastNameControl = control.get('fsa_search_account_individuals_last_name');
  const firstNamesControl = control.get('fsa_search_account_individuals_first_names');

  syncRequiredValidator(
    lastNameControl,
    hasNestedValue(control.get('fsa_search_account_individuals_first_names')!) ||
      hasNestedValue(control.get('fsa_search_account_individuals_last_name_exact_match')!) ||
      hasNestedValue(control.get('fsa_search_account_individuals_include_aliases')!),
  );
  syncRequiredValidator(
    firstNamesControl,
    hasNestedValue(control.get('fsa_search_account_individuals_first_names_exact_match')!),
  );

  return null;
};

export const finesMciPaymentCategoryCriminalSearchCompaniesValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }

  syncRequiredValidator(
    control.get('fsa_search_account_companies_company_name'),
    hasNestedValue(control.get('fsa_search_account_companies_company_name_exact_match')!) ||
      hasNestedValue(control.get('fsa_search_account_companies_include_aliases')!),
  );

  return null;
};

export const finesMciPaymentCategoryCriminalSearchOneCriteriaValidator = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }

  const populatedCriteriaCount = [
    'fsa_search_account_number',
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
  ].filter((path) => {
    const criteriaControl = control.get(path);
    return criteriaControl ? hasNestedValue(criteriaControl) : false;
  }).length;

  if (populatedCriteriaCount === 0) {
    return { formEmpty: true };
  }

  if (populatedCriteriaCount > 1) {
    return { searchCriteriaCannotBeCombined: true };
  }

  return null;
};
