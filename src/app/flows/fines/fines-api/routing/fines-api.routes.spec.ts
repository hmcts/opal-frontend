import { describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FinesApiProcessAllocateComponent } from '../fines-api-process-allocate/fines-api-process-allocate.component';
import { FinesApiSelectBusComponent } from '../fines-api-select-bus/fines-api-select-bus.component';
import { FINES_API_ROUTING_PATHS } from './constants/fines-api-routing-paths.constant';
import { FINES_API_ROUTING_TITLES } from './constants/fines-api-routing-titles.constant';
import { routing } from './fines-api.routes';

describe('fines API routes', () => {
  it('should redirect the Auto Payment In root to select business units', () => {
    expect(routing[0]).toEqual({
      path: '',
      redirectTo: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
      pathMatch: 'full',
    });
  });

  it.each([
    {
      path: FINES_API_ROUTING_PATHS.children.selectBusinessUnits,
      title: FINES_API_ROUTING_TITLES.children.selectBusinessUnits,
      component: FinesApiSelectBusComponent,
    },
    {
      path: FINES_API_ROUTING_PATHS.children.processAllocate,
      title: FINES_API_ROUTING_TITLES.children.processAllocate,
      component: FinesApiProcessAllocateComponent,
    },
  ])('should expose the $path route', async ({ path, title, component }) => {
    const route = routing.find((routeItem) => routeItem.path === path);

    expect(route).toEqual(
      expect.objectContaining({
        path,
        canActivate: [authGuard, routePermissionsGuard],
        data: {
          routePermissionId: [FINES_PERMISSIONS['process-and-allocate-payments']],
          title,
        },
        resolve: {
          title: TitleResolver,
        },
      }),
    );
    await expect(route?.loadComponent?.()).resolves.toBe(component);
  });
});
