import { FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY } from '../constants/fines-reports-report-summary-status-display.constant';
import { type FinesReportsReportSummaryNormalisedStatus } from './fines-reports-report-summary-normalised-status.type';

type FinesReportsReportSummaryDisplayStatus =
  (typeof FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY)[keyof typeof FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY];

export type FinesReportsReportSummaryStatus =
  | FinesReportsReportSummaryNormalisedStatus
  | 'Requested'
  | FinesReportsReportSummaryDisplayStatus;
