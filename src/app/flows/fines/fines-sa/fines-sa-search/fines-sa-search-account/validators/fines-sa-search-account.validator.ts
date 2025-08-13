import { AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';

/**
 * Recursively checks whether any value exists within a control.
 * - For FormGroups, it checks all nested controls.
 * - For individual controls, it checks that the value is non-empty (excluding whitespace).
 *
 * @param control AbstractControl - the control to inspect
 * @returns boolean - true if any nested value is populated
 */
function hasNestedValue(control: AbstractControl): boolean {
  if (control instanceof FormGroup) {
    return Object.values(control.controls).some(hasNestedValue);
  }
  const value = control.value;
  return value !== null && value !== undefined && String(value).trim() !== '';
}

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
 *   - `fsa_search_account_major_creditor_search_criteria`
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
  if (!(group instanceof FormGroup)) return null;

  const accountNumberRaw = group.get('fsa_search_account_number')?.value;
  const referenceNumberRaw = group.get('fsa_search_account_reference_case_number')?.value;

  const accountNumber = typeof accountNumberRaw === 'string' ? accountNumberRaw.trim() : accountNumberRaw;
  const referenceNumber = typeof referenceNumberRaw === 'string' ? referenceNumberRaw.trim() : referenceNumberRaw;

  const nestedGroupKeys = [
    'fsa_search_account_individuals_search_criteria',
    'fsa_search_account_companies_search_criteria',
    'fsa_search_account_minor_creditors_search_criteria',
    'fsa_search_account_major_creditor_search_criteria',
  ];

  const nestedGroups = nestedGroupKeys
    .map((key) => group.get(key))
    .filter((g): g is FormGroup => g instanceof FormGroup);

  // Only run this validator if all nested groups are valid
  const allNestedGroupsValid = nestedGroups.every((g) => g.valid);

  if (!allNestedGroupsValid) {
    return null; // Defer validation until nested groups are valid
  }

  const populatedCount = [!!accountNumber, !!referenceNumber, ...nestedGroups.map(hasNestedValue)].filter(
    Boolean,
  ).length;

  if (populatedCount === 1) {
    return null;
  } else if (populatedCount === 0) {
    return { formEmpty: true };
  } else {
    return { atLeastOneCriteriaRequired: true };
  }
}
