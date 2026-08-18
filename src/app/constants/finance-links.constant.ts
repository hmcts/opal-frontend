import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_PERMISSIONS } from './fines-permissions.constant';

export const FINANCE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'automaticCashInputLink',
    text: 'Automatic Cash Input',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['process-and-allocate-payments']],
    newTab: false,
    style: null,
  },
];
