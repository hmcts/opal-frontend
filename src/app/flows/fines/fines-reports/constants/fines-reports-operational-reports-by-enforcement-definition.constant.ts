import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-titles.constant';
import { OPERATIONAL_REPORT_ROUTE_PERMISSIONS } from '../../constants/operational-report-route-permissions.constant';

export const FINES_REPORTS_OPERATIONAL_REPORTS_BY_ENFORCEMENT_DEFINITION: IFinesReportsDefinition = {
  id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
  heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
  title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.operationalReportsByEnforcement,
  permissionIds: OPERATIONAL_REPORT_ROUTE_PERMISSIONS,
  operationalLinkId: 'finesReportsOperationalReportsByEnforcementLink',
};
