import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_AEC_ROUTING_PATHS } from './fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './fines-aec-routing-titles.constant';

export const routing: Routes = [
  {
    path: FINES_AEC_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard,
    pathMatch: 'full',
  },
  {
    path: FINES_AEC_ROUTING_PATHS.children.config,
    loadComponent: () =>
      import('../fines-aec-config/fines-aec-config.component').then((c) => c.FinesAecConfigComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      title: FINES_AEC_ROUTING_TITLES.children.config,
    },
    resolve: { title: TitleResolver },
  },
];
