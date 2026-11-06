import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';
export const ADMINISTRATION_LINKS: IFinesDashboardConfigurationLink[] = [
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
    permissionCodes: [],
    newTab: false,
    style: null,
  },
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
    permissionCodes: [FINES_PERMISSIONS['auto-enforcement']],
    newTab: false,
    style: null,
  },
];
