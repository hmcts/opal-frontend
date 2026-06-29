import {
  createHistoryDetails,
  createHistoryDetailsPart,
  createHistoryFragment,
  createHistoryTextPart,
  getHistoryString,
  IHistoryDetails as IFinesAccHistoryAndNotesDetails,
  IHistoryDetailsPart as IFinesAccHistoryAndNotesDetailsPart,
  THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES } from '../constants/fines-acc-history-and-notes-details-alias-path-prefixes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_MINOR_CREDITOR_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-minor-creditor-history-and-notes-details-field-aliases.constant';

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

  return createDetails([
    textPart(getString(item, aliases.transactionDescription) ?? getString(item, aliases.transactionType)),
    labelValuePart('Reference:', getString(item, aliases.paymentReference)),
    labelValuePart('Account:', getString(item, aliases.accountNumber)),
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
