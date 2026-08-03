import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const AMOUNT_IMPOSED_CONTROL_PREFIX = 'fm_offence_details_amount_imposed_';
const AMOUNT_PATTERN = /^(-?)(\d+)(?:\.(\d{0,2}))?$/;

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

  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const match = AMOUNT_PATTERN.exec(value.toString());
  if (!match) {
    const numericAmountInPence = Math.round(Number(value) * 100);
    return Number.isFinite(numericAmountInPence) ? BigInt(numericAmountInPence) : null;
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
