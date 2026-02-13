import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { isFormGroup } from './utils/is-form-group.util';
import { hasNestedValue } from './utils/has-nested-value.util';
import { getNormalizedStringValue } from './utils/get-normalized-string-value.util';

/**
 * Custom validator to ensure that exactly one criteria is populated in the form group.
 *
 * This validator checks the following controls within the provided `FormGroup`:
 * - Direct criteria fields (simple form controls)
 * - Nested criteria groups (FormGroups containing multiple related fields)
 *
 * The validator only runs if all nested groups are valid. It returns:
 * - `null` if exactly one of the criteria is populated (valid state)
 * - `{ formEmpty: true }` if none of the criteria are populated
 * - `{ atLeastOneCriteriaRequired: true }` if more than one criteria is populated
 *
 * @param directCriteria Array of field names for direct criteria fields
 * @param nestedCriteria Array of field names for nested criteria groups
 * @returns A validator function
 */
export function createExactlyOneCriteriaValidator(directCriteria: string[], nestedCriteria: string[]) {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!isFormGroup(group)) return null;

    // If no criteria are specified, validation passes (nothing to validate)
    if (directCriteria.length === 0 && nestedCriteria.length === 0) {
      return null;
    }

    const nestedGroups = nestedCriteria
      .map((key) => group.get(key))
      .filter((g): g is FormGroup => g !== null && isFormGroup(g));

    // Only run this validator if all nested groups are valid
    const allNestedGroupsValid = nestedGroups.every((g) => g.valid);

    if (!allNestedGroupsValid) {
      return null; // Defer validation until nested groups are valid
    }

    const populatedCount = [
      ...directCriteria
        .map((field) => getNormalizedStringValue(group.get(field)))
        .filter((value) => value !== null)
        .map(() => true),
      ...nestedGroups.map(hasNestedValue).filter(Boolean),
    ].length;

    if (populatedCount === 1) {
      return null;
    } else if (populatedCount === 0) {
      return { formEmpty: true };
    } else {
      return { atLeastOneCriteriaRequired: true };
    }
  };
}
