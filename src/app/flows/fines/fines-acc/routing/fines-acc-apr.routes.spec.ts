import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { FinesAccAprAddChangeComponent } from '../fines-acc-apr-add-change/fines-acc-apr-add-change.component';
import { finesAccAprAddChangeModeGuard } from './guards/fines-acc-apr-add-change-mode.guard';
import { finesAccAprAddChangeTitleResolver } from './resolvers/fines-acc-apr/fines-acc-apr-add-change-title.resolver';
import { finesAccAprResolver } from './resolvers/fines-acc-apr/fines-acc-apr.resolver';
import { routing } from './fines-acc-apr.routes';

describe('APR Add/Change route', () => {
  const route = routing.find((route) => route.path === ':mode');

  it('uses one mode parameter after every static APR page', () => {
    expect(routing.filter((entry) => entry.path === ':mode')).toHaveLength(1);
    expect(routing.at(-1)).toBe(route);
    expect(routing.some((entry) => ['add', 'change'].includes(entry.path ?? ''))).toBe(false);
    expect(routing.slice(0, -1).map((entry) => entry.path)).toEqual(
      expect.arrayContaining(['manage', 'error', 'denied']),
    );
  });

  it('validates the mode and current-business-unit permission before resolving fresh account APR data', () => {
    expect(route?.canActivate).toEqual([finesAccAprAddChangeModeGuard, businessUnitRoutePermissionsGuard]);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.runGuardsAndResolvers).toBe('always');
    expect(route?.data).toEqual({
      routePermissionId: [FINES_PERMISSIONS['manage-alternate-payment-references']],
      accessDeniedPath: 'denied',
    });
    expect(route?.resolve).toEqual({ aprs: finesAccAprResolver });
  });

  it('uses the mode-specific Angular page-title resolver', () => {
    expect(route?.title).toBe(finesAccAprAddChangeTitleResolver);
  });

  it('lazy loads the shared Add/Change page', async () => {
    expect(await route?.loadComponent?.()).toBe(FinesAccAprAddChangeComponent);
  });

  it('keeps the error page independent of APR data requests', () => {
    const errorRoute = routing.find((entry) => entry.path === 'error');

    expect(errorRoute?.canActivate).toEqual([businessUnitRoutePermissionsGuard]);
    expect(errorRoute?.resolve).not.toHaveProperty('aprs');
  });
});
