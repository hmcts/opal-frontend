import { AbstractControl } from '@angular/forms';
import { isFormGroup } from './is-form-group.util';
import { hasNestedValue } from './has-nested-value.util';

/**
 * Creates a validator function that checks if at least one field has a value for a specific tab.
 * Used when different tabs have different validation requirements.
 *
 * @param tabConfigs Array of configurations for each tab indicating which fields to check
 * @param currentTab The current active tab
 * @param errorKey The error key to return if validation fails (default: 'atLeastOneCriteria')
 * @returns A validator function
 */
export function createTabBasedAtLeastOneValidator(
  tabConfigs: Map<string, string[]>,
  currentTab: string,
  errorKey = 'atLeastOneCriteria',
) {
  return (control: AbstractControl) => {
    if (!isFormGroup(control)) return null;

    const fieldsForTab = tabConfigs.get(currentTab);
    if (!fieldsForTab) return null;

    const hasAnyValue = fieldsForTab.some((fieldName) => {
      const fieldControl = control.get(fieldName);
      return fieldControl ? hasNestedValue(fieldControl) : false;
    });

    return hasAnyValue ? null : { [errorKey]: true };
  };
}
