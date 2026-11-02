import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { businessUnitRoutePermissionsGuard } from '@hmcts/opal-frontend-common/guards/business-unit-route-permissions';
import { describe, expect, it } from 'vitest';
import { FINES_PERMISSIONS } from '../../../../constants/fines-permissions.constant';
import { finesAccAprResolver } from '../fines-acc-apr/fines-acc-apr.resolver';
import { FinesAccAprAddComponent } from '../fines-acc-apr-add/fines-acc-apr-add.component';
import { routing } from './fines-acc-apr.routes';

describe('APR Add route', () => {
  const route = routing.find((route) => route.path === 'add');

  it('uses fresh account APR data, current-business-unit permission and unsaved-change protection', () => {
    expect(route?.canActivate).toEqual([businessUnitRoutePermissionsGuard]);
    expect(route?.canDeactivate).toEqual([canDeactivateGuard]);
    expect(route?.runGuardsAndResolvers).toBe('always');
    expect(route?.data).toEqual({
      title: 'Add Alternate Payment Reference',
      routePermissionId: [FINES_PERMISSIONS['manage-alternate-payment-references']],
      accessDeniedPath: 'denied',
    });
    expect(route?.resolve?.['aprs']).toBe(finesAccAprResolver);
  });

  it('lazy loads the Add page', async () => {
    expect(await route?.loadComponent?.()).toBe(FinesAccAprAddComponent);
  });
});
