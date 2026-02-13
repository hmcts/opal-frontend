import { AbstractControl, ValidationErrors } from '@angular/forms';
import { createExactlyOneCriteriaValidator } from 'src/app/flows/fines/validators/exactly-one-criteria.validator';

/**
 * Custom validator to ensure that exactly one search criteria is populated in the form group.
 *
 * This validator checks the following controls within the provided `FormGroup`:
 * - `fsa_search_account_number`
 * - `fsa_search_account_reference_case_number`
 * - Nested groups:
 *   - `fsa_search_account_individuals_search_criteria`
 *   - `fsa_search_account_companies_search_criteria`
 *   - `fsa_search_account_minor_creditors_search_criteria`
 *   - `fsa_search_account_major_creditors_search_criteria`
 *
 * The validator only runs if all nested groups are valid. It returns:
 * - `null` if exactly one of the criteria is populated (valid state)
 * - `{ formEmpty: true }` if none of the criteria are populated
 * - `{ atLeastOneCriteriaRequired: true }` if more than one criteria is populated
 *
 * @param group The `AbstractControl` (expected to be a `FormGroup`) containing the search criteria controls.
 * @returns A `ValidationErrors` object if the validation fails, or `null` if it passes.
 */
export function atLeastOneCriteriaValidator(group: AbstractControl): ValidationErrors | null {
  const directCriteria = ['fsa_search_account_number', 'fsa_search_account_reference_case_number'];
  const nestedCriteria = [
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
    'fsa_search_account_minor_creditors_search_criteria',
    'fsa_search_account_major_creditors_search_criteria',
  ];

  return createExactlyOneCriteriaValidator(directCriteria, nestedCriteria)(group);
}
