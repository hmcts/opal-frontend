import { IOpalFinesMinorCreditorAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-minor-creditor-account-history-params.interface';
import { IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm } from '../../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/interfaces/fines-acc-minor-creditor-details-history-and-notes-filter-form.interface';
import { TFinesAccMinorCreditorDetailsHistoryAndNotesFilterCategory } from '../../fines-acc-minor-creditor-details/fines-acc-minor-creditor-details-history-and-notes-tab/types/fines-acc-minor-creditor-details-history-and-notes-filter-category.type';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_FILTER_ITEM_TYPE_MAP } from '../constants/fines-acc-minor-creditor-history-filter-item-type-map.constant';

const toRfc3339UtcTimestamp = (date: string): string => {
  const [day, month, year] = date.split('/').map(Number);

  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString();
};

/**
 * Builds the raw minor creditor account history filter query params from the submitted form.
 *
 * Date values are converted to RFC3339 UTC timestamps here so the service can pass them through unchanged.
 *
 * @param form - The submitted history and notes filter form.
 * @returns The untransformed minor creditor history filter query params.
 */
export function buildMinorCreditorHistoryFilterPayload(
  form: IFinesAccMinorCreditorDetailsHistoryAndNotesFilterForm,
): IOpalFinesMinorCreditorAccountHistoryParams {
  const { dateFrom, dateTo, categories } = form.formData;
  const itemTypes = Object.entries(categories)
    .filter(([, selected]) => selected)
    .map(
      ([category]) =>
        FINES_ACC_MINOR_CREDITOR_HISTORY_FILTER_ITEM_TYPE_MAP[
          category as TFinesAccMinorCreditorDetailsHistoryAndNotesFilterCategory
        ],
    )
    .filter((itemType): itemType is string => !!itemType);

  return {
    ...(dateFrom ? { dateFrom: toRfc3339UtcTimestamp(dateFrom) } : {}),
    ...(dateTo ? { dateTo: toRfc3339UtcTimestamp(dateTo) } : {}),
    ...(itemTypes.length ? { itemTypes: itemTypes.join(',') } : {}),
  };
}
