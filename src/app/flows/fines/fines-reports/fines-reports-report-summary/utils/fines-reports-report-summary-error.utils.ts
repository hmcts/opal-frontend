import { FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS } from '../constants/fines-reports-report-summary-error-labels.constant';
import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';
import { type IFinesReportsReportSummaryViewModel } from '../interfaces/fines-reports-report-summary-view-model.interface';
import { type FinesReportsReportSummaryNormalisedStatus } from '../types/fines-reports-report-summary-normalised-status.type';
import { isUnusedOptionalValue, mapDisplayText } from './fines-reports-report-summary-display-value.utils';

/**
 * Gives backend error keys the user-facing labels agreed for the Errors section.
 */
const ERROR_PARAMETER_LABEL_OVERRIDES: Record<string, string> = {
  error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  error_description: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.errorDescription,
  operationId: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.operationId,
  report_generation_error: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportGenerationError,
  report_service: FINES_REPORTS_REPORT_SUMMARY_ERROR_LABELS.reportService,
};

/**
 * Looks up the friendly label for a report-generation error key.
 */
const getErrorParameterLabel = (key: string): string => {
  return ERROR_PARAMETER_LABEL_OVERRIDES[key] ?? key;
};

/**
 * Maps error values only when a report instance has the Error status. Each API error is an object
 * because one generation failure can carry several named values. Flattening those objects gives
 * the template simple key/value rows while retaining the received error and property sequence.
 */
export const mapReportSummaryErrors = (
  errors: Array<Record<string, unknown>> | null | undefined,
  status: FinesReportsReportSummaryNormalisedStatus,
): IFinesReportsReportSummaryViewModel['errorRows'] => {
  if (status !== FINES_REPORTS_REPORT_SUMMARY_STATUSES.error) {
    return [];
  }

  return (errors ?? []).flatMap((error) =>
    Object.entries(error)
      .filter(([, value]) => !isUnusedOptionalValue(value))
      .map(([key, value]) => ({ key: getErrorParameterLabel(key), value: mapDisplayText(value) })),
  );
};
