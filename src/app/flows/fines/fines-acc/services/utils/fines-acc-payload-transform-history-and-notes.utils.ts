import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { IFinesAccHistoryAndNotesDetails } from './interfaces/fines-acc-history-and-notes-details.interface';
import { IFinesAccHistoryAndNotesDetailsFragment } from './interfaces/fines-acc-history-and-notes-details-fragment.interface';
import { IFinesAccHistoryAndNotesDetailsLink } from './interfaces/fines-acc-history-and-notes-details-link.interface';
import { IFinesAccHistoryAndNotesDetailsPart } from './interfaces/fines-acc-history-and-notes-details-part.interface';
import { IFinesAccHistoryAndNotesFragmentOptions } from './interfaces/fines-acc-history-and-notes-fragment-options.interface';
import { TFinesAccHistoryAndNotesDetailsTransformerConfig } from './types/fines-acc-history-and-notes-details-transformer-config.type';
import { TFinesAccHistoryAndNotesRawItem } from './types/fines-acc-history-and-notes-raw-item.type';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES } from '../constants/fines-acc-history-and-notes-details-alias-path-prefixes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CHEQUE_STATUS_LABELS } from '../constants/fines-acc-history-and-notes-details-cheque-status-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX } from '../constants/fines-acc-history-and-notes-details-currency-prefix.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT } from '../constants/fines-acc-history-and-notes-details-date-format.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_DEFENDANT_ACCOUNT_RECORD_TYPE } from '../constants/fines-acc-history-and-notes-details-defendant-account-record-type.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES } from '../constants/fines-acc-history-and-notes-details-empty-values.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FALLBACK_ALIASES } from '../constants/fines-acc-history-and-notes-details-fallback-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_FIELD_ALIASES } from '../constants/fines-acc-history-and-notes-details-field-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-history-item-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LABELS } from '../constants/fines-acc-history-and-notes-details-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_LINK_TYPES } from '../constants/fines-acc-history-and-notes-details-link-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_PERIOD_LABELS } from '../constants/fines-acc-history-and-notes-details-payment-terms-period-labels.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PAYMENT_TERMS_TYPE_CODES } from '../constants/fines-acc-history-and-notes-details-payment-terms-type-codes.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_PATTERNS } from '../constants/fines-acc-history-and-notes-details-patterns.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPE_ALIASES } from '../constants/fines-acc-history-and-notes-details-transaction-type-aliases.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_TRANSACTION_TYPES } from '../constants/fines-acc-history-and-notes-details-transaction-types.constant';
import { FINES_ACC_HISTORY_AND_NOTES_DETAILS_XFER_REASON_LABELS } from '../constants/fines-acc-history-and-notes-details-xfer-reason-labels.constant';

const FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE = new DateService();

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
  const itemType = normaliseKey(getString(item, FINES_ACC_HISTORY_AND_NOTES_DETAILS_HISTORY_ITEM_TYPE_ALIASES));
  const transformer = itemType ? config[itemType] : null;

  return transformer ? transformer(item) : transformFallbackDetails(item);
}

/**
 * Transforms raw history items by replacing their details value with structured details.
 *
 * @param items - The raw history items returned by the API.
 * @param config - The history item type to transformer function map.
 * @returns The history items with structured details.
 */
export function transformHistoryAndNotesItems<T extends TFinesAccHistoryAndNotesRawItem>(
  items: T[],
  config: TFinesAccHistoryAndNotesDetailsTransformerConfig,
): Array<Omit<T, 'details'> & { details: IFinesAccHistoryAndNotesDetails }> {
  return items.map((item) => ({
    ...item,
    details: transformHistoryAndNotesDetails(item, config),
  }));
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
    textPart(getString(item, aliases.attributeName)),
    labelValuePart(labels.old, getString(item, aliases.oldValue)),
    labelValuePart(labels.new, getString(item, aliases.newValue)),
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
  const instalmentValues = [instalmentAmount, instalmentPeriod, effectiveDate].filter(isPresentString);

  return instalmentValues.length
    ? part([fragment(labels().instalments, { bold: true }), ...instalmentValues.map((text) => fragment(text))])
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
    fragment(labels().hearing, { bold: true }),
    ...(hearingDate ? [fragment(hearingDate, { hyphen: true })] : []),
    ...(hearingCourt ? [fragment(hearingCourt, { hyphen: true })] : []),
    ...(caseNumber ? [fragment(labels().case, { bold: true }), fragment(caseNumber)] : []),
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
    ...(impositionDate ? [fragment(labels().created, { bold: true }), fragment(impositionDate)] : []),
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
 * Builds a bold label and value part.
 *
 * @param label - The bold label text.
 * @param value - The value text.
 * @returns The label-value part or null.
 */
function labelValuePart(label: string, value: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return value ? part([fragment(label, { bold: true }), fragment(value)]) : null;
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
  const line1 = line1Parts.filter(isPresentPart);
  const line2 = line2Parts.filter(isPresentPart);

  return {
    line1,
    line2: line2.length ? line2 : null,
  };
}

/**
 * Creates a text-only part.
 *
 * @param text - The text for the part.
 * @returns The text part or null.
 */
function textPart(text: string | null): IFinesAccHistoryAndNotesDetailsPart | null {
  return text ? part([fragment(text)]) : null;
}

/**
 * Creates a part after removing empty fragments.
 *
 * @param fragments - The fragments for the part.
 * @returns The part or null.
 */
function part(fragments: IFinesAccHistoryAndNotesDetailsFragment[]): IFinesAccHistoryAndNotesDetailsPart | null {
  const visibleFragments = fragments.filter(({ text }) => text.length > 0);
  return visibleFragments.length ? { fragments: visibleFragments } : null;
}

export const createHistoryAndNotesDetailsPart = part;

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
  return {
    text,
    bold: options.bold ?? false,
    hyphen: options.hyphen ?? false,
    ...(options.link ? { link: options.link } : {}),
  };
}

/**
 * Creates link metadata for a fragment.
 *
 * @param type - The link type emitted by the UI.
 * @param emit - The emitted linked entity identifier.
 * @returns The fragment link metadata.
 */
function createLink(type: string, emit: string): IFinesAccHistoryAndNotesDetailsLink {
  return { type, emit };
}

/**
 * Reads a non-empty scalar value as a string.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @returns The string value or null.
 */
function getString(item: TFinesAccHistoryAndNotesRawItem, aliases: string[]): string | null {
  const value = getValue(item, aliases);

  if (isEmptyValue(value) || isRecord(value)) {
    return null;
  }

  return String(value);
}

/**
 * Reads the first non-empty value from candidate aliases.
 *
 * @param item - The raw history item.
 * @param aliases - The candidate field aliases.
 * @returns The first matching value or null.
 */
function getValue(item: TFinesAccHistoryAndNotesRawItem, aliases: string[]): unknown {
  for (const alias of aliases) {
    for (const path of getAliasPaths(alias)) {
      const value = getValueByPath(item, path);
      if (!isEmptyValue(value)) {
        return value;
      }
    }
  }

  return null;
}

/**
 * Expands a field alias to supported root and nested paths.
 *
 * @param alias - The field alias.
 * @returns The candidate paths for the alias.
 */
function getAliasPaths(alias: string): string[] {
  return alias.includes('.')
    ? [alias]
    : FINES_ACC_HISTORY_AND_NOTES_DETAILS_ALIAS_PATH_PREFIXES.map((prefix) => `${prefix}${alias}`);
}

/**
 * Reads a value from an object using a dot-notated path.
 *
 * @param item - The raw history item.
 * @param path - The dot-notated path.
 * @returns The value or undefined.
 */
function getValueByPath(item: TFinesAccHistoryAndNotesRawItem, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (!isRecord(value)) {
      return undefined;
    }

    return value[key];
  }, item);
}

/**
 * Checks whether a value is a non-null record.
 *
 * @param value - The value to check.
 * @returns True when the value is a record.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks whether a value should be treated as empty.
 *
 * @param value - The value to check.
 * @returns True when the value is empty.
 */
function isEmptyValue(value: unknown): boolean {
  return FINES_ACC_HISTORY_AND_NOTES_DETAILS_EMPTY_VALUES.includes(value);
}

/**
 * Checks whether a value is a non-empty string.
 *
 * @param value - The value to check.
 * @returns True when the value is a non-empty string.
 */
function isPresentString(value: string | null): value is string {
  return !!value;
}

/**
 * Checks whether a details part is present.
 *
 * @param value - The details part to check.
 * @returns True when the details part is present.
 */
function isPresentPart(
  value: IFinesAccHistoryAndNotesDetailsPart | null,
): value is IFinesAccHistoryAndNotesDetailsPart {
  return !!value;
}

/**
 * Normalises a history item type key for transformer lookup.
 *
 * @param value - The raw key value.
 * @returns The normalised key or null.
 */
function normaliseKey(value: string | null): string | null {
  return value ? value.replace(FINES_ACC_HISTORY_AND_NOTES_DETAILS_PATTERNS.keyNormalise, '').toLowerCase() : null;
}

/**
 * Normalises a transaction type code for switch matching.
 *
 * @param value - The raw transaction type.
 * @returns The normalised transaction type or null.
 */
function normaliseTransactionType(value: string | null): string | null {
  return value
    ? value.trim().toUpperCase().replace(FINES_ACC_HISTORY_AND_NOTES_DETAILS_PATTERNS.transactionTypeSpace, ' ')
    : null;
}

/**
 * Converts a camel, space, or hyphen value to snake case.
 *
 * @param value - The raw value.
 * @returns The snake case value.
 */
function toSnakeCase(value: string): string {
  return value
    .replace(FINES_ACC_HISTORY_AND_NOTES_DETAILS_PATTERNS.snakeCaseBoundary, '$1_$2')
    .replace(FINES_ACC_HISTORY_AND_NOTES_DETAILS_PATTERNS.snakeCaseSeparator, '_')
    .toLowerCase();
}

/**
 * Formats ISO dates as DD/MM/YYYY while leaving unknown formats unchanged.
 *
 * @param value - The raw date value.
 * @returns The formatted date or null.
 */
function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const parsedFormattedDate = FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.getFromFormat(
    value,
    FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT.input,
  );

  if (FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.isValidDate(parsedFormattedDate)) {
    return FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.getFromFormatToFormat(
      value,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT.input,
      FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT.output,
    );
  }

  const isoDate = FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.getFromIso(value);

  return FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.isValidDate(isoDate)
    ? FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_SERVICE.toFormat(
        isoDate,
        FINES_ACC_HISTORY_AND_NOTES_DETAILS_DATE_FORMAT.output,
      )
    : value;
}

/**
 * Formats numeric values as currency while preserving preformatted text.
 *
 * @param value - The raw money value.
 * @returns The formatted money text or null.
 */
function formatMoney(value: unknown): string | null {
  if (isEmptyValue(value)) {
    return null;
  }

  if (typeof value === 'number') {
    return `${FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX}${value.toFixed(2)}`;
  }

  const text = String(value);
  if (text.startsWith(FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX)) {
    return text;
  }

  const numericValue = Number(text);
  return Number.isFinite(numericValue)
    ? `${FINES_ACC_HISTORY_AND_NOTES_DETAILS_CURRENCY_PREFIX}${numericValue.toFixed(2)}`
    : text;
}
