import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../routing/constants/fines-reports-routing-paths.constant';

export const FINES_REPORTS_HIGHLIGHT_REPORT_LINKS: IFinesDashboardConfigurationLink[] = [
  {
    id: 'user-reports',
    text: 'View all your reports',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_REPORTS_ROUTING_PATHS.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ],
    fragment: null,
    permissionCodes: [],
    newTab: false,
    style: 'guidance-panel-blue',
  },
];
