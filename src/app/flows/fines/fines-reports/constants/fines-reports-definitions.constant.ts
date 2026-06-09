import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-titles.constant';

export const FINES_REPORTS_DEFINITIONS: IFinesReportsDefinition[] = [
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
    permissionIds: [],
    highlightLinkId: 'user-reports',
    highlightLinkText: 'View all your reports',
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-enforcement']],
    operationalLinkId: 'finesReportsOperationalReportsByEnforcementLink',
  },
  {
    id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
    permissionIds: [FINES_PERMISSIONS['operational-report-by-payments']],
    operationalLinkId: 'finesReportsOperationalReportsByPaymentLink',
  },
];

export const findFinesReportsDefinition = (reportId: string | null | undefined): IFinesReportsDefinition | undefined =>
  FINES_REPORTS_DEFINITIONS.find((report) => report.id === reportId);
