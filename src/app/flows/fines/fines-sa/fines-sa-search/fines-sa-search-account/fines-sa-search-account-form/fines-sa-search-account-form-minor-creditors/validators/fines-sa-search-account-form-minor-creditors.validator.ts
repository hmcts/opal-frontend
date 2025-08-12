import { FormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

/**
 * Checks whether any control in the provided FormGroup has a non-empty value.
 * - For string values, trims whitespace before evaluation.
 * - For non-strings, checks that the value is truthy.
 *
 * @param group The FormGroup to check for values.
 * @returns true if at least one control has a non-empty value; otherwise false.
 */
function hasGroupValue(group: FormGroup): boolean {
  return Object.values(group.controls).some((control: AbstractControl) => {
    const value = control.value;
    return typeof value === 'string' ? !!value.trim() : !!value;
  });
}

/**
 * Returns a validator that ensures the correct minor creditor group (individual or company)
 * is populated based on the selected creditor type.
 * - If the type is 'individual', the validator checks that the individual group has data.
 * - If the type is 'company', it checks the company group.
 * - Returns an appropriate validation error if the expected group is empty.
 *
 * @param getGroups A function that returns both the individual and company FormGroups.
 * @returns A ValidatorFn that validates the presence of required data.
 */
export function requiredMinorCreditorDataValidator(
  getGroups: () => { individualGroup: FormGroup; companyGroup: FormGroup },
): ValidatorFn {
  return (): ValidationErrors | null => {
    const { individualGroup, companyGroup } = getGroups();
    const type = individualGroup.parent?.get('fsa_search_account_minor_creditors_minor_creditor_type')?.value;

    if (!type) return null;

    const activeGroup = type === 'individual' ? individualGroup : companyGroup;
    if (hasGroupValue(activeGroup)) return null;

    return {
      [type === 'individual' ? 'requiredIndividualMinorCreditorData' : 'requiredCompanyMinorCreditorData']: true,
    };
  };
}
