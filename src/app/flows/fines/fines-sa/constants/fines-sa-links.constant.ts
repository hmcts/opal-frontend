import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINES_SA_LINKS: IFinesDashboardConfigurationLink[] = [
  {
    id: 'finesSaSearchLink',
    text: 'Search for an account',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.sa.root,
      FINES_ROUTING_PATHS.children.sa.children['search'],
    ],
    fragment: null,
    permissionCodes: [FINES_PERMISSIONS['search-and-view-accounts']],
    newTab: false,
    style: null,
  },
];
