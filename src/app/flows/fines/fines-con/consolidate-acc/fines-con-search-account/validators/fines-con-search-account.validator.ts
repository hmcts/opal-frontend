import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createExactlyOneCriteriaValidator } from '../../../../validators/exactly-one-criteria.validator';

/**
 * Tab type for search account form
 */
export type FinesConSearchAccountTab = 'individual' | 'company';

/**
 * Validator that ensures exactly one search criterion is provided per active tab.
 * The validation rule differs based on the active tab:
 * - For individual: exactly one of last_name, first_names, or date_of_birth
 * - For company: exactly one of company_name or reference_number
 *
 * @param activeTab - The currently active tab ('individual' or 'company')
 * @returns A validator function that checks for exactly one criterion
 */
export function activeTabCriteriaValidator(activeTab: FinesConSearchAccountTab): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) return null;

    const fieldsByTab: Record<FinesConSearchAccountTab, string[]> = {
      individual: [
        'fcon_search_account_individuals_last_name',
        'fcon_search_account_individuals_first_names',
        'fcon_search_account_individuals_date_of_birth',
      ],
      company: ['fcon_search_account_companies_name', 'fcon_search_account_companies_reference_number'],
    };

    const fieldsToCheck = fieldsByTab[activeTab];
    if (!fieldsToCheck) return null;

    return createExactlyOneCriteriaValidator(fieldsToCheck, [])(control);
  };
}
