import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_AEC_ROUTING_PATHS } from './constants/fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './constants/fines-aec-routing-titles.constant';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_AEC_ROUTING_PATHS.children.config,
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
  ...(['navigation', 'amendValues'] as const).map((page) => ({
    path: FINES_AEC_ROUTING_PATHS.children[page],
    loadComponent: () =>
      import('../fines-aec-placeholder/fines-aec-placeholder.component').then((c) => c.FinesAecPlaceholderComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children[page],
      heading: FINES_AEC_ROUTING_TITLES.children[page],
    },
    resolve: { title: TitleResolver },
  })),
];
