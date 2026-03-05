import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINES_CON_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesConsolidationLink',
    text: 'Consolidate accounts',
    routerLink: [
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.con.root,
      FINES_ROUTING_PATHS.children.con.children['selectBusinessUnit'],
    ],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['consolidate']],
    newTab: false,
    style: null,
  },
];
