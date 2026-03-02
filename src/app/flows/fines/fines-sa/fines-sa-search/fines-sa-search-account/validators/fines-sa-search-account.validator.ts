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
  ];

  return createExclusiveFieldValidator(rules, {
    criteriaPaths,
    emptyErrorKey: 'formEmpty',
    multipleErrorKey: 'atLeastOneCriteriaRequired',
  })(control);
}) as ValidatorFn;
