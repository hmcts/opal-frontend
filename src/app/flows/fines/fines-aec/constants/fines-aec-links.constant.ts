import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINES_AEC_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesAutoEnforcementConfigLink',
    text: 'Auto Enforcement Configuration',
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
