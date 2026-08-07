import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';

export const FINANCE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'manualCashInput',
    text: 'Manual cash input',
    routerLink: ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.mci.root],
    fragment: null,
    permissionIds: [],
    newTab: false,
    style: null,
  },
];
