import { IOpalFinesMajorCreditorAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-account-history-params.interface';
import { IFinesAccHistoryAndNotesFilterForm } from '../../fines-acc-history-and-notes/interfaces/fines-acc-history-and-notes-filter-form.interface';
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
): IOpalFinesMajorCreditorAccountHistoryParams {
  const { dateFrom, dateTo } = form.formData;

  return {
    ...(dateFrom ? { dateFrom: finesAccDateToRfc3339UtcTimestamp(dateFrom) } : {}),
    ...(dateTo ? { dateTo: finesAccDateToRfc3339UtcTimestamp(dateTo) } : {}),
  };
}
