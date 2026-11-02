import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';

export const canChangeApr = (reference: IOpalFinesApr): boolean =>
  reference.category === 'APR' && reference.relationship === 'APR';

export const canRemoveApr = (reference: IOpalFinesApr): boolean => reference.category === 'APR';

export const canAddApr = (references: IOpalFinesApr[]): boolean =>
  !references.some((reference) => reference.relationship === 'APR');
