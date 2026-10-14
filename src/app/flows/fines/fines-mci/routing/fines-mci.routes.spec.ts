import { describe, expect, it } from 'vitest';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { HIDE_PRIMARY_NAV_ROUTE_DATA_KEY } from '@app/constants/route-data.constant';
import { fetchBusinessUnitsResolver } from '@app/flows/fines/routing/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { routing } from './fines-mci.routes';
import { FINES_MCI_ROUTING_PATHS } from './constants/fines-mci-routing-paths.constant';
import { FINES_MCI_ROUTING_TITLES } from './constants/fines-mci-routing-titles.constant';

describe('finesMci routes', () => {
  it('should redirect the manual cash input root to create allocate', () => {
    expect(routing[0]).toEqual({
      path: '',
      redirectTo: FINES_MCI_ROUTING_PATHS.children.createAllocate,
      pathMatch: 'full',
    });
  });

  it('should expose a create allocate placeholder route', () => {
    const createAllocateRoute = routing.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.createAllocate);

    expect(createAllocateRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.createAllocate,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.createAllocate,
        },
        resolve: expect.objectContaining({
          title: TitleResolver,
        }),
      }),
    );
    expect(createAllocateRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should expose a guarded create till select business unit placeholder route', () => {
    const createRoute = routing.find((route) => route.path === FINES_MCI_ROUTING_PATHS.children.create);
    const createTillRoute = createRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.till,
    );
    const createTillSelectBusinessUnitRoute = createTillRoute?.children?.find(
      (route) => route.path === FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
    );

    expect(createTillSelectBusinessUnitRoute).toEqual(
      expect.objectContaining({
        path: FINES_MCI_ROUTING_PATHS.children.selectBusinessUnit,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          permission: 'PROCESS_AND_ALLOCATE_PAYMENTS',
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title: FINES_MCI_ROUTING_TITLES.children.createTillSelectBusinessUnit,
          [HIDE_PRIMARY_NAV_ROUTE_DATA_KEY]: true,
        },
        resolve: expect.objectContaining({
          businessUnits: fetchBusinessUnitsResolver,
          title: TitleResolver,
        }),
      }),
    );
    expect(createTillSelectBusinessUnitRoute?.loadComponent).toEqual(expect.any(Function));
  });
});
