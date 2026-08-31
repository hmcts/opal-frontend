import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS } from '../constants/fines-reports-report-summary-criteria-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS } from '../constants/fines-reports-report-summary-parameter-keys.constant';
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
  [FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.includeAdult]: 'Adult',
  [FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.includeYouth]: 'Youth',
  [FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.includeCompany]: 'Company',
  [FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.onlyAccountsWithParentGuardian]:
    'Only accounts with parent or guardian to pay',
};

/**
 * Identifies the paired API parameters that form one action-date row.
 */
const DATE_RANGE_PARAMETER_CONFIGS = [
  {
    fromKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementDateFrom,
    toKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.enforcementDateTo,
  },
  {
    fromKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.lastActionDateFrom,
    toKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.lastActionDateTo,
  },
  {
    fromKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.regfDateFrom,
    toKey: FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.regfDateTo,
  },
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
const CURRENCY_ROW_KEYS = new Set<string>([
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumPaymentAmount,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumPaymentAmount,
]);

/**
 * Maps accepted API report-type values to the display labels used by the summary. `detail` is
 * retained as a compatibility alias for existing report instances.
 */
const REPORT_TYPE_DISPLAY_BY_API_VALUE: Record<string, string> = {
  summary: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
  detailed: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
  detail: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
};

/**
 * Resolves the display label for the API's supported report-type values. The route report id is
 * retained as the fallback because it is the authoritative report definition when an older
 * report instance contains an unrecognised reportType value.
 */
export const formatReportTypeDisplay = (value: unknown, reportId: string): string => {
  const normalised = typeof value === 'string' ? value.trim().toLowerCase() : '';

  return (
    REPORT_TYPE_DISPLAY_BY_API_VALUE[normalised] ??
    (reportId === FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments
      ? FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed
      : FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary)
  );
};

/**
 * Builds the one user-facing Action date row for the supplied date parameter. A report exposes
 * each range as two API properties, but the design deliberately presents the pair as one row.
 * The caller invokes this while walking the received properties, so the row takes the position
 * of the first date property in that pair.
 */
export const buildActionDateRow = (
  reportParameters: Record<string, unknown>,
  parameterKey: string,
  dateService: DateService,
): FinesReportsReportSummaryNamedValue | null => {
  const dateRangeConfig = DATE_RANGE_PARAMETER_CONFIGS.find(
    (config) => config.fromKey === parameterKey || config.toKey === parameterKey,
  );

  if (!dateRangeConfig) {
    return null;
  }

  const fromDisplay = getCriteriaDateDisplayValue(reportParameters[dateRangeConfig.fromKey], dateService);
  const toDisplay = getCriteriaDateDisplayValue(reportParameters[dateRangeConfig.toKey], dateService);

  // Empty optional date properties must not create an incomplete "To " row.
  if (!fromDisplay && !toDisplay) {
    return null;
  }

  if (fromDisplay && toDisplay) {
    return {
      name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate,
      value: `From ${fromDisplay} to ${toDisplay}`,
    };
  }

  if (fromDisplay) {
    return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate, value: `From ${fromDisplay}` };
  }

  return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate, value: `To ${toDisplay}` };
};

/**
 * Maps selected account-type flags to their one user-facing summary row. Iterating the received
 * parameters, rather than this label map, retains the order in which the API supplied selections.
 */
export const buildAccountTypeRow = (
  reportParameters: Record<string, unknown>,
): FinesReportsReportSummaryNamedValue | null => {
  const accountTypes = Object.entries(reportParameters)
    .filter(([key, value]) => value === true && isAccountTypeParameter(key))
    .map(([key]) => ACCOUNT_TYPE_PARAMETER_LABELS[key]);

  return accountTypes.length > 0
    ? {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountType,
        value: accountTypes.join(', '),
        optional: true,
      }
    : null;
};

/**
 * Identifies API parameters that contribute to the combined account-type display row.
 */
export const isAccountTypeParameter = (key: string): key is keyof typeof ACCOUNT_TYPE_PARAMETER_LABELS => {
  return Object.hasOwn(ACCOUNT_TYPE_PARAMETER_LABELS, key);
};

/**
 * Combines a last-enforcement mode and result reference into the wording used by the design.
 * LAST_ACTION needs the resolved reference-data title; when that optional lookup is unavailable,
 * the original action code is still shown so the criterion is not silently lost.
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
 * Converts a payment-made boolean to the wording required by the report criteria section.
 */
const getPaymentMadeDisplayValue = (value: unknown): unknown => {
  if (value === true) {
    return 'Yes';
  }

  if (value === false) {
    return 'No';
  }

  return value;
};

/**
 * Maps a known operational-report parameter to its user-facing summary value. The API also
 * contains technical partner values, such as enforcementAction and the individual account-type
 * flags, which are intentionally represented by their combined display rows instead.
 */
export const mapOperationalReportParameter = (
  key: string,
  value: unknown,
  enforcementAction: IOpalFinesResultRefData | null,
  enforcementActionCode: unknown,
  dateService: DateService,
): FinesReportsReportSummaryNamedValue | null => {
  const stringCode = typeof value === 'string' ? value : '';

  switch (key) {
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportEnforcementMode:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.enforcement,
        value: getEnforcementDisplayValue(value, enforcementAction, enforcementActionCode),
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.accountStatus:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountStatus,
        value: ACCOUNT_STATUS_DISPLAY[stringCode] ?? stringCode,
        optional: true,
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.collectionOrderChoice:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.collectionOrder,
        value: COLLECTION_ORDER_DISPLAY[stringCode] ?? stringCode,
        optional: true,
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.minBalance:
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance, value, optional: true };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.maxBalance:
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance, value, optional: true };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.lowerNameRange:
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.lowerNameRange, value, optional: true };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.upperNameRange:
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.upperNameRange, value, optional: true };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.firstPaymentOrPayByInNext7Days:
      return value === true
        ? { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.firstPaymentOrPayByInNext7Days, value }
        : null;
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.isPaymentMade:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentsMade,
        value: getPaymentMadeDisplayValue(value),
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.reportMode:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentReportMode,
        value: PAYMENT_REPORT_MODE_DISPLAY[stringCode] ?? stringCode,
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.sinceLastEnforcementAction:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.sinceLastEnforcementAction,
        value,
        optional: true,
      };
    case FINES_REPORTS_REPORT_SUMMARY_PARAMETER_KEYS.sinceDate:
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.sinceDate,
        value: getCriteriaDateDisplayValue(value, dateService),
        optional: true,
      };
    default:
      return null;
  }
};

/**
 * Removes unused optional criteria and marks money rows for the template's GBP currency pipe.
 * Currency remains a number where possible so the shared template formatting is responsible for
 * its final display, but invalid API values are retained as text rather than rendered as NaN.
 */
export const mapCriteriaRows = (
  values: FinesReportsReportSummaryNamedValue[],
): IFinesReportsReportSummaryViewModel['criteriaRows'] => {
  return values
    .filter((row) => !row.optional || !isUnusedOptionalValue(row.value))
    .map((row) => {
      const isCurrency = CURRENCY_ROW_KEYS.has(row.name);

      return {
        key: row.name,
        value: isCurrency ? mapCurrencyValue(row.value) : mapDisplayText(row.value),
        ...(isCurrency ? { isCurrency: true } : {}),
      };
    });
};
