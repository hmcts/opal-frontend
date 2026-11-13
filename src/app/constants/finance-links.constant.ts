import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';

export const FINANCE_LINKS: IFinesDashboardConfigurationLink[] = [
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
    permissionCodes: [FINES_PERMISSIONS['process-and-allocate-payments']],
    newTab: false,
    style: null,
  },
  {
    id: 'manualCashInput',
    text: 'Manual cash input',
    routerLink: ['/', FINES_ROUTING_PATHS.root, FINES_ROUTING_PATHS.children.mci.root],
    fragment: null,
    permissionCodes: [FINES_PERMISSIONS['process-and-allocate-payments']],
    newTab: false,
    style: null,
  },
];
