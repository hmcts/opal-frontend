import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { FINES_ACC_APR_ROUTING_PATHS } from '../constants/fines-acc-apr-routing-paths.constant';

export const canChangeApr = (reference: IOpalFinesApr): boolean => reference.category === 'APR';

export const canRemoveApr = (reference: IOpalFinesApr): boolean => reference.category === 'APR';

export const canAddApr = (references: IOpalFinesApr[]): boolean =>
  !references.some((reference) => reference.relationship === 'APR');

/** Checks a page's selection against the references returned for the current account. */
export function canAccessAprPage(
  references: IOpalFinesApr[],
  action: string | undefined,
  selectedId?: number,
): boolean {
  const { children } = FINES_ACC_APR_ROUTING_PATHS;
  const selected = references.find((reference) => reference.alternate_payment_reference_id === selectedId);

  switch (action) {
    case children.add:
      return canAddApr(references);
    case children.change:
      return !!selected && canChangeApr(selected);
    case children.delete:
      return !!selected && canRemoveApr(selected);
    default:
      return true;
  }
}
