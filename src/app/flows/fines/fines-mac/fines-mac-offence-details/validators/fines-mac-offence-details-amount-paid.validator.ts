import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const AMOUNT_IMPOSED_CONTROL_PREFIX = 'fm_offence_details_amount_imposed_';

/**
 * Converts a valid monetary value to pence without losing precision for large amounts.
 *
 * Returns null for empty or invalid values so the existing required and amount validators
 * can surface their own errors.
 */
function amountToPence(value: unknown): bigint | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const match = String(value).match(/^(-?)(\d+)(?:\.(\d{0,2}))?$/);
  if (!match) {
    return null;
  }

  const [, sign, pounds, pence = ''] = match;
  const amount = BigInt(pounds) * 100n + BigInt(pence.padEnd(2, '0') || '0');

  return sign === '-' ? -amount : amount;
}

/**
 * Validates that the amount paid for an imposition does not exceed its amount imposed.
 */
export const finesMacOffenceDetailsAmountPaidValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const parent = control.parent;
  if (!parent) {
    return null;
  }

  const amountImposedControlName = Object.keys(parent.controls).find((controlName) =>
    controlName.startsWith(AMOUNT_IMPOSED_CONTROL_PREFIX),
  );
  const amountImposed = amountToPence(amountImposedControlName ? parent.get(amountImposedControlName)?.value : null);
  const amountPaid = amountToPence(control.value);

  if (amountImposed === null || amountPaid === null) {
    return null;
  }

  return amountPaid > amountImposed ? { amountPaidExceedsAmountImposed: true } : null;
};
