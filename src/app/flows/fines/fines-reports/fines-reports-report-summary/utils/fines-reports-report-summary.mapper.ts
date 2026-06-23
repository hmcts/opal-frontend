import { DateTime } from 'luxon';
import { FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS } from '../constants/fines-reports-report-summary-general-labels.constant';
import {
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
  FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY,
} from '../constants/fines-reports-report-summary-status-display.constant';
import { IFinesReportsReportSummaryDisplayRow } from '../interfaces/fines-reports-report-summary-display-row.interface';
import { IFinesReportsReportSummaryInstance } from '../interfaces/fines-reports-report-summary-instance.interface';
import { IFinesReportsReportSummaryNamedValue } from '../interfaces/fines-reports-report-summary-named-value.interface';
import { IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';

type NormalisedReportSummaryStatus = keyof typeof FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY;

const REPORT_STATUS_NORMALISATION: Record<string, NormalisedReportSummaryStatus> = {
  requested: 'REQUESTED',
  in_progress: 'IN_PROGRESS',
  ready: 'READY',
  error: 'ERROR',
};
const RECORD_COUNT_DASH_STATUS_SET = new Set<NormalisedReportSummaryStatus>(
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
    return '-';
  }

  return String(value);
};

const formatDateCreated = (dateCreated: string): string => {
  const parsedDate = DateTime.fromISO(dateCreated, { setZone: true });

  return parsedDate.isValid ? parsedDate.setLocale('en-gb').toFormat("dd MMM yyyy 'at' HH:mm") : dateCreated;
};

const normaliseStatus = (status: IFinesReportsReportSummaryInstance['status']): NormalisedReportSummaryStatus => {
  const normalisedStatus = status.trim().toLowerCase().replace(/\s+/g, '_');

  return REPORT_STATUS_NORMALISATION[normalisedStatus] ?? 'ERROR';
};

const getStatusDisplay = (reportSummary: IFinesReportsReportSummaryInstance): string => {
  const status = normaliseStatus(reportSummary.status);

  if (status === 'READY' && reportSummary.number_of_records === 0) {
    return 'No content';
  }

  return FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY[status];
};

const getNumberOfRecordsDisplay = (reportSummary: IFinesReportsReportSummaryInstance): string => {
  const status = normaliseStatus(reportSummary.status);

  if (RECORD_COUNT_DASH_STATUS_SET.has(status)) {
    return '-';
  }

  return reportSummary.number_of_records?.toString() ?? '-';
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
    errorRows: status === 'ERROR' ? mapNamedValuesToRows(reportSummary.errors) : [],
  };
};
