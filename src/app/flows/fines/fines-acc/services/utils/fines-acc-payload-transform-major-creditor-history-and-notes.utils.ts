import {
  createHistoryDetails,
  createHistoryLabelValuePart,
  createHistoryTextPart,
  getHistoryString,
  normaliseHistoryTransactionType,
  IHistoryDetails,
  THistoryDetailsRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES } from '../constants/fines-acc-history-and-notes-details-alias-path-prefixes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';

const BACS_TRANSACTION_TYPE = 'BACS';
const BACS_PAYMENT_LABEL = 'BACS payment';
const PAYMENT_REFERENCE_LABEL = 'Payment reference:';
const TRANSACTION_TYPE_ALIASES = ['details.transactionType.transactionType', 'details.transactionType'];
const PAYMENT_REFERENCE_ALIASES = ['details.paymentReference'];

/**
 * Transforms a major-creditor financial history item into display-ready Details data.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for a future history-table component.
 */
export function transformMajorCreditorTransactionDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  // Reads the transaction type from the API item, accepting either documented raw shape,
  // then normalises it to the common comparison/display representation.
  const transactionType = normaliseHistoryTransactionType(
    // Finds the first usable transaction-type value using the supplied alias paths.
    getHistoryString(
      // Supplies the complete raw history item received from the backend.
      item,
      // Tries the nested transaction-type field first, then the legacy/direct field.
      TRANSACTION_TYPE_ALIASES,
      // Allows the common helper to resolve each alias from the supported root locations.
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES,
      // Treats configured placeholder values as absent rather than displaying them.
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
    ),
  );

  // Uses the BACS-specific display rule only when the normalised transaction type is BACS.
  if (transactionType === BACS_TRANSACTION_TYPE) {
    // Creates the common fragment-based details model for the future History table.
    const details = createHistoryDetails([
      // Adds the user-facing transaction description as the first display fragment.
      createHistoryTextPart(BACS_PAYMENT_LABEL),
      // Adds a labelled value fragment so the payment reference can be styled consistently.
      createHistoryLabelValuePart(
        // Supplies the business label shown immediately before the reference value.
        PAYMENT_REFERENCE_LABEL,
        // Extracts the BACS payment reference from the same raw history item.
        getHistoryString(
          // Supplies the complete raw history item received from the backend.
          item,
          // Identifies the raw field that contains the BACS payment reference.
          PAYMENT_REFERENCE_ALIASES,
          // Allows the common helper to resolve the reference alias from supported root locations.
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES,
          // Treats configured placeholder reference values as absent.
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
        ),
      ),
    ]);

    console.log('PO-2657 major-creditor history details', details);

    return details;
  }

  // Falls back to showing the normalised transaction type for every non-BACS financial item.
  const details = createHistoryDetails([createHistoryTextPart(transactionType)]);

  console.log('PO-2657 major-creditor history details', details);

  return details;
}
