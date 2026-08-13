import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_AEC_ROUTING_PATHS } from './fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './fines-aec-routing-titles.constant';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';  

export const routing: Routes = [
  {
    path: '',
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard,
    pathMatch: 'full',
  },
  {
    path: FINES_AEC_ROUTING_PATHS.children.config,
    loadComponent: () =>
      import('../fines-aec-config/fines-aec-config.component').then((c) => c.FinesAecConfigComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.config,
    },
    resolve: { title: TitleResolver },
  },
];
