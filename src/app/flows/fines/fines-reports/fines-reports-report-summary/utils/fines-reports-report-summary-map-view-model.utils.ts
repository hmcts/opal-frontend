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
import { type FinesReportsReportSummaryDisplayRowType } from '../types/fines-reports-report-summary-display-row-type.type';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-status.type';
import {
  isFinesReportsReportSummaryUnusedOptionalValue,
  mapFinesReportsReportSummaryDisplayValue,
} from './fines-reports-report-summary-display-value.utils';

const REPORT_STATUS_NORMALISATION: Record<string, FinesReportsReportSummaryNormalisedStatus> = {
  requested: FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested,
  in_progress: FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress,
  ready: FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready,
  error: FINES_REPORTS_REPORT_SUMMARY_STATUSES.error,
};
const RECORD_COUNT_DASH_STATUS_SET = new Set<FinesReportsReportSummaryNormalisedStatus>(
  FINES_REPORTS_REPORT_SUMMARY_RECORD_COUNT_DASH_STATUSES,
);

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

const getNumberOfRecordsDisplayValue = (reportSummary: IFinesReportsReportSummaryInstance): number | null => {
  const status = normaliseStatus(reportSummary.status);

  if (RECORD_COUNT_DASH_STATUS_SET.has(status)) {
    return null;
  }

  return reportSummary.number_of_records;
};

const getDisplayRowType = (
  value: IFinesReportsReportSummaryDisplayRow['value'],
  providedType: FinesReportsReportSummaryDisplayRowType = 'text',
): FinesReportsReportSummaryDisplayRowType => {
  return value === null ? 'notProvided' : providedType;
};

const mapNamedValuesToRows = (
  values: IFinesReportsReportSummaryNamedValue[] | undefined,
): IFinesReportsReportSummaryDisplayRow[] => {
  return (values ?? [])
    .filter((row) => !row.optional || !isFinesReportsReportSummaryUnusedOptionalValue(row.value))
    .map((row) => {
      const value = mapFinesReportsReportSummaryDisplayValue(row.value);

      return {
        key: row.name,
        value,
        type: getDisplayRowType(value),
      };
    });
};

export const mapFinesReportsReportSummaryToViewModel = (
  reportSummary: IFinesReportsReportSummaryInstance,
): IFinesReportsReportSummaryViewModel => {
  const status = normaliseStatus(reportSummary.status);
  const businessUnitsValue = mapFinesReportsReportSummaryDisplayValue(reportSummary.business_units);
  const numberOfRecordsValue = getNumberOfRecordsDisplayValue(reportSummary);
  const createdByValue = mapFinesReportsReportSummaryDisplayValue(reportSummary.created_by);

  return {
    generalRows: [
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.status,
        value: getStatusDisplay(reportSummary),
        type: 'text',
      },
      {
        key: FINES_REPORTS_REPORT_SUMMARY_GENERAL_LABELS.dateCreated,
        value: reportSummary.date_created,
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
    criteriaRows: mapNamedValuesToRows(reportSummary.criteria),
    errorRows: status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.error ? mapNamedValuesToRows(reportSummary.errors) : [],
  };
};
