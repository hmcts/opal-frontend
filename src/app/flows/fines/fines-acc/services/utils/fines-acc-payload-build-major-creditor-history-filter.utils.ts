import { IFinesAccHistoryAndNotesFilterForm } from '../../fines-acc-history-and-notes/interfaces/fines-acc-history-and-notes-filter-form.interface';
import { IFinesAccMajorCreditorDetailsHistoryAndNotesFilterPayload } from '../../fines-acc-major-creditor-details/fines-acc-major-creditor-details-history-and-notes-tab/interfaces/fines-acc-major-creditor-details-history-and-notes-filter-payload.interface';
import { finesAccDateToRfc3339UtcTimestamp } from './fines-acc-date-to-rfc3339-utc-timestamp.utils';

/**
 * Builds the raw major creditor account history filter query params from the submitted form.
 *
 * Date values are converted to RFC3339 UTC timestamps here so the service can pass them through unchanged.
 *
 * @param form - The submitted history and notes filter form.
 * @returns The untransformed history filter query params.
 */
export function buildMajorCreditorHistoryFilterPayload(
  form: IFinesAccHistoryAndNotesFilterForm,
): IFinesAccMajorCreditorDetailsHistoryAndNotesFilterPayload {
  const { dateFrom, dateTo } = form.formData;

  return {
    ...(dateFrom ? { dateFrom: finesAccDateToRfc3339UtcTimestamp(dateFrom) } : {}),
    ...(dateTo ? { dateTo: finesAccDateToRfc3339UtcTimestamp(dateTo) } : {}),
  };
}
