import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { isFormGroup } from './utils/is-form-group.util';
import { hasNestedValue } from './utils/has-nested-value.util';
import { ConditionalRequiredRuleConfig } from './interfaces/conditional-required-rule-config.interface';

/**
 * Creates a validator that conditionally applies `Validators.required` to dependent fields.
 *
 * A dependent field is marked required when any of its trigger fields has a value.
 * This validator mutates control validators and returns `null` so field-level errors
 * remain standard Angular `required` errors.
 */
export function createConditionalRequiredValidator(rules: ConditionalRequiredRuleConfig[]) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!isFormGroup(control)) return null;

    let hasInvalidRuleConfig = false;

    for (const rule of rules) {
      const dependentControl = control.get(rule.dependentField);
      if (!dependentControl) {
        hasInvalidRuleConfig = true;
        continue;
      }

      const shouldBeRequired = rule.triggerFields.some((fieldName) => {
        const triggerControl = control.get(fieldName);
        return triggerControl ? hasNestedValue(triggerControl) : false;
      });

      const isRequiredPresent = dependentControl.hasValidator(Validators.required);

      if (shouldBeRequired && !isRequiredPresent) {
        dependentControl.addValidators(Validators.required);
        dependentControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }

      if (!shouldBeRequired && isRequiredPresent) {
        dependentControl.removeValidators(Validators.required);
        dependentControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    }

    return hasInvalidRuleConfig ? { invalidConditionalRequiredRuleConfig: true } : null;
  };
}
