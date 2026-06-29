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
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES } from '../constants/fines-acc-minor-creditor-history-and-notes-transaction-templates.constant';

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
  const templates = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES;
  const simpleTemplate = getTemplateValue(templates.simple, transactionType);
  const labelledReferenceTemplate = getTemplateValue(templates.labelledReference, transactionType);
  const chequeTemplate = getTemplateValue(templates.cheque, transactionType);
  const defendantAccountTemplate = getTemplateValue(templates.defendantAccount, transactionType);
  const creditorAccountTemplate = getTemplateValue(templates.creditorAccount, transactionType);
  const associatedRecordTemplate = getTemplateValue(templates.associatedRecord, transactionType);
  const associatedValueTemplate = getTemplateValue(templates.associatedValue, transactionType);

  if (simpleTemplate) {
    return createDetails([textPart(simpleTemplate)]);
  }

  if (labelledReferenceTemplate) {
    return createDetails([
      textPart(labelledReferenceTemplate.label),
      labelValuePart(labelledReferenceTemplate.referenceLabel, paymentReference(item)),
    ]);
  }

  if (chequeTemplate) {
    return chequeDetails(chequeTemplate, item);
  }

  if (defendantAccountTemplate) {
    return createDetails([textPart(defendantAccountTemplate), textPart(defendantAccountNumber(item))]);
  }

  if (creditorAccountTemplate) {
    return createDetails([textPart(creditorAccountTemplate), textPart(creditorAccountNumber(item))]);
  }

  if (associatedRecordTemplate) {
    return createDetails([textPart(associatedRecordTemplate), textPart(associatedRecordId(item))]);
  }

  if (associatedValueTemplate) {
    return createDetails([textPart(associatedValueTemplate), textPart(suspenseTransferAssociatedValue(item))]);
  }

  return createDetails([
    textPart(getString(item, aliases.transactionDescription) ?? getString(item, aliases.transactionType)),
    labelValuePart(templates.fallbackReferenceLabel, paymentReference(item)),
  ]);
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
  const templates = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES;

  return createDetails([
    textPart(title),
    labelValuePart(templates.chequeNumberLabel, paymentReference(item) ?? templates.defaultChequeNumber),
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
  const statusLabel = status
    ? FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES.statusLabels[
        status as keyof typeof FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES.statusLabels
      ]
    : null;

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
  const associatedRecordTypes = FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_TRANSACTION_TEMPLATES.associatedRecordTypes;
  const associatedRecordType = getString(
    item,
    FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordType,
  );

  switch (associatedRecordType) {
    case associatedRecordTypes.suspenseItem:
      return associatedRecordId(item);
    case associatedRecordTypes.defendantTransaction:
      return defendantAccountNumber(item);
    case associatedRecordTypes.creditorAccounts:
      return creditorAccountNumber(item);
    default:
      return associatedRecordId(item) ?? defendantAccountNumber(item) ?? creditorAccountNumber(item);
  }
}

/**
 * Gets a template value for a transaction type.
 *
 * @param templates - The template record.
 * @param transactionType - The normalised transaction type or null.
 * @returns The matching template value or null.
 */
function getTemplateValue<T extends Record<string, unknown>>(
  templates: T,
  transactionType: string | null,
): T[keyof T] | null {
  return transactionType && transactionType in templates ? templates[transactionType as keyof T] : null;
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
