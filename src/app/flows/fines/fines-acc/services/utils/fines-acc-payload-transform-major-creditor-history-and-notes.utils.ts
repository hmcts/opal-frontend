import {
  createHistoryDetails,
  createHistoryDetailsPart,
  createHistoryFragment,
  createHistoryLabelValuePart,
  createHistoryLink,
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
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS } from '../constants/fines-acc-history-and-notes-details-simple-transaction-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';
import { FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES } from '../constants/fines-acc-major-creditor-history-and-notes-transaction-templates.constant';

const EMPTY_VALUES = FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES;
const FIELD_ALIASES = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
const LABELS = FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS;

/**
 * Transforms a major-creditor financial history item into display-ready Details data.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for a future history-table component.
 */
export function transformMajorCreditorTransactionDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  const transactionTemplates = FINES_ACC_MAJOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES;
  const transactionTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES;
  const transactionType = getHistoryString(
    item,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES,
    [],
    EMPTY_VALUES,
  );
  const bacsPaymentTitle = getTransactionLabel(transactionTemplates.bacsPayment, transactionType);

  // BACS, returned BACS, and reissued BACS all use the same payment-reference layout.
  if (bacsPaymentTitle) {
    return transformMajorCreditorBacsDetails(item, bacsPaymentTitle);
  }

  // A cancelled cheque has its own label and does not use the issued-cheque status rule.
  if (transactionType === transactionTypes.cancelledCheque) {
    return createHistoryDetails([
      createHistoryTextPart(LABELS.chequeCancelled),
      createHistoryLabelValuePart(
        LABELS.chequeNumber,
        getHistoryString(item, FIELD_ALIASES.paymentReference, [], EMPTY_VALUES),
      ),
    ]);
  }

  // Issued and reissued cheques share the same cheque-number and status-date rule.
  if (transactionType === transactionTypes.cheque || transactionType === transactionTypes.reissuedCheque) {
    return transformMajorCreditorChequeDetails(
      item,
      transactionType === transactionTypes.cheque ? LABELS.chequeIssued : LABELS.chequeReissued,
    );
  }

  const defendantAccountTitle = getTransactionLabel(transactionTemplates.defendantAccount, transactionType);

  // Manual adjustments, payments, and repayments all append the same optional defendant account number.
  if (defendantAccountTitle) {
    return transformMajorCreditorLinkedAccountMovementDetails(
      item,
      defendantAccountTitle,
      FIELD_ALIASES.defendantAccountNumber,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account,
      FIELD_ALIASES.defendantAccountId,
    );
  }

  // Repayments from suspense use the associated suspense transaction, not a defendant account number.
  if (transactionType === transactionTypes.repaymentFromSuspense) {
    return transformMajorCreditorLinkedAccountMovementDetails(
      item,
      LABELS.repaymentFromSuspense,
      FIELD_ALIASES.associatedRecordId,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.suspenseTransaction,
      FIELD_ALIASES.associatedRecordId,
    );
  }

  // Suspense transfers choose their second fragment from the documented associated-record type.
  if (transactionType === transactionTypes.suspenseTransfer) {
    return transformMajorCreditorSuspenseTransferDetails(item);
  }

  // Fixed-label allocation transactions do not need any value from the raw details object.
  const simpleTransactionLabel = transactionType
    ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS[
        transactionType as keyof typeof FINES_ACC_HISTORY_AND_NOTES_DETAILS_SIMPLE_TRANSACTION_LABELS
      ]
    : null;

  // Each fixed-label transaction is a single details part.
  if (simpleTransactionLabel) {
    return createHistoryDetails([createHistoryTextPart(simpleTransactionLabel)]);
  }

  // Keep an undocumented transaction code visible instead of guessing a user-facing sentence.
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
  // A missing template is not an error: the caller continues to the next documented rule.
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
  const paymentReferenceAliases = FIELD_ALIASES.paymentReference;
  const paymentReferenceLabel = LABELS.paymentReference;

  return createHistoryDetails([
    createHistoryTextPart(title),
    createHistoryLabelValuePart(
      paymentReferenceLabel,
      getHistoryString(item, paymentReferenceAliases, [], EMPTY_VALUES),
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
  const chequeStatusLabels = FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS;
  const dateFormat = FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT;
  const chequeNumber = getHistoryString(item, FIELD_ALIASES.paymentReference, [], EMPTY_VALUES);
  const status = getHistoryString(item, FIELD_ALIASES.status, [], EMPTY_VALUES);
  const statusLabel = status ? chequeStatusLabels[status] : null;

  return createHistoryDetails([
    createHistoryTextPart(title),
    createHistoryLabelValuePart(LABELS.chequeNumber, chequeNumber ?? LABELS.notYetWritten),
    // Only cancelled and dishonoured statuses create a third details part.
    statusLabel
      ? createHistoryTextPart(
          `${statusLabel} ${formatHistoryDate(
            getHistoryString(item, FIELD_ALIASES.statusDate, [], EMPTY_VALUES),
            dateFormat,
          )}`,
        )
      : null,
  ]);
}

/**
 * Transforms a movement with an optional linked account or suspense value.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @param title - The ticket-defined movement label.
 * @param valueAliases - The API field containing the optional visible value.
 * @param linkType - The type of record the visible value opens.
 * @param linkEmitAliases - The API field containing the linked record identifier.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorLinkedAccountMovementDetails(
  item: THistoryDetailsRawItem,
  title: string,
  valueAliases: string[],
  linkType: string,
  linkEmitAliases: string[],
): IHistoryDetails {
  const visibleValue = getHistoryString(item, valueAliases, [], EMPTY_VALUES);
  const linkEmit = getHistoryString(item, linkEmitAliases, [], EMPTY_VALUES);

  return createHistoryDetails([
    createHistoryTextPart(title),
    createMajorCreditorLinkedTextPart(visibleValue, linkType, linkEmit),
  ]);
}

/**
 * Creates a text part with link metadata when the API supplies a target record ID.
 *
 * @param text - The optional value displayed in the history item.
 * @param linkType - The type of record the value opens.
 * @param linkEmit - The optional linked record identifier.
 * @returns A visible part with a link when possible, or null when there is no text to display.
 */
function createMajorCreditorLinkedTextPart(text: string | null, linkType: string, linkEmit: string | null) {
  return text
    ? createHistoryDetailsPart([
        createHistoryFragment(text, {
          link: linkEmit ? createHistoryLink(linkType, linkEmit) : null,
        }),
      ])
    : null;
}

/**
 * Transforms a suspense transfer using the documented associated-record type to choose its optional value.
 *
 * @param item - The raw major-creditor history item returned by the API.
 * @returns The fragment-based details model for a future history-table component.
 */
function transformMajorCreditorSuspenseTransferDetails(item: THistoryDetailsRawItem): IHistoryDetails {
  const associatedRecordTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_ASSOCIATED_RECORD_TYPES;
  const suspenseTransferLabel = LABELS.suspenseTransfer;
  const associatedRecordType = getHistoryString(item, FIELD_ALIASES.associatedRecordType, [], EMPTY_VALUES);

  // A suspense item uses the linked suspense transaction identifier.
  if (associatedRecordType === associatedRecordTypes.suspenseItem) {
    return transformMajorCreditorLinkedAccountMovementDetails(
      item,
      suspenseTransferLabel,
      FIELD_ALIASES.associatedRecordId,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.suspenseTransaction,
      FIELD_ALIASES.associatedRecordId,
    );
  }

  // A defendant transaction uses the defendant account number.
  if (associatedRecordType === associatedRecordTypes.defendantTransaction) {
    return transformMajorCreditorLinkedAccountMovementDetails(
      item,
      suspenseTransferLabel,
      FIELD_ALIASES.defendantAccountNumber,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account,
      FIELD_ALIASES.defendantAccountId,
    );
  }

  // A creditor account uses the creditor account number.
  if (associatedRecordType === associatedRecordTypes.creditorAccounts) {
    return transformMajorCreditorLinkedAccountMovementDetails(
      item,
      suspenseTransferLabel,
      FIELD_ALIASES.creditorAccountNumber,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account,
      FIELD_ALIASES.associatedRecordId,
    );
  }

  // No documented record type matched, so retain the readable XFER heading without inventing a second value.
  return createHistoryDetails([createHistoryTextPart(suspenseTransferLabel)]);
}
