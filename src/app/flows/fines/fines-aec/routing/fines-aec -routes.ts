import { Routes } from '@angular/router';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
//import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_AEC_ROUTING_PATHS } from './fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './fines-aec-routing-titles.constant';
//const draftRootPermissionIds = FINES_PERMISSIONS;

export const routing: Routes = [
  {
    path: FINES_AEC_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
  },
  {
    path: FINES_AEC_ROUTING_PATHS.children.config,

    loadComponent: () =>
      import('../fines-aec-config/fines-aec-config.component').then(
        (c) => c.FinesAecConfigComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      //routePermissionId: [draftRootPermissionIds['create-and-manage-draft-accounts']],
      title: FINES_AEC_ROUTING_TITLES.children.config,
    },
    resolve: { title: TitleResolver },
  },
];
