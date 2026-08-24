import {
  createHistoryDetails,
  createHistoryLabelValuePart,
  createHistoryTextPart,
  getHistoryString,
  IHistoryDetails,
  THistoryDetailsRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-history-and-notes-details-field-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';

const BACS_TRANSACTION_TYPE = 'BACS';
const BACS_PAYMENT_LABEL = 'BACS payment';
const PAYMENT_REFERENCE_LABEL = 'Payment reference:';

/**
 * Transforms a major-creditor financial history item into display-ready Details data.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for the history-table component.
 */
export function transformMajorCreditorTransactionDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  const transactionType = getHistoryString(
    item,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES,
    [],
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
  );

  // BACS history items have the ticket's specific two-part display rule.
  if (transactionType === BACS_TRANSACTION_TYPE) {
    return createHistoryDetails([
      createHistoryTextPart(BACS_PAYMENT_LABEL),
      createHistoryLabelValuePart(
        PAYMENT_REFERENCE_LABEL,
        getHistoryString(
          item,
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference,
          [],
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
        ),
      ),
    ]);
  }

  // Other financial items currently display their transaction type as one text part.
  return createHistoryDetails([createHistoryTextPart(transactionType)]);
}
