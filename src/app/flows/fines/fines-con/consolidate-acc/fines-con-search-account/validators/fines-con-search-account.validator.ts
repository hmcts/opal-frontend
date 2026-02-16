import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { createExactlyOneCriteriaValidator } from '../../../../validators/exactly-one-criteria.validator';

/**
 * Validator that ensures exactly one search criterion is provided for the individuals tab.
 * The validation requires exactly one of: last_name, first_names, or date_of_birth
 *
 * @returns A validator function that checks for exactly one criterion
 */
export function exclusiveSearchFieldValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) return null;

    const fieldsToCheck = [
      'fcon_search_account_individuals_last_name',
      'fcon_search_account_individuals_first_names',
      'fcon_search_account_individuals_date_of_birth',
    ];

    return createExactlyOneCriteriaValidator(fieldsToCheck, [])(control);
  };
}
