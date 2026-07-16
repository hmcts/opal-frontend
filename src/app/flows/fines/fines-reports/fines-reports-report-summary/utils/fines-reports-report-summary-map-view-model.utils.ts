import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
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

const REPORT_TYPE_PARAMETER_KEYS = new Set(['reportType', 'report_type', 'report type']);
const REPORT_TYPE_ALIASES = {
  summary: 'summary',
  detailed: 'detailed',
  detail: 'detail',
} as const;
const ACTION_DATE_FROM_PARAMETER_KEY = 'action_date_from';
const ACTION_DATE_TO_PARAMETER_KEY = 'action_date_to';
const PAYMENT_DATE_FROM_PARAMETER_KEY = 'payment_date_from';
const PAYMENT_DATE_TO_PARAMETER_KEY = 'payment_date_to';
const REPORT_PARAMETER_LABEL_OVERRIDES: Record<string, string> = {
  reportType: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType,
  report_type: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType,
  'report type': FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType,
  enforcement: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.enforcement,
  account_type: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountType,
  account_status: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.accountStatus,
  collection_order: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.collectionOrder,
  minimum_account_balance: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumAccountBalance,
  maximum_account_balance: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumAccountBalance,
  lower_name_range: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.lowerNameRange,
  upper_name_range: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.upperNameRange,
  payment_method: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentMethod,
  minimum_payment_amount: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.minimumPaymentAmount,
  maximum_payment_amount: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.maximumPaymentAmount,
  error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  error_description: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  operationId: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.operationId,
  report_generation_error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportGenerationError,
  report_service: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportService,
};
const DATE_RANGE_PARAMETER_KEYS = new Set<string>([
  ACTION_DATE_FROM_PARAMETER_KEY,
  ACTION_DATE_TO_PARAMETER_KEY,
  PAYMENT_DATE_FROM_PARAMETER_KEY,
  PAYMENT_DATE_TO_PARAMETER_KEY,
]);
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
 * Converts backend status text into the status keys used by the summary screen.
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
 * Looks up the friendly label for a report parameter key.
 */
const getReportParameterLabel = (key: string): string => {
  return REPORT_PARAMETER_LABEL_OVERRIDES[key] ?? key;
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
 * Returns a trimmed date string only when the API supplied a string value.
 */
const getDateRangeDisplayValue = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

/**
 * Builds one named row for a known from/to date parameter pair.
 */
const buildKnownDateRangeRow = (
  reportParameters: Record<string, unknown>,
  fromKey: string,
  toKey: string,
  label: string,
): ReportSummaryNamedValue | null => {
  const fromDisplay = getDateRangeDisplayValue(reportParameters[fromKey]);
  const toDisplay = getDateRangeDisplayValue(reportParameters[toKey]);
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
    name: label,
    value,
    optional: false,
  };
};

/**
 * Builds the first supported date range row found in the report parameters.
 */
const buildDateRangeRow = (reportParameters: Record<string, unknown>): ReportSummaryNamedValue | null => {
  return (
    buildKnownDateRangeRow(
      reportParameters,
      ACTION_DATE_FROM_PARAMETER_KEY,
      ACTION_DATE_TO_PARAMETER_KEY,
      FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.actionDate,
    ) ??
    buildKnownDateRangeRow(
      reportParameters,
      PAYMENT_DATE_FROM_PARAMETER_KEY,
      PAYMENT_DATE_TO_PARAMETER_KEY,
      FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.paymentDate,
    )
  );
};

/**
 * Builds report criteria rows in the order shown on the summary screen.
 */
const buildCriteriaRows = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportType: string,
): ReportSummaryNamedValue[] => {
  const parameters = reportParameters ?? {};
  const reportTypeRow: ReportSummaryNamedValue = {
    name: FINES_REPORTS_REPORT_SUMMARY_CRITERIA_LABELS.reportType,
    value: reportType,
    optional: false,
  };
  const dateRangeRow = buildDateRangeRow(parameters);
  const criteriaRows = Object.entries(parameters)
    .filter(([key]) => !REPORT_TYPE_PARAMETER_KEYS.has(key) && !DATE_RANGE_PARAMETER_KEYS.has(key))
    .map(([key, value]) => ({
      name: getReportParameterLabel(key),
      value: mapReportParameterValue(value),
      optional: isFinesReportsReportSummaryUnusedOptionalValue(value),
    }));

  return dateRangeRow ? [reportTypeRow, dateRangeRow, ...criteriaRows] : [reportTypeRow, ...criteriaRows];
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
  return reportInstance.requested_by.name?.trim() || reportInstance.requested_by.user_id?.trim() || '';
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
      name: getReportParameterLabel(key),
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
): IFinesReportsReportSummaryViewModel => {
  const resolvedReportTypeId = reportTypeId || reportInstance.report.id;
  const reportType = formatReportTypeDisplay(
    getReportTypeParameterValue(reportInstance.report_parameters),
    resolvedReportTypeId,
  );
  const criteria = buildCriteriaRows(reportInstance.report_parameters, reportType);
  const status = normaliseStatus(reportInstance.status.display_name.trim() || reportInstance.status.code);
  const numberOfRecords = reportInstance.number_of_records ?? null;
  const businessUnitsValue = mapFinesReportsReportSummaryDisplayValue(getBusinessUnits(reportInstance));
  const numberOfRecordsValue = getNumberOfRecordsDisplayValue(status, numberOfRecords);
  const createdByValue = mapFinesReportsReportSummaryDisplayValue(getCreatedBy(reportInstance));

  return {
    reportId: reportInstance.report.id,
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
        value: reportInstance.requested_at,
        type: 'dateTime',
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
