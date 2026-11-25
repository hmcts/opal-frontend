import { ValidatorFn } from '@angular/forms';

/**
 * Ensures a supplied high value is not below the valid minimum enforcement value.
 * @returns A group validator associating ordering errors with the minimum field.
 */
export function finesAecMinimumHighValueValidator(): ValidatorFn {
  return (form) => {
    const minimum = form.get('minimum_balance');
    const high = form.get('high_value');
    if (!minimum || !high) return null;

    const minimumErrors = { ...minimum.errors };
    delete minimumErrors['minHigherThanHigh'];
    const highIsPresent = high.value !== null && high.value !== undefined && String(high.value).trim() !== '';
    const minimumExceedsHigh =
      Object.keys(minimumErrors).length === 0 &&
      high.valid &&
      highIsPresent &&
      Number(minimum.value) > Number(high.value);

    if (minimumExceedsHigh) {
      minimum.setErrors({ ...minimumErrors, minHigherThanHigh: true }, { emitEvent: false });
      return { minHigherThanHigh: true };
    }

    if (minimum.hasError('minHigherThanHigh')) {
      minimum.setErrors(Object.keys(minimumErrors).length ? minimumErrors : null, { emitEvent: false });
    }
    return null;
  };
}
