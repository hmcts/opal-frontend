import { IOpalFinesDefendantAccountHistoryParams } from '@services/fines/opal-fines-service/interfaces/opal-fines-defendant-account-history-params.interface';
import { FINES_ACC_HISTORY_FILTER_ITEM_TYPE_MAP } from '../constants/fines-acc-history-filter-item-type-map.constant';
import { IFinesAccDefendantDetailsHistoryAndNotesFilterForm } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/interfaces/fines-acc-defendant-details-history-and-notes-filter-form.interface';
import { TFinesAccDefendantDetailsHistoryAndNotesFilterCategory } from '../../fines-acc-defendant-details/fines-acc-defendant-details-history-and-notes-tab/types/fines-acc-defendant-details-history-and-notes-filter-category.type';

/**
 * Builds the raw defendant account history filter query params from the submitted form.
 *
 * Date values remain in form format here and are transformed by `FinesAccPayloadService`.
 *
 * @param form - The submitted history and notes filter form.
 * @returns The untransformed history filter query params.
 */
export function buildHistoryFilterPayload(
  form: IFinesAccDefendantDetailsHistoryAndNotesFilterForm,
): IOpalFinesDefendantAccountHistoryParams {
  const { dateFrom, dateTo, categories } = form.formData;
  const itemTypes = Object.entries(categories)
    .filter(([, selected]) => selected)
    .map(
      ([category]) =>
        FINES_ACC_HISTORY_FILTER_ITEM_TYPE_MAP[category as TFinesAccDefendantDetailsHistoryAndNotesFilterCategory],
    )
    .filter((itemType): itemType is string => !!itemType);

  return {
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(itemTypes.length ? { itemTypes: itemTypes.join(',') } : {}),
  };
}
