import {
  HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
  HISTORY_DETAILS_DEFAULT_DATE_FORMAT,
  HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  createHistoryDetails,
  createHistoryDetailsPart,
  createHistoryFragment,
  createHistoryLink,
  createHistoryTextPart,
  formatHistoryDate,
  formatHistoryMoney,
  getHistoryString,
  getHistoryValue,
  isHistoryPresentString,
  normaliseHistoryKey,
  normaliseHistoryTransactionType,
  toHistorySnakeCase,
  IHistoryDetails as IFinesAccHistoryAndNotesDetails,
  IHistoryDetailsFragment as IFinesAccHistoryAndNotesDetailsFragment,
  IHistoryDetailsLink as IFinesAccHistoryAndNotesDetailsLink,
  IHistoryDetailsPart as IFinesAccHistoryAndNotesDetailsPart,
  IHistoryFragmentOptions as IFinesAccHistoryAndNotesFragmentOptions,
  THistoryDetailsRawItem as TFinesAccHistoryAndNotesRawItem,
  THistoryDetailsTransformerConfig as TFinesAccHistoryAndNotesDetailsTransformerConfig,
  transformHistoryDetails,
} from '@hmcts/opal-frontend-common/services/history-transformation-service';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS } from '../constants/fines-acc-history-and-notes-details-cheque-status-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX } from '../constants/fines-acc-history-and-notes-details-currency-prefix.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DEFENDANT_ACCOUNT_RECORD_TYPE } from '../constants/fines-acc-history-and-notes-details-defendant-account-record-type.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES } from '../constants/fines-acc-history-and-notes-details-fallback-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-history-and-notes-details-field-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-history-item-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS } from '../constants/fines-acc-history-and-notes-details-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_PERIOD_LABELS } from '../constants/fines-acc-history-and-notes-details-payment-terms-period-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES } from '../constants/fines-acc-history-and-notes-details-payment-terms-type-codes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_XFER_REASON_LABELS } from '../constants/fines-acc-history-and-notes-details-xfer-reason-labels.constant';

/**
 * Transforms a raw history item into the structured details model.
 *
 * @param item - The raw history item returned by the API.
 * @param config - The history item type to transformer function map.
 * @returns The structured details model.
 */
export function transformHistoryAndNotesDetails(
  item: TFinesAccHistoryAndNotesRawItem,
  config: TFinesAccHistoryAndNotesDetailsTransformerConfig,
): IFinesAccHistoryAndNotesDetails {
  return transformHistoryDetails(item, {
    aliasPathPrefixes: HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
    dateFormat: HISTORY_DETAILS_DEFAULT_DATE_FORMAT,
    emptyValues: HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
    fallbackAliases: FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES,
    historyItemTypeAliases: FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES,
    transformers: config,
  });
}

/**
 * Transforms amendment history details into changed-field parts.
 *
 * @param item - The raw amendment history item.
 * @returns The structured amendment details.
 */
export function transformAmendmentDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const labels = FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS;

  return createDetails([
    boldTextPart(getString(item, aliases.attributeName)),
    labelBoldValuePart(labels.old, getString(item, aliases.oldValue)),
    labelBoldValuePart(labels.new, getString(item, aliases.newValue)),
  ]);
}

/**
 * Transforms enforcement history details into action and hearing parts.
 *
 * @param item - The raw enforcement history item.
 * @returns The structured enforcement details.
 */
export function transformEnforcementDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;

  return createDetails(
    [
      textPart(getString(item, aliases.enforcementAction)),
      daysInDefaultPart(getString(item, aliases.daysInDefault)),
      labelValuePart(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.warrantNumber, getString(item, aliases.warrantNumber)),
      labelValuePart(
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS.earliestDateOfRelease,
        formatDate(getString(item, aliases.earliestDateOfRelease)),
      ),
      hearingPart(
        formatDate(getString(item, aliases.hearingDate)),
        getString(item, aliases.hearingCourt),
        getString(item, aliases.caseReference),
      ),
    ],
    [textPart(getString(item, aliases.enforcementReason))],
  );
}

/**
 * Transforms note history details into a single text part.
 *
 * @param item - The raw note history item.
 * @returns The structured note details.
 */
export function transformNoteDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  return createDetails([textPart(getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.noteText))]);
}

/**
 * Transforms payment terms history details into payment schedule parts.
 *
 * @param item - The raw payment terms history item.
 * @returns The structured payment terms details.
 */
export function transformPaymentTermsDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const effectiveDate = formatDate(getString(item, aliases.effectiveDate));

  return createDetails(
    [
      ...paymentTermsTypeParts(getString(item, aliases.termsType), effectiveDate),
      labelValuePart(labels().lumpSum, formatMoney(getValue(item, aliases.instalmentLumpSum))),
      instalmentsPart(
        formatMoney(getValue(item, aliases.instalmentAmount)),
        getInstalmentPeriodLabel(getString(item, aliases.instalmentPeriod)),
        effectiveDate,
      ),
      daysInDefaultPart(getString(item, aliases.daysInDefault)),
    ],
    [textPart(getString(item, aliases.reasonForExtension))],
  );
}

/**
 * Transforms transaction history details by transaction code.
 *
 * @param item - The raw transaction history item.
 * @returns The structured transaction details.
 */
export function transformTransactionDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const transactionType = normaliseTransactionType(
    getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES),
  );
  const transactionTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES;
  const linkTypes = FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES;

  switch (transactionType) {
    case transactionTypes.cancelledCheque:
      return createDetails([textPart(labels().chequeCancelled), chequeNumberPart(item)]);
    case transactionTypes.cheque:
      return chequeDetails(labels().chequeIssued, item);
    case transactionTypes.consolidation:
      return createDetails([
        textPart(labels().accountConsolidated),
        accountNumberPart(item),
        textPart(labels().amountCreditedToMasterAccount),
      ]);
    case transactionTypes.dishonouredCheque:
      return impositionTransactionDetails(labels().chequeDishonoured, item);
    case transactionTypes.transferFromSuspense:
      return associatedRecordTransactionDetails(labels().transferFromSuspense, item, linkTypes.suspenseTransaction);
    case transactionTypes.manualAdjustment:
      return associatedRecordTransactionDetails(labels().manualAdjustment, item, linkTypes.suspenseTransaction);
    case transactionTypes.payment:
      return paymentTransactionDetails(item);
    case transactionTypes.repaymentFromSuspense:
      return associatedRecordTransactionDetails(labels().repaymentFromSuspense, item, linkTypes.suspenseTransaction);
    case transactionTypes.reversedPayment:
      return impositionTransactionDetails(labels().paymentReversed, item);
    case transactionTypes.reissuedCheque:
      return chequeDetails(labels().chequeReissued, item);
    case transactionTypes.reversedWriteOff:
      return createDetails([textPart(labels().writeOffReversed)], [additionalInformationPart(item)]);
    case transactionTypes.tfoOut:
      return createDetails([
        textPart(labels().tfoOut),
        labelValuePart(labels().transferredTo, additionalInformation(item)),
      ]);
    case transactionTypes.tfoIn:
      return createDetails([textPart(labels().tfoIn), labelValuePart(labels().receivedFrom, originatorName(item))]);
    case transactionTypes.writeOff:
      return writeOffTransactionDetails(item);
    case transactionTypes.suspenseTransfer:
      return createDetails([textPart(labels().suspenseTransfer), textPart(xferReason(item))]);
    default:
      return transformFallbackDetails(item);
  }
}

/**
 * Returns the labels constant with a short local alias for long helper expressions.
 *
 * @returns The details label constants.
 */
function labels(): typeof FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS {
  return FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS;
}

/**
 * Creates fallback details when a configured transformer is not available.
 *
 * @param item - The raw history item.
 * @returns The fallback structured details.
 */
function transformFallbackDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  return createDetails([
    textPart(
      getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES) ??
        getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES),
    ),
  ]);
}

/**
 * Builds cheque transaction details including status when present.
 *
 * @param title - The transaction display title.
 * @param item - The raw transaction history item.
 * @returns The structured cheque details.
 */
function chequeDetails(title: string, item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const status = getChequeStatus(item);
  const statusDate = formatDate(getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.statusDate));

  return createDetails([
    textPart(title),
    chequeNumberPart(item),
    status ? textPart([status, statusDate].filter(Boolean).join(' ')) : null,
  ]);
}

/**
 * Builds payment transaction details.
 *
 * @param item - The raw payment transaction item.
 * @returns The structured payment details.
 */
function paymentTransactionDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;

  return createDetails([
    textPart(labels().paymentReceived),
    textPart(getString(item, aliases.paymentMethod)),
    additionalInformationPart(item),
    textPart(getString(item, aliases.paymentReferenceOnly)),
  ]);
}

/**
 * Builds transaction details with a linked associated record.
 *
 * @param title - The transaction display title.
 * @param item - The raw transaction item.
 * @param linkType - The link type emitted for the associated record.
 * @returns The structured associated-record details.
 */
function associatedRecordTransactionDetails(
  title: string,
  item: TFinesAccHistoryAndNotesRawItem,
  linkType: string,
): IFinesAccHistoryAndNotesDetails {
  return createDetails([textPart(title), associatedRecordPart(item, linkType)]);
}

/**
 * Builds transaction details that include imposition context.
 *
 * @param title - The transaction display title.
 * @param item - The raw transaction item.
 * @returns The structured imposition transaction details.
 */
function impositionTransactionDetails(
  title: string,
  item: TFinesAccHistoryAndNotesRawItem,
): IFinesAccHistoryAndNotesDetails {
  return createDetails([
    textPart(title),
    impositionPart(item),
    associatedRecordPart(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.imposition),
  ]);
}

/**
 * Builds write-off transaction details based on the associated record type.
 *
 * @param item - The raw write-off transaction item.
 * @returns The structured write-off details.
 */
function writeOffTransactionDetails(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetails {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const associatedRecordType = getString(item, aliases.associatedRecordType);
  const parts: Array<IFinesAccHistoryAndNotesDetailsPart | null> = [textPart(labels().writeOff)];

  if (normaliseKey(associatedRecordType) === FINES_ACC_HISTORY_AND_NOTES_DETAILS_DEFENDANT_ACCOUNT_RECORD_TYPE) {
    parts.push(consolidatedAccountPart(item));
  } else {
    parts.push(
      impositionPart(item),
      associatedRecordPart(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.imposition),
    );
  }

  parts.push(textPart(getString(item, aliases.writeOffDescription)));

  return createDetails(parts, [additionalInformationPart(item)]);
}

/**
 * Builds payment terms parts for the payment terms type code.
 *
 * @param termsType - The payment terms type code.
 * @param effectiveDate - The formatted effective date.
 * @returns The payment terms type parts.
 */
function paymentTermsTypeParts(
  termsType: string | null,
  effectiveDate: string | null,
): Array<IFinesAccHistoryAndNotesDetailsPart | null> {
  switch (termsType) {
    case FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES.inFull:
      return [textPart(labels().inFull), labelValuePart(labels().dueBy, effectiveDate)];
    case FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES.paid:
      return [labelValuePart(labels().paid, effectiveDate)];
    default:
      return [];
  }
}

/**
 * Builds the instalments part when any instalment value is available.
 *
 * @param instalmentAmount - The formatted instalment amount.
 * @param instalmentPeriod - The instalment period display label.
 * @param effectiveDate - The formatted effective date.
 * @returns The instalments part or null.
 */
function instalmentsPart(
  instalmentAmount: string | null,
  instalmentPeriod: string | null,
  effectiveDate: string | null,
): IFinesAccHistoryAndNotesDetailsPart | null {
  if (!instalmentAmount && !instalmentPeriod) {
    return null;
  }

  const instalmentValues = [instalmentAmount, instalmentPeriod, effectiveDate].filter(isPresentString);

  return instalmentValues.length
    ? part([fragment(labels().instalments), ...instalmentValues.map((text) => fragment(text))])
    : null;
}

/**
 * Builds the hearing part with hyphen-prefixed fragments.
 *
 * @param hearingDate - The formatted hearing date.
 * @param hearingCourt - The hearing court name.
 * @param caseNumber - The case reference.
 * @returns The hearing part or null.
 */
function hearingPart(
  hearingDate: string | null,
  hearingCourt: string | null,
  caseNumber: string | null,
): IFinesAccHistoryAndNotesDetailsPart | null {
  if (!hearingDate && !hearingCourt && !caseNumber) {
    return null;
  }

  const fragments: IFinesAccHistoryAndNotesDetailsFragment[] = [
    fragment(labels().hearing),
    ...(hearingDate ? [fragment(hearingDate, { hyphen: true })] : []),
    ...(hearingCourt ? [fragment(hearingCourt, { hyphen: true })] : []),
    ...(caseNumber ? [fragment(labels().case), fragment(caseNumber)] : []),
  ];

  return part(fragments);
}

/**
 * Builds the days-in-default part.
 *
 * @param daysInDefault - The days in default value.
 * @returns The days-in-default part or null.
 */
function daysInDefaultPart(daysInDefault: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return daysInDefault ? textPart(`${daysInDefault} ${labels().daysInDefault}`) : null;
}

/**
 * Builds the cheque number part with fallback text.
 *
 * @param item - The raw transaction item.
 * @returns The cheque number part.
 */
function chequeNumberPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  return labelValuePart(
    labels().chequeNumber,
    getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.paymentReference) ?? labels().notYetWritten,
  );
}

/**
 * Builds a linked account number part.
 *
 * @param item - The raw transaction item.
 * @returns The account number part or null.
 */
function accountNumberPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const accountNumber = getString(item, aliases.accountNumber);
  const emit = getString(item, aliases.relatedAccountId);

  return accountNumber
    ? part([
        fragment(accountNumber, {
          link: createLink(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account, emit ?? accountNumber),
        }),
      ])
    : null;
}

/**
 * Builds a linked consolidated-account part.
 *
 * @param item - The raw transaction item.
 * @returns The consolidated account part or null.
 */
function consolidatedAccountPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const accountNumber = getString(item, aliases.accountNumber);
  const emit = getString(item, aliases.relatedAccountId);

  return accountNumber
    ? part([
        fragment(labels().consolidated),
        fragment(accountNumber, {
          hyphen: true,
          link: createLink(FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES.account, emit ?? accountNumber),
        }),
      ])
    : null;
}

/**
 * Builds an imposition context part.
 *
 * @param item - The raw transaction item.
 * @returns The imposition part or null.
 */
function impositionPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  const aliases = FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES;
  const impositionCode = getString(item, aliases.impositionCode);
  const imposedAmount = formatMoney(getValue(item, aliases.amountImposed));
  const impositionDate = formatDate(getString(item, aliases.impositionDate));

  if (!impositionCode && !imposedAmount && !impositionDate) {
    return null;
  }

  return part([
    ...[impositionCode, imposedAmount].filter(isPresentString).map((text) => fragment(text)),
    ...(impositionDate ? [fragment(labels().created), fragment(impositionDate)] : []),
  ]);
}

/**
 * Builds a linked associated record part.
 *
 * @param item - The raw transaction item.
 * @param linkType - The link type emitted for the associated record.
 * @returns The associated record part or null.
 */
function associatedRecordPart(
  item: TFinesAccHistoryAndNotesRawItem,
  linkType: string,
): IFinesAccHistoryAndNotesDetailsPart | null {
  const associatedRecordId = getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordId);

  return associatedRecordId
    ? part([fragment(associatedRecordId, { link: createLink(linkType, associatedRecordId) })])
    : null;
}

/**
 * Builds a label and value part with no styling.
 *
 * @param label - The label text.
 * @param value - The value text.
 * @returns The label-value part or null.
 */
function labelValuePart(label: string, value: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return value ? part([fragment(label), fragment(value)]) : null;
}

/**
 * Builds an amendment label and bold value part.
 *
 * @param label - The label text.
 * @param value - The value text.
 * @returns The label-value part or null.
 */
function labelBoldValuePart(label: string, value: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return value ? part([fragment(label), fragment(value, { bold: true })]) : null;
}

/**
 * Builds an additional information text part.
 *
 * @param item - The raw transaction item.
 * @returns The additional information part or null.
 */
function additionalInformationPart(item: TFinesAccHistoryAndNotesRawItem): IFinesAccHistoryAndNotesDetailsPart | null {
  return textPart(additionalInformation(item));
}

/**
 * Reads additional information text from the raw item.
 *
 * @param item - The raw transaction item.
 * @returns The additional information text or null.
 */
function additionalInformation(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.additionalInformation);
}

/**
 * Reads the originator name from the raw item.
 *
 * @param item - The raw transaction item.
 * @returns The originator name or null.
 */
function originatorName(item: TFinesAccHistoryAndNotesRawItem): string | null {
  return getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.originatorName);
}

/**
 * Resolves the XFER reason label.
 *
 * @param item - The raw transaction item.
 * @returns The XFER reason text or null.
 */
function xferReason(item: TFinesAccHistoryAndNotesRawItem): string | null {
  const associatedRecordType = getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.associatedRecordType);
  const normalisedAssociatedRecordType = associatedRecordType ? toSnakeCase(associatedRecordType) : null;

  return associatedRecordType
    ? (FINES_ACC_HISTORY_AND_NOTES_DETAILS_XFER_REASON_LABELS[associatedRecordType] ??
        (normalisedAssociatedRecordType
          ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_XFER_REASON_LABELS[normalisedAssociatedRecordType]
          : null) ??
        additionalInformation(item))
    : additionalInformation(item);
}

/**
 * Resolves the cheque status display label.
 *
 * @param item - The raw transaction item.
 * @returns The cheque status label or null.
 */
function getChequeStatus(item: TFinesAccHistoryAndNotesRawItem): string | null {
  const status = getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES.status);
  return status ? (FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS[status] ?? null) : null;
}

/**
 * Resolves the instalment period display label.
 *
 * @param period - The raw instalment period code.
 * @returns The mapped period label, original period, or null.
 */
function getInstalmentPeriodLabel(period: string | null): string | null {
  return period ? (FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_PERIOD_LABELS[period] ?? period) : null;
}

/**
 * Creates a details object with empty secondary lines normalised to null.
 *
 * @param line1Parts - The primary line parts.
 * @param line2Parts - The secondary line parts.
 * @returns The details object.
 */
function createDetails(
  line1Parts: Array<IFinesAccHistoryAndNotesDetailsPart | null>,
  line2Parts: Array<IFinesAccHistoryAndNotesDetailsPart | null> = [],
): IFinesAccHistoryAndNotesDetails {
  return createHistoryDetails(line1Parts, line2Parts);
}

/**
 * Creates a text-only part.
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
  return text ? part([fragment(text, { bold: true })]) : null;
}

/**
 * Creates a part after removing empty fragments.
 *
 * @param fragments - The fragments for the part.
 * @returns The part or null.
 */
function part(fragments: IFinesAccHistoryAndNotesDetailsFragment[]): IFinesAccHistoryAndNotesDetailsPart | null {
  return createHistoryDetailsPart(fragments);
}

/**
 * Creates a details fragment with default styling flags.
 *
 * @param text - The fragment text.
 * @param options - Optional fragment styling and link data.
 * @returns The details fragment.
 */
function fragment(
  text: string,
  options: IFinesAccHistoryAndNotesFragmentOptions = {},
): IFinesAccHistoryAndNotesDetailsFragment {
  return createHistoryFragment(text, options);
}

/**
 * Creates link metadata for a fragment.
 *
 * @param type - The link type emitted by the UI.
 * @param emit - The emitted linked entity identifier.
 * @returns The fragment link metadata.
 */
function createLink(type: string, emit: string): IFinesAccHistoryAndNotesDetailsLink {
  return createHistoryLink(type, emit);
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
    HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
    HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  );
}

/**
 * Reads the first non-empty value from candidate aliases.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @returns The first matching value or null.
 */
function getValue(item: TFinesAccHistoryAndNotesRawItem, aliases: string[]): unknown {
  return getHistoryValue(
    item,
    aliases,
    HISTORY_DETAILS_DEFAULT_ALIAS_PATH_PREFIXES,
    HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  );
}

/**
 * Checks whether a value is a non-empty string.
 *
 * @param value - The value to check.
 * @returns True when the value is a non-empty string.
 */
function isPresentString(value: string | null): value is string {
  return isHistoryPresentString(value);
}

/**
 * Normalises a history item type key for transformer lookup.
 *
 * @param value - The raw key value.
 * @returns The normalised key or null.
 */
function normaliseKey(value: string | null): string | null {
  return normaliseHistoryKey(value);
}

/**
 * Normalises a transaction type code for switch matching.
 *
 * @param value - The raw transaction type.
 * @returns The normalised transaction type or null.
 */
function normaliseTransactionType(value: string | null): string | null {
  return normaliseHistoryTransactionType(value);
}

/**
 * Converts a camel, space, or hyphen value to snake case.
 *
 * @param value - The raw value.
 * @returns The snake case value.
 */
function toSnakeCase(value: string): string {
  return toHistorySnakeCase(value);
}

/**
 * Formats ISO dates as DD/MM/YYYY while leaving unknown formats unchanged.
 *
 * @param value - The raw date value.
 * @returns The formatted date or null.
 */
function formatDate(value: string | null): string | null {
  return formatHistoryDate(value, HISTORY_DETAILS_DEFAULT_DATE_FORMAT);
}

/**
 * Formats numeric values as currency while preserving preformatted text.
 *
 * @param value - The raw money value.
 * @returns The formatted money text or null.
 */
function formatMoney(value: unknown): string | null {
  return formatHistoryMoney(
    value,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX,
    HISTORY_DETAILS_DEFAULT_EMPTY_VALUES,
  );
}
