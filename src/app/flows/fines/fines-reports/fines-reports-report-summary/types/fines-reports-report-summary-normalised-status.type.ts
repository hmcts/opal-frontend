import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from '../constants/fines-reports-report-summary-statuses.constant';

export type FinesReportsReportSummaryNormalisedStatus =
  (typeof FINES_REPORTS_REPORT_SUMMARY_STATUSES)[keyof typeof FINES_REPORTS_REPORT_SUMMARY_STATUSES];
