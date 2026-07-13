import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createExclusiveFieldValidator } from '@app/flows/fines/validators/exclusive-field.validator';

/**
 * Cross-field validator for SA search field validation.
 *
 * Rule:
 * - Account number must be used exclusively against reference number and individuals criteria.
 * - Reference number must be used exclusively against account number and individuals criteria.
 */
export const finesSaOneCriteriaValidator: ValidatorFn = ((control: AbstractControl): ValidationErrors | null => {
  const nationalInsuranceField =
    'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_national_insurance_number';
  const criteriaPaths = [
    'fsa_search_account_number',
    'fsa_search_account_reference_case_number',
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
    'fsa_search_account_minor_creditors_search_criteria',
    'fsa_search_account_major_creditors_search_criteria',
  ];

  const rules = [
    {
      primaryField: 'fsa_search_account_number',
      conflictingFields: [
        'fsa_search_account_reference_case_number',
        'fsa_search_account_individuals_search_criteria',
        'fsa_search_account_companies_search_criteria',
        'fsa_search_account_minor_creditors_search_criteria',
        'fsa_search_account_major_creditors_search_criteria',
      ],
      errorKey: 'atLeastOneCriteriaRequired',
    },
    {
      primaryField: 'fsa_search_account_reference_case_number',
      conflictingFields: [
        'fsa_search_account_number',
        'fsa_search_account_individuals_search_criteria',
        'fsa_search_account_companies_search_criteria',
        'fsa_search_account_minor_creditors_search_criteria',
        'fsa_search_account_major_creditors_search_criteria',
      ],
      errorKey: 'atLeastOneCriteriaRequired',
    },
    {
      primaryField: nationalInsuranceField,
      conflictingFields: [
        'fsa_search_account_number',
        'fsa_search_account_reference_case_number',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_last_name',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_last_name_exact_match',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_first_names',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_first_names_exact_match',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_include_aliases',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_date_of_birth',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_address_line_1',
        'fsa_search_account_individuals_search_criteria.fsa_search_account_individuals_post_code',
        'fsa_search_account_companies_search_criteria',
        'fsa_search_account_minor_creditors_search_criteria',
        'fsa_search_account_major_creditors_search_criteria',
      ],
      errorKey: 'atLeastOneCriteriaRequired',
    },
  ];

  return createExclusiveFieldValidator(rules, {
    criteriaPaths,
    emptyErrorKey: 'formEmpty',
    multipleErrorKey: 'atLeastOneCriteriaRequired',
  })(control);
}) as ValidatorFn;
