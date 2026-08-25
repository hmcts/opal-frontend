import {
  createHistoryDetails,
  createHistoryLabelValuePart,
  createHistoryTextPart,
  formatHistoryDate,
  getHistoryString,
  IHistoryDetails,
  THistoryDetailsRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS } from '../constants/fines-acc-history-and-notes-details-cheque-status-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT } from '../constants/fines-acc-history-and-notes-details-date-format.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-history-and-notes-details-field-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS } from '../constants/fines-acc-history-and-notes-details-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';

/**
 * Transforms a major-creditor financial history item into display-ready Details data.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for a future history-table component.
 */
export function transformMajorCreditorTransactionDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  const transactionTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES;
  const transactionType = getHistoryString(
    item,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES,
    [],
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
  );

  // BACS history items have the ticket's specific two-part display rule.
  if (transactionType === transactionTypes.bacs) {
    return createHistoryDetails([
      createHistoryTextPart(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.bacsPayment),
      createHistoryLabelValuePart(
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.paymentReference,
        getHistoryString(
          item,
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference,
          [],
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
        ),
      ),
    ]);
  }

  // CHEQUE history items show the issue status, cheque number, and an optional status/date part.
  if (transactionType === transactionTypes.cheque) {
    const chequeNumber = getHistoryString(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference,
      [],
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
    );
    const status = getHistoryString(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.status,
      [],
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
    );
    const statusLabel = status ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS[status] : null;
    const statusDate = formatHistoryDate(
      getHistoryString(
        item,
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.statusDate,
        [],
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
      ),
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT,
    );

    return createHistoryDetails([
      createHistoryTextPart(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeIssued),
      createHistoryLabelValuePart(
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeNumber,
        chequeNumber ?? FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.notYetWritten,
      ),
      statusLabel ? createHistoryTextPart([statusLabel, statusDate].filter(Boolean).join(' ')) : null,
    ]);
  }

  // Other financial items currently display their transaction type as one text part.
  return createHistoryDetails([createHistoryTextPart(transactionType)]);
}
