import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../routing/constants/fines-reports-summary-list-routing-titles.constant';
import { IFinesReportSummaryListReportConfiguration } from '../interfaces/fines-report-summary-list-report-configuration.interface';

export const FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION: IFinesReportSummaryListReportConfiguration[] = [
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    reportTypeId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
    permissionIds: [],
    canCreate: false,
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    reportTypeId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    createHeading: 'Operational report (by enforcement)',
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-enforcement']],
    canCreate: true,
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    reportTypeId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    createHeading: 'Operational report (by payments)',
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-payments']],
    canCreate: true,
  },
];
