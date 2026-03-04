import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createExclusiveFieldValidator } from '../../../../../validators/exclusive-field.validator';

/**
 * Cross-field validator for exclusive search field validation (AC6).
 *
 * AC6a: Account number must be used exclusively - no other fields allowed
 * AC6b: National Insurance number must be used exclusively - no other fields allowed
 * AC6c: Account number and National Insurance number cannot be used together
 *
 * Returns validation errors if:
 * - Account number is entered with any other search fields or NI number
 * - National Insurance number is entered with any other search fields or account number
 */
export const consolidateSearchAccountFormValidator: ValidatorFn = ((
  control: AbstractControl,
): ValidationErrors | null => {
  const criteriaPaths = [
    'fcon_search_account_number',
    'fcon_search_account_national_insurance_number',
    'fcon_search_account_individuals_search_criteria',
    'fcon_search_account_companies_search_criteria',
  ];

  const rules = [
    {
      primaryField: 'fcon_search_account_number',
      conflictingFields: [
        'fcon_search_account_national_insurance_number',
        'fcon_search_account_individuals_search_criteria',
        'fcon_search_account_companies_search_criteria',
      ],
      errorKey: 'atLeastOneCriteriaRequired',
    },
    {
      primaryField: 'fcon_search_account_national_insurance_number',
      conflictingFields: ['fcon_search_account_number', 'fcon_search_account_individuals_search_criteria'],
      errorKey: 'atLeastOneCriteriaRequired',
    },
  ];

  return createExclusiveFieldValidator(rules, {
    criteriaPaths,
    emptyErrorKey: 'formEmpty',
    multipleErrorKey: 'atLeastOneCriteriaRequired',
  })(control);
}) as ValidatorFn;
