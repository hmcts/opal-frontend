import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS } from '../constants/fines-reports-report-summary-criteria-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryNamedValue } from '../types/fines-reports-report-summary-named-value.type';
import {
  getCriteriaDateDisplayValue,
  isUnusedOptionalValue,
  mapCurrencyValue,
  mapDisplayText,
} from './fines-reports-report-summary-display-value.utils';

/**
 * Groups the account-type flags returned by the API into the labels displayed on one summary row.
 */
const ACCOUNT_TYPE_PARAMETER_LABELS: Record<string, string> = {
  includeAdult: 'Adult',
  includeYouth: 'Youth',
  includeCompany: 'Company',
  onlyAccountsWithParentGuardian: 'Only accounts with parent or guardian to pay',
};

/**
 * Lists date-range pairs in the screen precedence used when an enforcement report supplies a range.
 */
const DATE_RANGE_PARAMETER_CONFIGS = [
  { fromKey: 'enforcementDateFrom', toKey: 'enforcementDateTo' },
  { fromKey: 'lastActionDateFrom', toKey: 'lastActionDateTo' },
  { fromKey: 'regfDateFrom', toKey: 'regfDateTo' },
] as const;

/**
 * Translates enforcement-mode codes into the wording required by the report criteria section.
 */
const REPORT_ENFORCEMENT_MODE_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  LAST_ACTION: 'Last enforcement action',
  REGF: 'Registration of fine (REGF)',
  NOT_UNDER_ENFORCEMENT: 'Accounts not under enforcement',
};

/**
 * Translates account-status codes into the wording required by the report criteria section.
 */
const ACCOUNT_STATUS_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  LIVE: 'Live',
  CLOSED: 'Closed',
};

/**
 * Translates collection-order codes into the wording required by the report criteria section.
 */
const COLLECTION_ORDER_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  WITH: 'With collection order',
  WITHOUT: 'Without collection order',
};

/**
 * Translates payment-report mode codes into the wording required by the report criteria section.
 */
const PAYMENT_REPORT_MODE_DISPLAY: Record<string, string> = {
  SINCE_LAST_ENFORCEMENT: 'Since last enforcement action',
  WITH_REGF: 'With registration of fine (REGF)',
  SINCE_DATE: 'Since date',
};

/**
 * Identifies the criteria whose numeric values the template renders with Angular's GBP currency pipe.
 */
const CURRENCY_ROW_KEYS: readonly string[] = [
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumPaymentAmount,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumPaymentAmount,
];

/**
 * Resolves the display label for the API's supported report-type values.
 */
export const formatReportTypeDisplay = (value: unknown, reportId: string): string => {
  const normalised = typeof value === 'string' ? value.trim().toLowerCase() : '';

  if (normalised === 'summary') {
    return FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary;
  }

  if (normalised === 'detailed' || normalised === 'detail') {
    return FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed;
  }

  return reportId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments
    ? FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed
    : FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary;
};

/**
 * Builds one action-date row from the first populated operational-report date range.
 */
export const buildActionDateRow = (
  reportParameters: Record<string, unknown>,
): FinesReportsReportSummaryNamedValue | null => {
  const dateRangeConfig = DATE_RANGE_PARAMETER_CONFIGS.find(
    (config) =>
      getCriteriaDateDisplayValue(reportParameters[config.fromKey]) ||
      getCriteriaDateDisplayValue(reportParameters[config.toKey]),
  );

  if (!dateRangeConfig) {
    return null;
  }

  const fromDisplay = getCriteriaDateDisplayValue(reportParameters[dateRangeConfig.fromKey]);
  const toDisplay = getCriteriaDateDisplayValue(reportParameters[dateRangeConfig.toKey]);
  const value =
    fromDisplay && toDisplay
      ? `From ${fromDisplay} to ${toDisplay}`
      : fromDisplay
        ? `From ${fromDisplay}`
        : `To ${toDisplay}`;

  return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate, value };
};

/**
 * Maps the selected account-type flags to their one user-facing summary row.
 */
export const buildAccountTypeRow = (
  reportParameters: Record<string, unknown>,
): FinesReportsReportSummaryNamedValue | null => {
  const accountTypes = Object.entries(ACCOUNT_TYPE_PARAMETER_LABELS)
    .filter(([key]) => reportParameters[key] === true)
    .map(([, label]) => label);

  return accountTypes.length > 0
    ? {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountType,
        value: accountTypes.join(', '),
        optional: true,
      }
    : null;
};

/**
 * Combines a last-enforcement mode and result reference into the wording used by the design.
 */
const getEnforcementDisplayValue = (
  value: unknown,
  enforcementAction: IOpalFinesResultRefData | null,
  enforcementActionCode: unknown,
): string => {
  const enforcementMode = typeof value === 'string' ? value : '';

  if (enforcementMode !== 'LAST_ACTION') {
    return REPORT_ENFORCEMENT_MODE_DISPLAY[enforcementMode] ?? enforcementMode;
  }

  if (enforcementAction) {
    return `Last enforcement - ${enforcementAction.result_title} (${enforcementAction.result_id})`;
  }

  return typeof enforcementActionCode === 'string' && enforcementActionCode.trim().length > 0
    ? `Last enforcement action (${enforcementActionCode})`
    : REPORT_ENFORCEMENT_MODE_DISPLAY[enforcementMode];
};

/**
 * Maps a known operational-report parameter to its user-facing summary value.
 */
export const mapOperationalReportParameter = (
  key: string,
  value: unknown,
  enforcementAction: IOpalFinesResultRefData | null,
  enforcementActionCode: unknown,
): FinesReportsReportSummaryNamedValue | null => {
  const stringCode = typeof value === 'string' ? value : '';

  switch (key) {
    case 'reportEnforcementMode':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.enforcement,
        value: getEnforcementDisplayValue(value, enforcementAction, enforcementActionCode),
      };
    case 'accountStatus':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountStatus,
        value: ACCOUNT_STATUS_DISPLAY[stringCode] ?? stringCode,
        optional: true,
      };
    case 'collectionOrderChoice':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.collectionOrder,
        value: COLLECTION_ORDER_DISPLAY[stringCode] ?? stringCode,
        optional: true,
      };
    case 'minBalance':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance, value, optional: true };
    case 'maxBalance':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance, value, optional: true };
    case 'lowerNameRange':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.lowerNameRange, value, optional: true };
    case 'upperNameRange':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.upperNameRange, value, optional: true };
    case 'firstPaymentOrPayByInNext7Days':
      return value === true
        ? { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.firstPaymentOrPayByInNext7Days, value }
        : null;
    case 'isPaymentMade':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentsMade,
        value: value === true ? 'Yes' : value === false ? 'No' : value,
      };
    case 'reportMode':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentReportMode,
        value: PAYMENT_REPORT_MODE_DISPLAY[stringCode] ?? stringCode,
      };
    case 'sinceLastEnforcementAction':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.sinceLastEnforcementAction,
        value,
        optional: true,
      };
    case 'sinceDate':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.sinceDate,
        value: getCriteriaDateDisplayValue(value),
        optional: true,
      };
    default:
      return null;
  }
};

/**
 * Removes unused optional criteria and marks money rows for the template's GBP currency pipe.
 */
export const mapCriteriaRows = (
  values: FinesReportsReportSummaryNamedValue[],
): IFinesReportsReportSummaryViewModel['criteriaRows'] => {
  return values
    .filter((row) => !row.optional || !isUnusedOptionalValue(row.value))
    .map((row) => {
      const isCurrency = CURRENCY_ROW_KEYS.includes(row.name);

      return {
        key: row.name,
        value: isCurrency ? mapCurrencyValue(row.value) : mapDisplayText(row.value),
        ...(isCurrency ? { isCurrency: true } : {}),
      };
    });
};
