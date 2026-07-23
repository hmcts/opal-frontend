import { formatDate } from '@angular/common';
import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { type IOpalFinesResultRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-result-ref-data.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS } from '../constants/fines-reports-report-summary-criteria-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS } from '../constants/fines-reports-report-summary-error-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS } from '../constants/fines-reports-report-summary-general-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';
import {
  FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY,
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
  FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY,
} from '../constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { type IFinesReportsReportSummaryDisplayRow } from '../interfaces/fines-reports-report-summary-display-row.interface';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryDisplayRowType } from '../types/fines-reports-report-summary-display-row-type.type';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-normalised-status.type';
import {
  isFinesReportsReportSummaryUnusedOptionalValue,
  mapFinesReportsReportSummaryDisplayValue,
} from './fines-reports-report-summary-display-value.utils';

type ReportSummaryNamedValue = {
  name: string;
  value: boolean | number | string | unknown[] | Record<string, unknown> | null | undefined;
  optional?: boolean;
};

const REPORT_TYPE_ALIASES = {
  summary: 'summary',
  detailed: 'detailed',
  detail: 'detail',
} as const;
const ERROR_PARAMETER_LABEL_OVERRIDES: Record<string, string> = {
  error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  error_description: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  operationId: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.operationId,
  report_generation_error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportGenerationError,
  report_service: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportService,
};
const ACCOUNT_TYPE_PARAMETER_LABELS: Record<string, string> = {
  includeAdult: 'Adult',
  includeYouth: 'Youth',
  includeCompany: 'Company',
  onlyAccountsWithParentGuardian: 'Only accounts with parent or guardian to pay',
};
const DATE_RANGE_PARAMETER_CONFIGS = [
  { fromKey: 'enforcementDateFrom', toKey: 'enforcementDateTo' },
  { fromKey: 'lastActionDateFrom', toKey: 'lastActionDateTo' },
  { fromKey: 'regfDateFrom', toKey: 'regfDateTo' },
] as const;
const REPORT_ENFORCEMENT_MODE_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  LAST_ACTION: 'Last enforcement action',
  REGF: 'Registration of fine (REGF)',
  NOT_UNDER_ENFORCEMENT: 'Accounts not under enforcement',
};
const ACCOUNT_STATUS_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  LIVE: 'Live',
  CLOSED: 'Closed',
};
const COLLECTION_ORDER_DISPLAY: Record<string, string> = {
  ALL: 'All accounts',
  WITH: 'With collection order',
  WITHOUT: 'Without collection order',
};
const PAYMENT_REPORT_MODE_DISPLAY: Record<string, string> = {
  SINCE_LAST_ENFORCEMENT: 'Since last enforcement action',
  WITH_REGF: 'With registration of fine (REGF)',
  SINCE_DATE: 'Since date',
};
const OPERATIONAL_REPORT_COMMON_PARAMETER_KEYS = [
  'accountStatus',
  'collectionOrderChoice',
  'minBalance',
  'maxBalance',
  'firstPaymentOrPayByInNext7Days',
  'lowerNameRange',
  'upperNameRange',
] as const;
const OPERATIONAL_PAYMENT_PARAMETER_KEYS = [
  'isPaymentMade',
  'reportMode',
  'sinceLastEnforcementAction',
  'sinceDate',
] as const;
const REPORT_TYPE_NORMALISATION: Record<string, string> = {
  [REPORT_TYPE_ALIASES.summary]: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
  [REPORT_TYPE_ALIASES.detailed]: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
  [REPORT_TYPE_ALIASES.detail]: FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
};
const DEFAULT_REPORT_TYPES: Record<string, string> = {
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement]:
    FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary,
  [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments]:
    FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.detailed,
};
const REPORT_STATUS_ALIASES = {
  requested: 'requested',
  inProgress: 'in_progress',
  ready: 'ready',
  error: 'error',
} as const;
const REPORT_STATUS_NORMALISATION: Record<string, FinesReportsReportSummaryNormalisedStatus> = {
  [REPORT_STATUS_ALIASES.requested]: FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested,
  [REPORT_STATUS_ALIASES.inProgress]: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress,
  [REPORT_STATUS_ALIASES.ready]: FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready,
  [REPORT_STATUS_ALIASES.error]: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
};
const CURRENCY_ROW_KEYS = new Set<string>([
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumPaymentAmount,
  FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumPaymentAmount,
]);
const RECORD_COUNT_DASH_STATUS_SET = new Set<FinesReportsReportSummaryNormalisedStatus>(
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
);
const NO_CONTENT_RECORD_COUNT = 0;

/**
 * Converts backend status codes into the status keys used by the summary screen.
 */
const normaliseStatus = (status: string): FinesReportsReportSummaryNormalisedStatus => {
  const normalisedStatus = status.trim().toLowerCase().replace(/\s+/g, '_');

  return REPORT_STATUS_NORMALISATION[normalisedStatus] ?? FINES_REPORTS_REPORT_SUMMARY_STATUSES.error;
};

/**
 * Resolves the display label for the report type, falling back to the route's report type when the API omits it.
 */
const formatReportTypeDisplay = (value: unknown, reportTypeId: string): string => {
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase();
    const reportType = REPORT_TYPE_NORMALISATION[normalised];

    if (reportType) {
      return reportType;
    }

    if (value.trim().length > 0) {
      return value.trim();
    }
  }

  return DEFAULT_REPORT_TYPES[reportTypeId] ?? FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES.summary;
};

/**
 * Looks up the friendly label for a report-generation error key.
 */
const getErrorParameterLabel = (key: string): string => {
  return ERROR_PARAMETER_LABEL_OVERRIDES[key] ?? key;
};

/**
 * Keeps API report-parameter values in a predictable shape before display formatting is applied.
 */
const mapReportParameterValue = (value: unknown): ReportSummaryNamedValue['value'] => {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    Array.isArray(value)
  ) {
    return value;
  }

  if (typeof value === 'object') {
    return value as Record<string, unknown>;
  }

  return String(value);
};

/**
 * Formats an ISO date supplied in a report parameter for the summary screen.
 */
const getCriteriaDateDisplayValue = (value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  const date = Date.parse(value);

  return Number.isNaN(date) ? value.trim() : formatDate(date, 'dd MMM yyyy', 'en-GB');
};

/**
 * Builds one action-date row from a real operational report date-range pair.
 */
const buildActionDateRow = (
  reportParameters: Record<string, unknown>,
  fromKey: string,
  toKey: string,
): ReportSummaryNamedValue | null => {
  const fromDisplay = getCriteriaDateDisplayValue(reportParameters[fromKey]);
  const toDisplay = getCriteriaDateDisplayValue(reportParameters[toKey]);
  const value =
    fromDisplay && toDisplay
      ? `From ${fromDisplay} to ${toDisplay}`
      : fromDisplay
        ? `From ${fromDisplay}`
        : `To ${toDisplay}`;

  if (!fromDisplay && !toDisplay) {
    return null;
  }

  return {
    name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate,
    value,
    optional: false,
  };
};

/**
 * Maps the selected account-type flags to their one user-facing summary row.
 */
const buildAccountTypeRow = (reportParameters: Record<string, unknown>): ReportSummaryNamedValue | null => {
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
 * Maps a real operational-report parameter to its user-facing summary row.
 */
const mapOperationalReportParameter = (
  key: string,
  value: unknown,
  enforcementAction: IOpalFinesResultRefData | null,
  enforcementActionCode: unknown,
): ReportSummaryNamedValue | null => {
  const stringValue = typeof value === 'string' ? value : '';
  const displayValue = mapReportParameterValue(value);

  switch (key) {
    case 'reportEnforcementMode':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.enforcement,
        value: getEnforcementDisplayValue(value, enforcementAction, enforcementActionCode),
      };
    case 'enforcementAction':
      return null;
    case 'accountStatus':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountStatus,
        value: ACCOUNT_STATUS_DISPLAY[stringValue] ?? stringValue,
        optional: true,
      };
    case 'collectionOrderChoice':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.collectionOrder,
        value: COLLECTION_ORDER_DISPLAY[stringValue] ?? stringValue,
        optional: true,
      };
    case 'minBalance':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance,
        value: displayValue,
        optional: true,
      };
    case 'maxBalance':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance,
        value: displayValue,
        optional: true,
      };
    case 'lowerNameRange':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.lowerNameRange, value: displayValue, optional: true };
    case 'upperNameRange':
      return { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.upperNameRange, value: displayValue, optional: true };
    case 'firstPaymentOrPayByInNext7Days':
      return value === true
        ? { name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.firstPaymentOrPayByInNext7Days, value }
        : null;
    case 'isPaymentMade':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentsMade,
        value: value === true ? 'Yes' : value === false ? 'No' : displayValue,
      };
    case 'reportMode':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentReportMode,
        value: PAYMENT_REPORT_MODE_DISPLAY[stringValue] ?? stringValue,
      };
    case 'sinceLastEnforcementAction':
      return {
        name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.sinceLastEnforcementAction,
        value: displayValue,
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
 * Adds the known criteria rows that have values in the report instance.
 */
const appendOperationalReportParameterRows = (
  rows: ReportSummaryNamedValue[],
  reportParameters: Record<string, unknown>,
  parameterKeys: readonly string[],
  enforcementAction: IOpalFinesResultRefData | null,
): void => {
  for (const key of parameterKeys) {
    const row = mapOperationalReportParameter(
      key,
      reportParameters[key],
      enforcementAction,
      reportParameters['enforcementAction'],
    );
    if (row) {
      rows.push(row);
    }
  }
};

/**
 * Builds operational-report criteria in the fixed order shown in the report-summary design.
 */
const buildCriteriaRows = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportType: string,
  enforcementAction: IOpalFinesResultRefData | null,
): ReportSummaryNamedValue[] => {
  const parameters = reportParameters ?? {};
  const rows: ReportSummaryNamedValue[] = [
    {
      name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType,
      value: reportType,
      optional: false,
    },
  ];
  const reportEnforcementMode = parameters['reportEnforcementMode'];
  const enforcementModeRow =
    typeof reportEnforcementMode === 'string' && reportEnforcementMode.trim().length > 0
      ? mapOperationalReportParameter(
          'reportEnforcementMode',
          reportEnforcementMode,
          enforcementAction,
          parameters['enforcementAction'],
        )
      : null;

  if (enforcementModeRow) {
    rows.push(enforcementModeRow);
    const dateRangeConfig = DATE_RANGE_PARAMETER_CONFIGS.find(
      (config) =>
        getCriteriaDateDisplayValue(parameters[config.fromKey]) ||
        getCriteriaDateDisplayValue(parameters[config.toKey]),
    );
    if (dateRangeConfig) {
      const dateRangeRow = buildActionDateRow(parameters, dateRangeConfig.fromKey, dateRangeConfig.toKey);
      if (dateRangeRow) {
        rows.push(dateRangeRow);
      }
    }
  } else {
    appendOperationalReportParameterRows(rows, parameters, OPERATIONAL_PAYMENT_PARAMETER_KEYS, enforcementAction);
  }

  const accountTypeRow = buildAccountTypeRow(parameters);
  if (accountTypeRow) {
    rows.push(accountTypeRow);
  }

  appendOperationalReportParameterRows(rows, parameters, OPERATIONAL_REPORT_COMMON_PARAMETER_KEYS, enforcementAction);

  return rows;
};

/**
 * Gets the reference shown in the page heading, using the report id when the API name is blank.
 */
const getReportReference = (reportInstance: IOpalFinesReportInstanceDetail): string => {
  return reportInstance.name?.trim() || reportInstance.report.id;
};

/**
 * Reads the report type parameter from the API's supported key variants.
 */
const getReportTypeParameterValue = (reportParameters: Record<string, unknown> | null | undefined): unknown => {
  return reportParameters?.['reportType'] ?? reportParameters?.['report_type'] ?? reportParameters?.['report type'];
};

/**
 * Gets the requester display name, falling back to their user id when no name is available.
 */
const getCreatedBy = (reportInstance: IOpalFinesReportInstanceDetail): string => {
  return reportInstance.requested_by.name?.trim() || reportInstance.requested_by.user_id?.toString().trim() || '';
};

/**
 * Gets displayable business unit names from the API response.
 */
const getBusinessUnits = (reportInstance: IOpalFinesReportInstanceDetail): string[] => {
  return reportInstance.business_units
    .map((businessUnit) => businessUnit.business_unit_name?.trim() || businessUnit.business_unit_id.trim())
    .filter((businessUnit) => businessUnit.length > 0);
};

/**
 * Gets the status text shown to the user, including the ready-with-zero-records "No content" case.
 */
const getStatusDisplay = (
  normalisedStatus: FinesReportsReportSummaryNormalisedStatus,
  recordCount: number | null,
): string => {
  if (normalisedStatus === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready && recordCount === NO_CONTENT_RECORD_COUNT) {
    return FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY;
  }

  return FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[normalisedStatus];
};

/**
 * Hides the record count for statuses where a count is not meaningful yet.
 */
const getNumberOfRecordsDisplayValue = (
  status: FinesReportsReportSummaryNormalisedStatus,
  numberOfRecords: number | null,
): number | null => {
  if (RECORD_COUNT_DASH_STATUS_SET.has(status)) {
    return null;
  }

  return numberOfRecords;
};

/**
 * Converts an API ISO date-time into the numeric value used by Angular's DatePipe.
 */
const getDateTimeDisplayValue = (value: string): number | null => {
  const dateTime = Date.parse(value);

  return Number.isNaN(dateTime) ? null : dateTime;
};

/**
 * Chooses the row display type, using the not-provided renderer when the value is missing.
 */
const getDisplayRowType = (
  value: IFinesReportsReportSummaryDisplayRow['value'],
  providedType: FinesReportsReportSummaryDisplayRowType = 'text',
): FinesReportsReportSummaryDisplayRowType => {
  return value === null ? 'notProvided' : providedType;
};

/**
 * Converts currency-like strings to numbers so Angular's CurrencyPipe can format them.
 */
const getCurrencyDisplayValue = (
  value: IFinesReportsReportSummaryDisplayRow['value'],
): IFinesReportsReportSummaryDisplayRow['value'] => {
  if (typeof value === 'number' || value === null) {
    return value;
  }

  const normalisedValue = value.replace(/[£,\s]/g, '');
  const numericValue = Number(normalisedValue);

  return Number.isNaN(numericValue) ? value : numericValue;
};

/**
 * Converts named API values into display rows for the GOV.UK summary-list template.
 */
const mapNamedValuesToRows = (
  values: ReportSummaryNamedValue[] | undefined,
): IFinesReportsReportSummaryDisplayRow[] => {
  return (values ?? [])
    .filter((row) => !row.optional || !isFinesReportsReportSummaryUnusedOptionalValue(row.value))
    .map((row) => {
      const mappedValue = mapFinesReportsReportSummaryDisplayValue(row.value);
      const value = CURRENCY_ROW_KEYS.has(row.name) ? getCurrencyDisplayValue(mappedValue) : mappedValue;
      const isCurrencyValue = CURRENCY_ROW_KEYS.has(row.name) && typeof value === 'number';

      return {
        key: row.name,
        value,
        type: getDisplayRowType(value, isCurrencyValue ? 'currency' : 'text'),
      };
    });
};

/**
 * Flattens backend error objects into named values that can be rendered as error rows.
 */
const mapErrorRows = (errors: Array<Record<string, unknown>> | null | undefined): ReportSummaryNamedValue[] => {
  return (errors ?? []).flatMap((error) =>
    Object.entries(error).map(([key, value]) => ({
      name: getErrorParameterLabel(key),
      value: mapReportParameterValue(value),
      optional: isFinesReportsReportSummaryUnusedOptionalValue(value),
    })),
  );
};

/**
 * Maps a backend report instance response into the view model consumed by the report summary component.
 */
export const mapFinesReportsReportInstanceToViewModel = (
  reportInstance: IOpalFinesReportInstanceDetail,
  reportTypeId: string,
  enforcementAction: IOpalFinesResultRefData | null = null,
  reportTitle = '',
): IFinesReportsReportSummaryViewModel => {
  const resolvedReportTypeId = reportTypeId || reportInstance.report.id;
  const reportType = formatReportTypeDisplay(
    getReportTypeParameterValue(reportInstance.report_parameters),
    resolvedReportTypeId,
  );
  const criteria = buildCriteriaRows(reportInstance.report_parameters, reportType, enforcementAction);
  const status = normaliseStatus(reportInstance.status.code);
  const numberOfRecords = reportInstance.number_of_records ?? null;
  const businessUnitsValue = mapFinesReportsReportSummaryDisplayValue(getBusinessUnits(reportInstance));
  const numberOfRecordsValue = getNumberOfRecordsDisplayValue(status, numberOfRecords);
  const createdByValue = mapFinesReportsReportSummaryDisplayValue(getCreatedBy(reportInstance));
  const dateCreatedValue = getDateTimeDisplayValue(reportInstance.requested_at);

  return {
    reportId: reportInstance.report.id,
    reportTitle,
    reportReference: getReportReference(reportInstance),
    reportType,
    generalRows: [
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.status,
        value: getStatusDisplay(status, numberOfRecords),
        type: 'text',
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.dateCreated,
        value: dateCreatedValue,
        type: getDisplayRowType(dateCreatedValue, 'dateTime'),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.businessUnits,
        value: businessUnitsValue,
        type: getDisplayRowType(businessUnitsValue),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.numberOfRecords,
        value: numberOfRecordsValue,
        type: getDisplayRowType(numberOfRecordsValue, 'number'),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.createdBy,
        value: createdByValue,
        type: getDisplayRowType(createdByValue),
      },
    ],
    criteriaRows: mapNamedValuesToRows(criteria),
    errorRows:
      status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.error
        ? mapNamedValuesToRows(mapErrorRows(reportInstance.errors))
        : [],
  };
};
