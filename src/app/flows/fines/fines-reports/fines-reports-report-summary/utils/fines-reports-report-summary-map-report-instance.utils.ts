import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';
import { FINES_REPORTS_REPORT_SUMMARY_DEFAULT_REPORT_TYPES } from '../constants/fines-reports-report-summary-default-report-types.constant';
import { type IFinesReportsReportSummaryNamedValue } from '../interfaces/fines-reports-report-summary-named-value.interface';
import { type IFinesReportsReportSummaryInstance } from '../interfaces/fines-reports-report-summary-instance.interface';
import { type IOpalFinesReportInstance } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance.interface';

const REPORT_TYPE_PARAMETER_KEYS = new Set(['reportType', 'report_type', 'report type']);
const ACTION_DATE_FROM_KEY = 'action_date_from';
const ACTION_DATE_TO_KEY = 'action_date_to';
const ACTION_DATE_LABEL = 'Action date';
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
  error_description: 'Error description',
  report_generation_error: 'Report generation error',
  report_service: 'Report service',
};

const isUnusedOptionalValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

const formatDisplayValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (isUnusedOptionalValue(value)) {
    return FINES_DEFAULT_VALUES.notProvidedLabel;
  }

  return String(value);
};

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

const mapErrorRows = (
  errors: Array<Record<string, unknown>> | null | undefined,
): IFinesReportsReportSummaryNamedValue[] => {
  return (errors ?? []).flatMap((error) =>
    Object.entries(error).map(([key, value]) => ({
      name: formatReportParameterName(key),
      value: formatDisplayValue(value),
      optional: isUnusedOptionalValue(value),
    })),
  );
};

const buildActionDateRow = (reportParameters: Record<string, unknown>): IFinesReportsReportSummaryNamedValue | null => {
  const fromValue = reportParameters[ACTION_DATE_FROM_KEY];
  const toValue = reportParameters[ACTION_DATE_TO_KEY];

  if (isUnusedOptionalValue(fromValue) && isUnusedOptionalValue(toValue)) {
    return null;
  }

  const fromDisplay = isUnusedOptionalValue(fromValue) ? '' : formatDisplayValue(fromValue);
  const toDisplay = isUnusedOptionalValue(toValue) ? '' : formatDisplayValue(toValue);

  if (fromDisplay && toDisplay) {
    return {
      name: ACTION_DATE_LABEL,
      value: `From ${fromDisplay} to ${toDisplay}`,
      optional: false,
    };
  }

  if (fromDisplay) {
    return {
      name: ACTION_DATE_LABEL,
      value: `From ${fromDisplay}`,
      optional: false,
    };
  }

  return {
    name: ACTION_DATE_LABEL,
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
    .filter(
      ([key]) => !REPORT_TYPE_PARAMETER_KEYS.has(key) && key !== ACTION_DATE_FROM_KEY && key !== ACTION_DATE_TO_KEY,
    )
    .map(([key, value]) => ({
      name: formatReportParameterName(key),
      value: formatDisplayValue(value),
      optional: isUnusedOptionalValue(value),
    }));

  const actionDateRow = buildActionDateRow(parameters);
  if (actionDateRow) {
    const actionDateRowIndex = rows.findIndex((row) => row.name === 'Account type');

    if (actionDateRowIndex >= 0) {
      rows.splice(actionDateRowIndex, 0, actionDateRow);
    } else {
      rows.push(actionDateRow);
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
  return (
    reportInstance.requested_by.name?.trim() ||
    reportInstance.requested_by.user_id?.trim() ||
    FINES_DEFAULT_VALUES.notProvidedLabel
  );
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
  const reportType = criteriaRows.find((row) => row.name === REPORT_TYPE_LABEL)?.value?.toString() ?? 'Summary';

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
