import { type IOpalFinesReportInstanceDetail } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instance-detail.interface';
import { DateService } from '@hmcts/opal-frontend-common/services/date-service';
import { FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY } from '../constants/fines-reports-report-summary-no-content-status-display.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-normalised-status.type';

/**
 * Allows only recognised backend status codes through to the summary screen. An unknown value
 * deliberately becomes Error so the UI never presents an unsupported lifecycle state as successful or in progress.
 */
export const normaliseReportSummaryStatus = (status: string): FinesReportsReportSummaryNormalisedStatus => {
  if (
    status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested ||
    status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress ||
    status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready
  ) {
    return status;
  }

  return FINES_REPORTS_REPORT_SUMMARY_STATUSES.error;
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
    .map((businessUnit) => businessUnit.business_unit_name.trim() || businessUnit.business_unit_id.toString().trim())
    .filter((businessUnit) => businessUnit.length > 0);
};

/**
 * Gets the status text shown to the user, including the ready-with-zero-records "No content" case.
 */
const getStatusDisplay = (status: FinesReportsReportSummaryNormalisedStatus, recordCount: number | null): string => {
  if (status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready && recordCount === 0) {
    return FINES_REPORTS_REPORT_SUMMARY_NO_CONTENT_STATUS_DISPLAY;
  }

  if (status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.error) {
    return 'Error';
  }

  return status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready ? 'Ready' : 'In progress';
};

/**
 * Hides the record count for statuses where a count is not meaningful yet.
 */
const getNumberOfRecordsDisplayValue = (
  status: FinesReportsReportSummaryNormalisedStatus,
  numberOfRecords: number | null,
): number | null => {
  return status === FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready ? numberOfRecords : null;
};

/**
 * Converts an API ISO date-time into the numeric value used by Angular's DatePipe through Opal's
 * shared DateService. Returning null for an invalid value lets the template show the standard
 * missing-value state instead of rendering an invalid date to the user.
 */
const getDateTimeDisplayValue = (value: string, dateService: DateService): number | null => {
  const dateTime = dateService.getFromIso(value);

  return dateTime.isValid ? dateTime.toMillis() : null;
};

/**
 * Maps the fixed General section from a report instance and its normalised status.
 */
export const mapReportSummaryGeneral = (
  reportInstance: IOpalFinesReportInstanceDetail,
  status: FinesReportsReportSummaryNormalisedStatus,
  dateService: DateService,
): IFinesReportsReportSummaryViewModel['general'] => {
  const numberOfRecords = reportInstance.number_of_records ?? null;

  return {
    status: getStatusDisplay(status, numberOfRecords),
    dateCreated: getDateTimeDisplayValue(reportInstance.requested_at, dateService),
    businessUnits: getBusinessUnits(reportInstance).join(', ') || null,
    numberOfRecords: getNumberOfRecordsDisplayValue(status, numberOfRecords),
    createdBy: getCreatedBy(reportInstance) || null,
  };
};
