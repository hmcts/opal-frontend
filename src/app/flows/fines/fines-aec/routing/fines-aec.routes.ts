import { Routes } from '@angular/router';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { FINES_AEC_ROUTING_PATHS } from './constants/fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './constants/fines-aec-routing-titles.constant';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { finesAecEnforcementAccountTypeResolver } from './resolvers/fines-aec-enforcement-account-type.resolver';

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
  {
    path: FINES_AEC_ROUTING_PATHS.children.amendValues,
    loadComponent: () =>
      import('../fines-aec-amend-values/fines-aec-amend-values.component').then((c) => c.FinesAecAmendValuesComponent),
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.amendValues,
    },
    resolve: { title: TitleResolver, enforcementAccountType: finesAecEnforcementAccountTypeResolver },
  },
  {
    path: FINES_AEC_ROUTING_PATHS.children.navigation,
    loadComponent: () =>
      import('../fines-aec-placeholder/fines-aec-placeholder.component').then((c) => c.FinesAecPlaceholderComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.navigation,
      heading: FINES_AEC_ROUTING_TITLES.children.navigation,
    },
    resolve: { title: TitleResolver },
  },
];
