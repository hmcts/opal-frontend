import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINES_SA_LINKS: IDashboardPageConfigurationLink[] = [
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
    permissionIds: [FINES_PERMISSIONS['search-and-view-accounts']],
    newTab: false,
    style: null,
  },
];
