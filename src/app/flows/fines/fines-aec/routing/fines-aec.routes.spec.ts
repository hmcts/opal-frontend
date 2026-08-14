import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { routePermissionsGuard } from '@hmcts/opal-frontend-common/guards/route-permissions';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { describe, expect, it } from 'vitest';
import { FinesAecConfigComponent } from '../fines-aec-config/fines-aec-config.component';
import { FINES_AEC_ROUTING_PATHS } from './fines-aec-routing-paths.constant';
import { FINES_AEC_ROUTING_TITLES } from './fines-aec-routing-titles.constant';
import { routing } from './fines-aec.routes';
import { FINES_PERMISSIONS } from 'src/app/constants/fines-permissions.constant';

describe('fines aec routes', () => {
  it('should redirect the Auto-Enforcement root to the dashboard', () => {
    const rootRoute = routing.find((route) => route.path === '');

    expect(rootRoute?.redirectTo).toBe(FINES_AEC_ROUTING_PATHS.children.config);
    expect(rootRoute?.pathMatch).toBe('full');
  });

  it('should protect and title the Auto-Enforcement configuration route', () => {
    const configRoute = routing.find((route) => route.path === FINES_AEC_ROUTING_PATHS.children.config);

    expect(configRoute?.canActivate).toEqual([authGuard, routePermissionsGuard]);
    expect(configRoute?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['auto-enforcement']],
      title: FINES_AEC_ROUTING_TITLES.children.config,
    });
    expect(configRoute?.resolve).toEqual({ title: TitleResolver });
  });

  it('should lazy-load the Auto-Enforcement configuration component', async () => {
    const configRoute = routing.find((route) => route.path === FINES_AEC_ROUTING_PATHS.children.config);

    await expect(configRoute?.loadComponent?.()).resolves.toBe(FinesAecConfigComponent);
  });
});
