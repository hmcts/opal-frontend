import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
export const ADMINISTRATION_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'autoEnforcementConfigurationLink',
    text: 'Auto-enforcement configuration',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.aec.root,
      FINES_ROUTING_PATHS.children.aec.children['config'],
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['auto-enforcement']],
    newTab: false,
    style: null,
  },
];
