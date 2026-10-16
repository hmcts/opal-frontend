import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';

export const FINANCE_SUSPENSE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'manageSuspenseItems',
    text: 'Manage Suspense Items',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.suspenseItem.root,
      FINES_ROUTING_PATHS.children.suspenseItem.children.search,
    ],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: null,
  },
];
