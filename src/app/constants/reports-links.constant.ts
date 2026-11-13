import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

export const REPORTS_LINKS: IFinesDashboardConfigurationLink[] = [
  {
    id: 'testReportsLink',
    text: 'Test Reports Link',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ],
    fragment: null,
    permissionCodes: [],
    newTab: false,
    style: null,
  },
];
