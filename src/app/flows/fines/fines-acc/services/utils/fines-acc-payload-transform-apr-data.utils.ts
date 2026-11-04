import {
  IOpalFinesApr,
  IOpalFinesAprsResponse,
} from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { DateTime } from 'luxon';
import { IFinesAccAprAddChangeFormState } from '../../fines-acc-apr-add-change/interfaces/fines-acc-apr-add-change-form-state.interface';
import { canAddApr, canChangeApr, canRemoveApr } from '../../fines-acc-apr-manage/utils/fines-acc-apr.utils';
import { IFinesAccAprManageData } from '../../fines-acc-apr-manage/interfaces/fines-acc-apr-manage-data.interface';
import { IFinesAccAprManageRow } from '../../fines-acc-apr-manage/interfaces/fines-acc-apr-manage-row.interface';

/** APR timestamps without an explicit offset are UTC as well. */
function formatAprDate(value: string | null): string {
  if (!value) return '—';
  const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
  return date.isValid ? date.setLocale('en-GB').toFormat('dd MMMM yyyy') : '—';
}

export function transformAprToForm(reference: IOpalFinesApr | null): IFinesAccAprAddChangeFormState {
  return { apr_text: reference?.apr_text ?? '' };
}

export function transformAprsPayload(response: IOpalFinesAprsResponse): IFinesAccAprManageData {
  const currentReferences: IFinesAccAprManageRow[] = [];
  const consolidatedReferences: IFinesAccAprManageRow[] = [];

  for (const reference of response.references) {
    if (reference.category !== 'APR') continue;
    const row: IFinesAccAprManageRow = {
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
