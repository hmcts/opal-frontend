import { FINES_REPORTS_REPORT_SUMMARY_DEFAULT_REPORT_TYPES } from '../constants/fines-reports-report-summary-default-report-types.constant';
import { type IFinesReportsReportSummaryNamedValue } from '../interfaces/fines-reports-report-summary-named-value.interface';
import { type IFinesReportsReportSummaryInstance } from '../interfaces/fines-reports-report-summary-instance.interface';
import { type IOpalFinesReportInstance } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance.interface';
import {
  isFinesReportsReportSummaryUnusedOptionalValue,
  mapFinesReportsReportSummaryDisplayValue,
} from './fines-reports-report-summary-display-value.utils';

const REPORT_TYPE_PARAMETER_KEYS = new Set(['reportType', 'report_type', 'report type']);
const DATE_RANGE_PARAMETER_CONFIGS = [
  {
    fromKey: 'action_date_from',
    toKey: 'action_date_to',
    label: 'Action date',
  },
  {
    fromKey: 'payment_date_from',
    toKey: 'payment_date_to',
    label: 'Payment date',
  },
] as const;
const REPORT_TYPE_LABEL = 'Report Type';
const REPORT_PARAMETER_LABEL_OVERRIDES: Record<string, string> = {
  reportType: REPORT_TYPE_LABEL,
  report_type: REPORT_TYPE_LABEL,
  'report type': REPORT_TYPE_LABEL,
  enforcement: 'Enforcement',
  account_type: 'Account type',
  account_status: 'Account status',
  collection_order: 'Collection order',
  minimum_account_balance: 'Minimum account balance',
  maximum_account_balance: 'Maximum account balance',
  lower_name_range: 'Lower name range',
  upper_name_range: 'Upper name range',
  payment_method: 'Payment method',
  minimum_payment_amount: 'Minimum payment amount',
  maximum_payment_amount: 'Maximum payment amount',
  error: 'Error description',
  error_description: 'Error description',
  operationId: 'Operation ID',
  report_generation_error: 'Report generation error',
  report_service: 'Report service',
};
const DATE_RANGE_PARAMETER_KEYS = new Set<string>(
  DATE_RANGE_PARAMETER_CONFIGS.flatMap(({ fromKey, toKey }) => [fromKey, toKey]),
);

const formatReportTypeDisplay = (value: unknown, reportId: string): string => {
  if (typeof value === 'string') {
    const normalised = value.trim().toLowerCase();

    if (normalised === 'summary') {
      return 'Summary';
    }

    if (normalised === 'detailed' || normalised === 'detail') {
      return 'Detailed';
    }

    if (value.trim().length > 0) {
      return value.trim();
    }
  }

  return FINES_REPORTS_REPORT_SUMMARY_DEFAULT_REPORT_TYPES[reportId] ?? 'Summary';
};

const formatReportParameterName = (key: string): string => {
  const overriddenLabel = REPORT_PARAMETER_LABEL_OVERRIDES[key];
  if (overriddenLabel) {
    return overriddenLabel;
  }

  if (key.includes(' ')) {
    return key;
  }

  const withSpaces = key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();

  if (!withSpaces) {
    return key;
  }

  return withSpaces.replace(/\b\w/g, (character) => character.toUpperCase());
};

const mapReportParameterValue = (value: unknown): IFinesReportsReportSummaryNamedValue['value'] => {
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

const mapErrorRows = (
  errors: Array<Record<string, unknown>> | null | undefined,
): IFinesReportsReportSummaryNamedValue[] => {
  return (errors ?? []).flatMap((error) =>
    Object.entries(error).map(([key, value]) => ({
      name: formatReportParameterName(key),
      value: mapReportParameterValue(value),
      optional: isFinesReportsReportSummaryUnusedOptionalValue(value),
    })),
  );
};

const buildDateRangeRow = (reportParameters: Record<string, unknown>): IFinesReportsReportSummaryNamedValue | null => {
  const dateRangeConfig = DATE_RANGE_PARAMETER_CONFIGS.find(
    ({ fromKey, toKey }) =>
      !isFinesReportsReportSummaryUnusedOptionalValue(reportParameters[fromKey]) ||
      !isFinesReportsReportSummaryUnusedOptionalValue(reportParameters[toKey]),
  );

  if (!dateRangeConfig) {
    return null;
  }

  const fromValue = reportParameters[dateRangeConfig.fromKey];
  const toValue = reportParameters[dateRangeConfig.toKey];

  if (
    isFinesReportsReportSummaryUnusedOptionalValue(fromValue) &&
    isFinesReportsReportSummaryUnusedOptionalValue(toValue)
  ) {
    return null;
  }

  const fromDisplayValue = mapFinesReportsReportSummaryDisplayValue(mapReportParameterValue(fromValue));
  const toDisplayValue = mapFinesReportsReportSummaryDisplayValue(mapReportParameterValue(toValue));
  const fromDisplay = fromDisplayValue === null ? '' : String(fromDisplayValue);
  const toDisplay = toDisplayValue === null ? '' : String(toDisplayValue);

  if (fromDisplay && toDisplay) {
    return {
      name: dateRangeConfig.label,
      value: `From ${fromDisplay} to ${toDisplay}`,
      optional: false,
    };
  }

  if (fromDisplay) {
    return {
      name: dateRangeConfig.label,
      value: `From ${fromDisplay}`,
      optional: false,
    };
  }

  return {
    name: dateRangeConfig.label,
    value: `To ${toDisplay}`,
    optional: false,
  };
};

const buildCriteriaRows = (
  reportParameters: Record<string, unknown> | null | undefined,
  reportId: string,
): IFinesReportsReportSummaryNamedValue[] => {
  const parameters = (reportParameters ?? {}) as Record<string, unknown>;
  const rows: IFinesReportsReportSummaryNamedValue[] = Object.entries(parameters)
    .filter(([key]) => !REPORT_TYPE_PARAMETER_KEYS.has(key) && !DATE_RANGE_PARAMETER_KEYS.has(key))
    .map(([key, value]) => ({
      name: formatReportParameterName(key),
      value: mapReportParameterValue(value),
      optional: isFinesReportsReportSummaryUnusedOptionalValue(value),
    }));

  const dateRangeRow = buildDateRangeRow(parameters);
  if (dateRangeRow) {
    const dateRangeRowIndex = rows.findIndex((row) => row.name === 'Account type');

    if (dateRangeRowIndex >= 0) {
      rows.splice(dateRangeRowIndex, 0, dateRangeRow);
    } else {
      rows.push(dateRangeRow);
    }
  }

  if (!rows.some((row) => row.name === REPORT_TYPE_LABEL)) {
    rows.unshift({
      name: REPORT_TYPE_LABEL,
      value: formatReportTypeDisplay(
        parameters['reportType'] ?? parameters['report_type'] ?? parameters['report type'],
        reportId,
      ),
      optional: false,
    });
  }

  return rows;
};

const getReportReference = (reportInstance: IOpalFinesReportInstance): string => {
  return reportInstance.name?.trim() || reportInstance.report.id;
};

const getCreatedBy = (reportInstance: IOpalFinesReportInstance): string => {
  return reportInstance.requested_by.name?.trim() || reportInstance.requested_by.user_id?.trim() || '';
};

const getReportStatus = (reportInstance: IOpalFinesReportInstance): IFinesReportsReportSummaryInstance['status'] => {
  return (reportInstance.status.display_name.trim() ||
    reportInstance.status.code) as IFinesReportsReportSummaryInstance['status'];
};

const getBusinessUnits = (reportInstance: IOpalFinesReportInstance): string[] => {
  return reportInstance.business_units
    .map((businessUnit) => businessUnit.business_unit_name?.trim() || businessUnit.business_unit_id.trim())
    .filter((businessUnit) => businessUnit.length > 0);
};

export const mapFinesReportsReportInstanceToReportSummary = (
  reportInstance: IOpalFinesReportInstance,
  reportId: string,
): IFinesReportsReportSummaryInstance => {
  const resolvedReportId = reportId || reportInstance.report.id;
  const criteriaRows = buildCriteriaRows(reportInstance.report_parameters, resolvedReportId);
  const reportTypeValue = mapFinesReportsReportSummaryDisplayValue(
    criteriaRows.find((row) => row.name === REPORT_TYPE_LABEL)?.value,
  );
  const reportType = reportTypeValue === null ? 'Summary' : String(reportTypeValue);

  return {
    report_instance_id: reportInstance.instance_id.toString(),
    report_id: reportInstance.report.id,
    report_reference: getReportReference(reportInstance),
    report_type: reportType,
    status: getReportStatus(reportInstance),
    date_created: reportInstance.requested_at,
    business_units: getBusinessUnits(reportInstance),
    number_of_records: reportInstance.number_of_records ?? null,
    created_by: getCreatedBy(reportInstance),
    criteria: criteriaRows,
    errors: mapErrorRows(reportInstance.errors),
  };
};
