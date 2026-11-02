import { DateTime } from 'luxon';
import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';

export const canChangeApr = (reference: IOpalFinesApr): boolean =>
  reference.category === 'APR' && reference.relationship === 'APR';

export const canRemoveApr = (reference: IOpalFinesApr): boolean => reference.category === 'APR';

export const canAddApr = (references: IOpalFinesApr[]): boolean =>
  !references.some((reference) => reference.relationship === 'APR');

/** The service returns UTC values, including ISO strings without an explicit offset. */
export const formatAprDate = (value: string | null): string => {
  if (!value) return '—';
  const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
  return date.isValid ? date.setLocale('en-GB').toFormat('dd MMMM yyyy') : '—';
};
