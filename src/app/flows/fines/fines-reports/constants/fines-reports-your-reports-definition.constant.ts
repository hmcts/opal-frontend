import { IFinesReportsDefinition } from '../interfaces/fines-reports-definition.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-titles.constant';

export const FINES_REPORTS_YOUR_REPORTS_DEFINITION: IFinesReportsDefinition = {
  id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
  heading: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
  title: FINES_REPORTS_SUMMARY_LIST_ROUTING_TITLES.children.yourReports,
  permissionIds: [],
  highlightLinkId: 'user-reports',
  highlightLinkText: 'View all your reports',
};
