import { describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FinesApiProcessAllocateComponent } from '../fines-api-process-allocate/fines-api-process-allocate.component';
import { FinesApiSelectBusComponent } from '../fines-api-select-bus/fines-api-select-bus.component';
import { FINES_API_ROUTING_PATHS } from './constants/fines-api-routing-paths.constant';
import { FINES_API_ROUTING_TITLES } from './constants/fines-api-routing-titles.constant';
import { finesApiFlowStateGuard } from './guards/fines-api-flow-state.guard';
import { finesApiBusinessUnitCountsResolver } from './resolvers/fines-api-business-unit-counts.resolver';
import { routing } from './fines-api.routes';

describe('fines API routes', () => {
  it('should redirect the Auto Payment In root to select business units', () => {
    expect(routing[0]).toEqual({
      path: '',
      redirectTo: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
      pathMatch: 'full',
    });
  });

  it('should expose the select business units route as the flow entry point', async () => {
    const selectBusinessUnitsRoute = routing.find(
      (route) => route.path === FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual(
      expect.objectContaining({
        path: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_API_ROUTING_TITLES.children.selectBusinessUnits,
        },
        resolve: {
          title: TitleResolver,
          businessUnitCounts: finesApiBusinessUnitCountsResolver,
        },
      }),
    );
    await expect(selectBusinessUnitsRoute?.loadComponent?.()).resolves.toBe(FinesApiSelectBusComponent);
  });

  it('should protect the process allocate route with the ACI flow state guard', async () => {
    const processAllocateRoute = routing.find(
      (route) => route.path === FINES_API_ROUTING_PATHS.children.processAllocate,
    );

    expect(processAllocateRoute).toEqual(
      expect.objectContaining({
        path: FINES_API_ROUTING_PATHS.children.processAllocate,
        canActivate: [authGuard, routePermissionsGuard, finesApiFlowStateGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_API_ROUTING_TITLES.children.processAllocate,
        },
        resolve: {
          title: TitleResolver,
        },
      }),
    );
    await expect(processAllocateRoute?.loadComponent?.()).resolves.toBe(FinesApiProcessAllocateComponent);
  });
});
