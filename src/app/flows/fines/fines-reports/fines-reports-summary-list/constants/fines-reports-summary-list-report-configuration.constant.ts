import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../routing/constants/fines-reports-summary-list-routing-titles.constant';
import { IFinesReportSummaryListReportConfiguration } from '../interfaces/fines-report-summary-list-report-configuration.interface';

export const FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION: IFinesReportSummaryListReportConfiguration[] = [
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    heading: 'Your reports',
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
    permissionIds: [],
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    heading: 'Operational reports (by enforcement)',
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-enforcement']],
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    heading: 'Operational reports (by payments)',
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-payments']],
  },
];
