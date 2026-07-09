import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-titles.constant';
import { OPERATIONAL_REPORT_ROUTE_PERMISSIONS } from '../../constants/operational-report-route-permissions.constant';

export const FINES_REPORTS_OPERATIONAL_REPORTS_BY_PAYMENTS_DEFINITION: IFinesReportsDefinition = {
  id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
  heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
  title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByPayments,
  permissionIds: OPERATIONAL_REPORT_ROUTE_PERMISSIONS,
  operationalLinkId: 'finesReportsOperationalReportsByPaymentLink',
};
