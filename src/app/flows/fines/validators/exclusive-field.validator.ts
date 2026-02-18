import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isFormGroup } from './utils/is-form-group.util';
import { hasNestedValue } from './utils/has-nested-value.util';
import { ExclusiveFieldRuleConfig } from './interfaces/exclusive-field-rule-config.interface';

/**
 * Creates a validator that enforces exclusive-use rules between form fields.
 *
 * This is useful when certain search fields must be used in isolation and cannot
 * be combined with other fields.
 *
 * @param rules Array of exclusive field rules to enforce
 * @returns A validator function
 *
 * @example
 * const rules: ExclusiveFieldRuleConfig[] = [
 *   {
 *     primaryField: 'account_number',
 *     conflictingFields: ['first_name', 'last_name', 'ni_number'],
 *     errorKey: 'accountNumberMustBeExclusive'
 *   }
 * ];
 * createExclusiveFieldValidator(rules)
 */
export function createExclusiveFieldValidator(rules: ExclusiveFieldRuleConfig[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isFormGroup(control)) return null;

    for (const rule of rules) {
      const primaryControl = control.get(rule.primaryField);
      if (!primaryControl) continue; // Skip if primary field doesn't exist

      const primaryValue = hasNestedValue(primaryControl);

      if (!primaryValue) continue; // Skip if primary field is empty

      const hasConflict = rule.conflictingFields.some((fieldName) => {
        const conflictControl = control.get(fieldName);
        return conflictControl ? hasNestedValue(conflictControl) : false;
      });

      if (hasConflict) {
        return { [rule.errorKey]: true };
      }
    }

    return null;
  };
}
