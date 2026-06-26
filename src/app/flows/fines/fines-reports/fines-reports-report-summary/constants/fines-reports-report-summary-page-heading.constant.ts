import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

export const FINES_REPORTS_REPORT_SUMMARY_PAGE_HEADING = {
  default: 'Operational report',
  reports: {
    [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement]:
      'Operational report (by enforcement)',
    [FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments]:
      'Operational report (by payments)',
  } as Record<string, string>,
} as const;
