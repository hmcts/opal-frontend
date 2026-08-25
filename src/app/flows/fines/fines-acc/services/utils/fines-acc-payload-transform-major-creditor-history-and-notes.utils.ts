import {
  createHistoryDetails,
  createHistoryLabelValuePart,
  createHistoryTextPart,
  formatHistoryDate,
  getHistoryString,
  IHistoryDetails,
  THistoryDetailsRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ASSOCIATED_RECORD_TYPES } from '../constants/fines-acc-history-and-notes-details-associated-record-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS } from '../constants/fines-acc-history-and-notes-details-cheque-status-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT } from '../constants/fines-acc-history-and-notes-details-date-format.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-history-and-notes-details-field-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS } from '../constants/fines-acc-history-and-notes-details-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS } from '../constants/fines-acc-history-and-notes-details-simple-transaction-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';
import { FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES } from '../constants/fines-acc-major-creditor-history-and-notes-transaction-templates.constant';

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

  const transactionTemplates = FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES;
  const bacsPaymentTitle = getTransactionLabel(transactionTemplates.bacsPayment, transactionType);

  if (bacsPaymentTitle) {
    return transformMajorCreditorBacsDetails(item, bacsPaymentTitle);
  }

  if (transactionType === transactionTypes.cancelledCheque) {
    return createHistoryDetails([
      createHistoryTextPart(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeCancelled),
      createHistoryLabelValuePart(
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeNumber,
        getHistoryString(
          item,
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference,
          [],
          FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
        ),
      ),
    ]);
  }

  if (transactionType === transactionTypes.cheque || transactionType === transactionTypes.reissuedCheque) {
    return transformMajorCreditorChequeDetails(
      item,
      transactionType === transactionTypes.cheque
        ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeIssued
        : FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeReissued,
    );
  }

  const defendantAccountTitle = getTransactionLabel(transactionTemplates.defendantAccount, transactionType);

  if (defendantAccountTitle) {
    return transformMajorCreditorAccountMovementDetails(
      item,
      defendantAccountTitle,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.defendantAccountNumber,
    );
  }

  if (transactionType === transactionTypes.repaymentFromSuspense) {
    return transformMajorCreditorAccountMovementDetails(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.repaymentFromSuspense,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordId,
    );
  }

  if (transactionType === transactionTypes.suspenseTransfer) {
    return transformMajorCreditorSuspenseTransferDetails(item);
  }

  const simpleTransactionLabel = transactionType
    ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS[
        transactionType as keyof typeof FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS
      ]
    : null;

  if (simpleTransactionLabel) {
    return createHistoryDetails([createHistoryTextPart(simpleTransactionLabel)]);
  }

  return createHistoryDetails([createHistoryTextPart(transactionType)]);
}

/**
 * Gets the documented display label for a transaction type from a template group.
 *
 * @param transactionLabels - The documented transaction-code-to-label mapping.
 * @param transactionType - The transaction code returned by the API.
 * @returns The matching label or null when the transaction is not in this template group.
 */
function getTransactionLabel<T extends Record<string, string>>(
  transactionLabels: T,
  transactionType: string | null,
): string | null {
  return transactionType && transactionType in transactionLabels ? transactionLabels[transactionType as keyof T] : null;
}

/**
 * Transforms a BACS payment action with its payment reference.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @param title - The ticket-defined BACS action label.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorBacsDetails(item: THistoryDetailsRawItem, title: string): IHistoryDetails {
  return createHistoryDetails([
    createHistoryTextPart(title),
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

/**
 * Transforms issued and reissued cheques, which have the same cheque-number and optional status rule.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @param title - The ticket-defined cheque action label.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorChequeDetails(item: THistoryDetailsRawItem, title: string): IHistoryDetails {
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
  return createHistoryDetails([
    createHistoryTextPart(title),
    createHistoryLabelValuePart(
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.chequeNumber,
      chequeNumber ?? FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.notYetWritten,
    ),
    statusLabel
      ? createHistoryTextPart(
          `${statusLabel} ${formatHistoryDate(
            getHistoryString(
              item,
              FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.statusDate,
              [],
              FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
            ),
            FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT,
          )}`,
        )
      : null,
  ]);
}

/**
 * Transforms a movement with the same optional second fragment: an associated account or suspense value.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @param title - The ticket-defined movement label.
 * @param valueAliases - The API field containing the optional associated value.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorAccountMovementDetails(
  item: THistoryDetailsRawItem,
  title: string,
  valueAliases: string[],
): IHistoryDetails {
  return createHistoryDetails([
    createHistoryTextPart(title),
    createHistoryTextPart(getHistoryString(item, valueAliases, [], FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES)),
  ]);
}

/**
 * Transforms a suspense transfer using the documented associated-record type to choose its optional value.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorSuspenseTransferDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  const associatedRecordType = getHistoryString(
    item,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordType,
    [],
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
  );
  const associatedRecordTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_ASSOCIATED_RECORD_TYPES;

  if (associatedRecordType === associatedRecordTypes.suspenseItem) {
    return transformMajorCreditorAccountMovementDetails(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.suspenseTransfer,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordId,
    );
  }

  if (associatedRecordType === associatedRecordTypes.defendantTransaction) {
    return transformMajorCreditorAccountMovementDetails(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.suspenseTransfer,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.defendantAccountNumber,
    );
  }

  if (associatedRecordType === associatedRecordTypes.creditorAccounts) {
    return transformMajorCreditorAccountMovementDetails(
      item,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.suspenseTransfer,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.creditorAccountNumber,
    );
  }

  return createHistoryDetails([createHistoryTextPart(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.suspenseTransfer)]);
}
