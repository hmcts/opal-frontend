import { IOpalFinesApr } from '@services/fines/opal-fines-service/interfaces/opal-fines-apr.interface';
import { IOpalFinesAprsResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-aprs-response.interface';
import { DateTime } from 'luxon';
import { IFinesAccAprAddChangeFormState } from '../../fines-acc-apr-add-change/interfaces/fines-acc-apr-add-change-form-state.interface';
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
 * Maps a selected APR into the shared Add or Change form state.
 *
 * @param reference - The selected reference for Change, or null for Add.
 * @returns Form state containing the reference text unchanged, or an empty text for Add.
 */
export function transformAprToForm(reference: IOpalFinesApr | null): IFinesAccAprAddChangeFormState {
  return { apr_text: reference?.apr_text ?? '' };
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
