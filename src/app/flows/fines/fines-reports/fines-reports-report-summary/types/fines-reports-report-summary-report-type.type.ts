import { FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES } from '../constants/fines-reports-report-summary-report-types.constant';

export type FinesReportsReportSummaryReportType =
  (typeof FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES)[keyof typeof FINES_REPORTS_REPORT_SUMMARY_REPORT_TYPES];
