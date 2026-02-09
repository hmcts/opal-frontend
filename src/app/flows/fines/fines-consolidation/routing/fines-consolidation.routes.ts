import { Routes } from '@angular/router';
import { FINES_CONSOLIDATION_ROUTING_PATHS } from './constants/fines-consolidation-routing-paths.constant';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { PAGES_ROUTING_PATHS } from '@routing/pages/constants/routing-paths.constant';
import { FINES_CONSOLIDATION_ROUTING_TITLES } from './constants/fines-consolidation-routing-titles.constant';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';

const consolidationRootPermissionIds = FINES_PERMISSIONS;
export const routing: Routes = [
  {
    path: FINES_CONSOLIDATION_ROUTING_PATHS.root,
    redirectTo: PAGES_ROUTING_PATHS.children.dashboard, // Redirect to dashboard
    pathMatch: 'full',
    canActivateChild: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [consolidationRootPermissionIds['consolidate']],
    },
  },
  {
    path: FINES_CONSOLIDATION_ROUTING_PATHS.children.selectBusinessUnit,
    loadComponent: () =>
      import('../select-business-unit/fines-con-select-bu/fines-con-select-bu.component').then(
        (c) => c.FinesConSelectBuComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard],
    canDeactivate: [canDeactivateGuard],
    data: {
      routePermissionId: [consolidationRootPermissionIds['consolidate']],
      permission: 'CONSOLIDATE',
      title: FINES_CONSOLIDATION_ROUTING_TITLES.children.selectBusinessUnit,
    },
    resolve: { title: TitleResolver, businessUnits: fetchBusinessUnitsResolver },
  },
];
