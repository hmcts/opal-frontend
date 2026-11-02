import { DateTime } from 'luxon';
import { IOpalFinesAlternatePaymentReference } from '@services/fines/opal-fines-service/interfaces/opal-fines-alternate-payment-reference.interface';

export const canChangeAlternatePaymentReference = (reference: IOpalFinesAlternatePaymentReference): boolean =>
  reference.category === 'APR' && reference.relationship === 'APR';

export const canRemoveAlternatePaymentReference = (reference: IOpalFinesAlternatePaymentReference): boolean =>
  reference.category === 'APR';

export const canAddAlternatePaymentReference = (references: IOpalFinesAlternatePaymentReference[]): boolean =>
  !references.some((reference) => reference.relationship === 'APR');

/** The service returns UTC values, including ISO strings without an explicit offset. */
export const formatAlternatePaymentReferenceDate = (value: string | null): string => {
  if (!value) return '—';
  const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
  return date.isValid ? date.setLocale('en-GB').toFormat('dd MMMM yyyy') : '—';
};
