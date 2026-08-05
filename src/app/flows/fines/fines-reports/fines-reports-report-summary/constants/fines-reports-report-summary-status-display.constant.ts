import { FINES_REPORTS_REPORT_SUMMARY_STATUSES } from './fines-reports-report-summary-statuses.constant';

export const FINES_REPORTS_REPORT_SUMMARY_STATUS_DISPLAY = {
  [FINES_REPORTS_REPORT_SUMMARY_STATUSES.requested]: 'In progress',
  [FINES_REPORTS_REPORT_SUMMARY_STATUSES.inProgress]: 'In progress',
  [FINES_REPORTS_REPORT_SUMMARY_STATUSES.ready]: 'Ready',
  [FINES_REPORTS_REPORT_SUMMARY_STATUSES.error]: 'Error',
} as const;
