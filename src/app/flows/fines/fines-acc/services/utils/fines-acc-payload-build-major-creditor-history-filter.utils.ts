import { IFinesAccHistoryAndNotesFilterForm } from '../../fines-acc-history-and-notes/interfaces/fines-acc-history-and-notes-filter-form.interface';
import { IOpalFinesMajorCreditorAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-major-creditor-account-history-params.interface';

/**
 * Builds the raw major creditor account history filter query params from the submitted form.
 *
 * Date values remain in form format here and are transformed by `FinesAccPayloadService`.
 *
 * @param form - The submitted history and notes filter form.
 * @returns The untransformed history filter query params.
 */
export function buildMajorCreditorHistoryFilterPayload(
  form: IFinesAccHistoryAndNotesFilterForm,
): IOpalFinesMajorCreditorAccountHistoryParams {
  const { dateFrom, dateTo } = form.formData;

  return {
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
  };
}
