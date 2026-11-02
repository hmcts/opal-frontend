import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { DateTime } from 'luxon';
import { canAddApr, canChangeApr, canRemoveApr } from '../../fines-acc-apr-list/utils/fines-acc-apr.utils';
import { IFinesAccAprListData } from '../../fines-acc-apr-list/interfaces/fines-acc-apr-list-data.interface';
import { IFinesAccAprListRow } from '../../fines-acc-apr-list/interfaces/fines-acc-apr-list-row.interface';

/** APR timestamps without an explicit offset are UTC as well. */
function formatAprDate(value: string | null): string {
  if (!value) return '—';
  const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
  return date.isValid ? date.setLocale('en-GB').toFormat('dd MMMM yyyy') : '—';
}

export function transformAprsPayload(response: IOpalFinesAprsResponse): IFinesAccAprListData {
  const currentReferences: IFinesAccAprListRow[] = [];
  const consolidatedReferences: IFinesAccAprListRow[] = [];

  for (const reference of response.references) {
    if (reference.category !== 'APR') continue;
    const row: IFinesAccAprListRow = {
      ...reference,
      createdDate: formatAprDate(reference.created_at),
      updatedDate: formatAprDate(reference.updated_at),
      canChange: canChangeApr(reference),
      canRemove: canRemoveApr(reference),
    };
    if (reference.relationship === 'APR') currentReferences.push(row);
    else consolidatedReferences.push(row);
  }

  return {
    ...response,
    currentReferences,
    consolidatedReferences,
    canAdd: canAddApr(response.references),
  };
}
