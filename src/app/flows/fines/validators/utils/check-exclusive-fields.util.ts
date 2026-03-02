import { AbstractControl } from '@angular/forms';
import { isFormGroup } from './is-form-group.util';
import { hasNestedValue } from './has-nested-value.util';

/**
 * Checks if multiple form fields are populated simultaneously (for exclusive-use validation).
 *
 * @param control The form group to validate
 * @param fieldPairs Array of tuples [field1, field2] that should be mutually exclusive
 * @returns Validation errors or null
 */
export function checkExclusiveFields(
  control: AbstractControl,
  fieldPairs: [fieldName: string, otherFieldName: string][],
): { [key: string]: boolean } | null {
  if (!isFormGroup(control)) return null;

  const errors: { [key: string]: boolean } = {};

  for (const [field1, field2] of fieldPairs) {
    const value1 = hasNestedValue(control.get(field1)!);
    const value2 = hasNestedValue(control.get(field2)!);

    if (value1 && value2) {
      errors[`${field1}Exclusive`] = true;
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
