import {
  createHistoryDetails,
  createHistoryDetailsPart,
  createHistoryFragment,
  createHistoryTextPart,
  formatHistoryDate,
  getHistoryString,
  IHistoryDetails as IFinesAccHistoryAndNotesDetails,
  IHistoryDetailsPart as IFinesAccHistoryAndNotesDetailsPart,
  normaliseHistoryTransactionType,
  THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES } from '../constants/fines-acc-history-and-notes-details-alias-path-prefixes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT } from '../constants/fines-acc-history-and-notes-details-date-format.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-minor-creditor-history-and-notes-details-field-aliases.constant';

const MINOR_CREDITOR_REPAYMENT_TRANSACTION_TYPES = [
  'REPAYC',
  'REPAYF',
  'REPAYM',
  'REPAYP',
  'REPAYV',
  'REPAYW',
] as const;

const MINOR_CREDITOR_TRANSACTION_STATUS_LABELS: Record<string, string> = {
  D: 'Cheque dishonoured',
  X: 'Cheque cancelled',
};

/**
 * Transforms a minor creditor amendment history item.
 *
 * @param item - The raw minor creditor amendment history item.
 * @returns The structured details model.
 */
export function transformMinorCreditorAmendmentDetails(
  item: TFinesAccHistoryAndNotesRawItem,
): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;

  return createDetails([
    boldTextPart(getString(item, aliases.amendmentField)),
    labelBoldValuePart('Old:', getString(item, aliases.oldValue)),
    labelBoldValuePart('New:', getString(item, aliases.newValue)),
  ]);
}

/**
 * Transforms a minor creditor note history item.
 *
 * @param item - The raw minor creditor note history item.
 * @returns The structured details model.
 */
export function transformMinorCreditorNoteDetails(
  item: TFinesAccHistoryAndNotesRawItem,
): IFinesAccHistoryAndNotesDetails {
  return createDetails([
    textPart(getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.noteText)),
  ]);
}

/**
 * Transforms a minor creditor transaction history item without applying defendant transaction rules.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The structured details model.
 */
export function transformMinorCreditorTransactionDetails(
  item: TFinesAccHistoryAndNotesRawItem,
): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const transactionType = normaliseTransactionType(getString(item, aliases.transactionType));

  switch (transactionType) {
    case 'BACS':
      return createDetails([textPart('BACS payment'), labelValuePart('Payment reference:', paymentReference(item))]);
    case 'CANCHQ':
      return createDetails([textPart('Cheque cancelled'), labelValuePart('Cheque number:', paymentReference(item))]);
    case 'CHEQUE':
      return chequeDetails('Cheque issued', item);
    case 'MADJ':
      return createDetails([textPart('Manual adjustment'), textPart(defendantAccountNumber(item))]);
    case 'PAYMNT':
      return createDetails([textPart('Payment received'), textPart(defendantAccountNumber(item))]);
    case 'REPLIC':
      return createDetails([textPart('Repayment')]);
    case 'REPSUS':
      return createDetails([textPart('Repayment from suspense'), textPart(associatedRecordId(item))]);
    case 'RIBACS':
      return createDetails([
        textPart('BACS payment reissued'),
        labelValuePart('Payment reference:', paymentReference(item)),
      ]);
    case 'RICHEQ':
      return chequeDetails('Cheque reissued', item);
    case 'RTBACS':
      return createDetails([
        textPart('BACS payment cancelled'),
        labelValuePart('Payment reference:', paymentReference(item)),
      ]);
    case 'XFER':
      return createDetails([textPart('Suspense transfer'), textPart(suspenseTransferAssociatedValue(item))]);
    default:
      if (transactionType && isRepaymentTransactionType(transactionType)) {
        return createDetails([textPart('Repayment'), textPart(creditorAccountNumber(item))]);
      }

      return createDetails([
        textPart(getString(item, aliases.transactionDescription) ?? getString(item, aliases.transactionType)),
        labelValuePart('Reference:', paymentReference(item)),
      ]);
  }
}

/**
 * Transforms a generated order or notice history item.
 *
 * @param item - The raw generated order or notice history item.
 * @returns The structured details model.
 */
export function transformMinorCreditorGeneratedOrderAndNoticeDetails(
  item: TFinesAccHistoryAndNotesRawItem,
): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;

  return createDetails([
    textPart(getString(item, aliases.documentDescription) ?? getString(item, aliases.documentType)),
  ]);
}

/**
 * Creates a details object with empty secondary lines normalised to null.
 *
 * @param line1Parts - The primary line parts.
 * @returns The details object.
 */
function createDetails(
  line1Parts: Array<IFinesAccHistoryAndNotesDetailsPart | null>,
): IFinesAccHistoryAndNotesDetails {
  return createHistoryDetails(line1Parts);
}

/**
 * Creates a text-only details part.
 *
 * @param text - The text for the part.
 * @returns The text part or null.
 */
function textPart(text: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return createHistoryTextPart(text);
}

/**
 * Creates a single bold fragment part.
 *
 * @param text - The text for the part.
 * @returns The text part or null.
 */
function boldTextPart(text: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return text ? createHistoryDetailsPart([createHistoryFragment(text, { bold: true })]) : null;
}

/**
 * Builds a label and bold value part.
 *
 * @param label - The label text.
 * @param value - The value text.
 * @returns The label-value part or null.
 */
function labelBoldValuePart(label: string, value: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return value
    ? createHistoryDetailsPart([createHistoryFragment(label), createHistoryFragment(value, { bold: true })])
    : null;
}

/**
 * Builds a label and value part.
 *
 * @param label - The label text.
 * @param value - The value text.
 * @returns The label-value part or null.
 */
function labelValuePart(label: string, value: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return value ? createHistoryDetailsPart([createHistoryFragment(label), createHistoryFragment(value)]) : null;
}

/**
 * Builds cheque details with payment reference fallback and optional status text.
 *
 * @param title - The cheque action label.
 * @param item - The raw minor creditor transaction history item.
 * @returns The structured cheque details.
 */
function chequeDetails(title: string, item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  return createDetails([
    textPart(title),
    labelValuePart('Cheque number:', paymentReference(item) ?? 'Not yet written'),
    chequeStatusPart(item),
  ]);
}

/**
 * Builds the optional cheque status part.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The status part or null.
 */
function chequeStatusPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  const status = getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.status);
  const statusLabel = status ? MINOR_CREDITOR_TRANSACTION_STATUS_LABELS[status] : null;

  if (!statusLabel) {
    return null;
  }

  return textPart(
    [
      statusLabel,
      formatDate(getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.statusDate)),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

/**
 * Gets the associated value to display for a suspense transfer.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The associated display value or null.
 */
function suspenseTransferAssociatedValue(item: TFinesAccHistoryAndNotesRawItem): string | null {
  const associatedRecordType = getString(
    item,
    FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordType,
  );

  switch (associatedRecordType) {
    case 'suspense_item':
      return associatedRecordId(item);
    case 'defendant_transaction':
      return defendantAccountNumber(item);
    case 'creditor_accounts':
      return creditorAccountNumber(item);
    default:
      return associatedRecordId(item) ?? defendantAccountNumber(item) ?? creditorAccountNumber(item);
  }
}

/**
 * Checks whether a transaction type is one of the creditor repayment actions.
 *
 * @param transactionType - The normalised transaction type.
 * @returns True when this is a repayment transaction type.
 */
function isRepaymentTransactionType(transactionType: string): boolean {
  return MINOR_CREDITOR_REPAYMENT_TRANSACTION_TYPES.includes(
    transactionType as (typeof MINOR_CREDITOR_REPAYMENT_TRANSACTION_TYPES)[number],
  );
}

/**
 * Gets the payment reference.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The payment reference or null.
 */
function paymentReference(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference);
}

/**
 * Gets the associated record ID.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The associated record ID or null.
 */
function associatedRecordId(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordId);
}

/**
 * Gets the creditor account number.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The creditor account number or null.
 */
function creditorAccountNumber(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.creditorAccountNumber);
}

/**
 * Gets the defendant account number.
 *
 * @param item - The raw minor creditor transaction history item.
 * @returns The defendant account number or null.
 */
function defendantAccountNumber(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.defendantAccountNumber);
}

/**
 * Normalises a transaction type for switch matching.
 *
 * @param value - The raw transaction type.
 * @returns The normalised transaction type or null.
 */
function normaliseTransactionType(value: string | null): string | null {
  return normaliseHistoryTransactionType(value);
}

/**
 * Formats ISO dates as DD/MM/YYYY while leaving unknown formats unchanged.
 *
 * @param value - The raw date value.
 * @returns The formatted date or null.
 */
function formatDate(value: string | null): string | null {
  return formatHistoryDate(value, FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT);
}

/**
 * Reads a non-empty scalar value as a string.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @returns The string value or null.
 */
function getString(item: TFinesAccHistoryAndNotesRawItem, aliases: string[]): string | null {
  return getHistoryString(
    item,
    aliases,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES,
  );
}
