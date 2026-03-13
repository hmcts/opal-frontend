import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

export const ADMINISTRATION_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'testAdministrationLink',
    text: 'Test Administration Link',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.administration,
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: null,
  },
];
