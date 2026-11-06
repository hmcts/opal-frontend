import { type IFinesDashboardConfigurationLink } from '@app/interfaces/fines-dashboard-configuration.interface';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';

export const FINES_CON_LINKS: IFinesDashboardConfigurationLink[] = [
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
    permissionCodes: [FINES_PERMISSIONS['consolidate']],
    newTab: false,
    style: null,
  },
];
