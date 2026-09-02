import { Routes } from '@angular/router';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_API_ROUTING_PATHS } from './constants/fines-api-routing-paths.constant';
import { FINES_API_ROUTING_TITLES } from './constants/fines-api-routing-titles.constant';
import { finesApiFlowStateGuard } from './guards/fines-api-flow-state.guard';

export const routing: Routes = [
  {
    path: '',
    redirectTo: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
    pathMatch: 'full',
  },
  {
    path: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
    loadComponent: () =>
      import('../fines-api-select-bus/fines-api-select-bus.component').then((c) => c.FinesApiSelectBusComponent),
    canActivate: [authGuard, routePermissionsGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
      title: FINES_API_ROUTING_TITLES.children.selectBusinessUnits,
    },
    resolve: {
      title: TitleResolver,
    },
  },
  {
    path: FINES_API_ROUTING_PATHS.children.processAllocate,
    loadComponent: () =>
      import('../fines-api-process-allocate/fines-api-process-allocate.component').then(
        (c) => c.FinesApiProcessAllocateComponent,
      ),
    canActivate: [authGuard, routePermissionsGuard, finesApiFlowStateGuard],
    data: {
      routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
      title: FINES_API_ROUTING_TITLES.children.processAllocate,
    },
    resolve: {
      title: TitleResolver,
    },
  },
];
