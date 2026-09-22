import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';

export const FINANCE_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'automaticCashInputLink',
    text: 'Automatic Cash Input',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.autoPaymentIn.root,
      FINES_ROUTING_PATHS.children.autoPaymentIn.children.selectBusinessUnits,
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['process-and-allocate-payments']],
    newTab: false,
    style: null,
  },
  {
    id: 'manualCashInput',
    text: 'Manual cash input',
    routerLink: ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.mci.root],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['process-and-allocate-payments']],
    newTab: false,
    style: null,
  },
];
