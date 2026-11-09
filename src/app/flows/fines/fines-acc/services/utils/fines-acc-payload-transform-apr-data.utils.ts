import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-aprs-response.interface';
import { DateTime } from 'luxon';
import { canAddApr, canChangeApr, canRemoveApr } from '../../fines-acc-apr-manage/utils/fines-acc-apr.utils';
import { IFinesAccAprManageData } from '../../fines-acc-apr-manage/interfaces/fines-acc-apr-manage-data.interface';
import { IFinesAccAprManageRow } from '../../fines-acc-apr-manage/interfaces/fines-acc-apr-manage-row.interface';

/**
 * Formats an APR timestamp as a browser-local date, treating timestamps without an offset as UTC.
 *
 * @param value - The API timestamp, or null when no date is available.
 * @returns The local date in `dd MMMM yyyy` format, or an em dash for a missing or invalid date.
 */
function formatAprDate(value: string | null): string {
  if (!value) return '—';
  const date = DateTime.fromISO(value, { zone: 'utc' }).toLocal();
  return date.isValid ? date.setLocale('en-GB').toFormat('dd MMMM yyyy') : '—';
}

/**
 * Groups user-entered APRs for the Manage tables, preserving API order within each group.
 * Adds local display dates and action eligibility while retaining the original references and account version.
 *
 * @param response - The account's APRs and defendant-account version returned by the API.
 * @returns Manage data with current and consolidated user-entered APR rows, excluding ACC rows from both tables.
 */
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
