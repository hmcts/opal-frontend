import { OPERATIONAL_REPORT_ROUTE_PERMISSIONS } from '@app/flows/fines/constants/operational-report-route-permissions.constant';
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
    permissionIds: OPERATIONAL_REPORT_ROUTE_PERMISSIONS,
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    heading: 'Operational reports (by payments)',
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    permissionIds: OPERATIONAL_REPORT_ROUTE_PERMISSIONS,
  },
];
