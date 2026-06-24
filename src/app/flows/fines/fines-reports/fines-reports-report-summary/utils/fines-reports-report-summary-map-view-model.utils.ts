import { DateTime } from 'luxon';
import { FINES_DEFAULT_VALUES } from '../../../constants/fines-default-values.constant';
import { FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS } from '../constants/fines-reports-report-summary-general-labels.constant';
import {
  FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY,
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
  FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY,
} from '../constants/fines-reports-report-summary-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { IFinesReportsReportSummaryDisplayRow } from '../interfaces/fines-reports-report-summary-display-row.interface';
import { IFinesReportsReportSummaryInstance } from '../interfaces/fines-reports-report-summary-instance.interface';
import { IFinesReportsReportSummaryNamedValue } from '../interfaces/fines-reports-report-summary-named-value.interface';
import { IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-status.type';

const REPORT_STATUS_NORMALISATION: Record<string, FinesReportsReportSummaryNormalisedStatus> = {
  requested: FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested,
  in_progress: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress,
  ready: FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready,
  error: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
};
const RECORD_COUNT_DASH_STATUS_SET = new Set<FinesReportsReportSummaryNormalisedStatus>(
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
);

const isUnusedOptionalValue = (value: IFinesReportsReportSummaryNamedValue['value']): boolean => {
  return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
};

const formatDisplayValue = (value: IFinesReportsReportSummaryNamedValue['value']): string => {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  }

  if (isUnusedOptionalValue(value)) {
    return FINES_DEFAULT_VALUES.notProvidedLabel;
  }

  return String(value);
};

const formatDateCreated = (dateCreated: string): string => {
  const parsedDate = DateTime.fromISO(dateCreated, { setZone: true });

  return parsedDate.isValid ? parsedDate.setLocale('en-gb').toFormat("dd MMM yyyy 'at' HH:mm") : dateCreated;
};

const normaliseStatus = (
  status: IFinesReportsReportSummaryInstance['status'],
): FinesReportsReportSummaryNormalisedStatus => {
  const normalisedStatus = status.trim().toLowerCase().replace(/\s+/g, '_');

  return REPORT_STATUS_NORMALISATION[normalisedStatus] ?? FINES_REPORTS_REPORT_SUMMARY_STATUSES.error;
};

const getStatusDisplay = (reportSummary: IFinesReportsReportSummaryInstance): string => {
  const status = normaliseStatus(reportSummary.status);

  if (status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready && reportSummary.number_of_records === 0) {
    return FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY;
  }

  return FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[status];
};

const getNumberOfRecordsDisplay = (reportSummary: IFinesReportsReportSummaryInstance): string => {
  const status = normaliseStatus(reportSummary.status);

  if (RECORD_COUNT_DASH_STATUS_SET.has(status)) {
    return FINES_DEFAULT_VALUES.notProvidedLabel;
  }

  return reportSummary.number_of_records?.toString() ?? FINES_DEFAULT_VALUES.notProvidedLabel;
};

const mapNamedValuesToRows = (
  values: IFinesReportsReportSummaryNamedValue[] | undefined,
): IFinesReportsReportSummaryDisplayRow[] => {
  return (values ?? [])
    .filter((row) => !row.optional || !isUnusedOptionalValue(row.value))
    .map((row) => ({
      key: row.name,
      value: formatDisplayValue(row.value),
    }));
};

export const mapFinesReportsReportSummaryToViewModel = (
  reportSummary: IFinesReportsReportSummaryInstance,
): IFinesReportsReportSummaryViewModel => {
  const status = normaliseStatus(reportSummary.status);

  return {
    generalRows: [
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.status,
        value: getStatusDisplay(reportSummary),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.dateCreated,
        value: formatDateCreated(reportSummary.date_created),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.businessUnits,
        value: formatDisplayValue(reportSummary.business_units),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.numberOfRecords,
        value: getNumberOfRecordsDisplay(reportSummary),
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.createdBy,
        value: formatDisplayValue(reportSummary.created_by),
      },
    ],
    criteriaRows: mapNamedValuesToRows(reportSummary.criteria),
    errorRows: status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.error ? mapNamedValuesToRows(reportSummary.errors) : [],
  };
};
