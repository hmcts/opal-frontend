import { IDashboardPageConfigurationLink } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '../../routing/constants/fines-routing-paths.constant';

export const FINES_FPU_LINKS: IDashboardPageConfigurationLink[] = [
  {
    id: 'finesFpuLink',
    text: 'Fixed Penalty Uploads',
    routerLink: [`/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.fpu.root}`],
    fragment: null,
    permissionIds: [FINES_PERMISSIONS['publish-fixed-penalty']],
    newTab: false,
    style: null,
  },
];
