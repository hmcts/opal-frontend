import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { describe, expect, it, beforeAll, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { SEARCH_PERMISSIONS } from '@app/flows/fines/constants/search-permissions.constant';
import { ACCOUNTS_PERMISSIONS } from '@app/flows/fines/constants/accounts-permissions.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

const createUserStateWithPermissions = (permissionIds: readonly number[]): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);
  const [firstBusinessUnit, secondBusinessUnit] = userState.business_unit_users;

  userState.business_unit_users = [
    {
      ...firstBusinessUnit,
      permissions: [],
    },
    {
      ...secondBusinessUnit,
      permissions: permissionIds.map((permissionId) => ({
        permission_id: permissionId,
        permission_name: `Permission ${permissionId}`,
      })),
    },
  ];

  return userState;
};

describe('dashboardLandingGuard injection context', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const expectedUrlTree = new UrlTree();
  let router: Pick<Router, 'createUrlTree'>;
  let globalStore: GlobalStoreType;
  let dashboardLandingGuard: (typeof import('./dashboard-landing.guard'))['dashboardLandingGuard'];

  const runGuard = () => TestBed.runInInjectionContext(() => dashboardLandingGuard(route, state));

  beforeAll(async () => {
    vi.doUnmock('@hmcts/opal-frontend-common/guards/feature-flag');
    vi.resetModules();
    ({ dashboardLandingGuard } = await import('./dashboard-landing.guard'));
  });

  beforeEach(() => {
    router = {
      createUrlTree: vi.fn().mockReturnValue(expectedUrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        {
          provide: OpalUserService,
          useValue: {
            getLoggedInUserState: vi
              .fn()
              .mockReturnValue(of(createUserStateWithPermissions([SEARCH_PERMISSIONS[0], ACCOUNTS_PERMISSIONS[0]]))),
          },
        },
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyFlags: vi.fn(),
            initializeLaunchDarklyClient: vi.fn(),
          },
        },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
  });

  it('should preserve injection context while resolving multiple release flags', async () => {
    globalStore.setFeatureFlags({ 'release-1a': true, 'release-1b': true });

    await expect(runGuard()).resolves.toBe(expectedUrlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.search,
    ]);
  });

  it('should still route using the disabled release-1b state from the second flag lookup', async () => {
    globalStore.setFeatureFlags({ 'release-1a': true, 'release-1b': false });

    await expect(runGuard()).resolves.toBe(expectedUrlTree);
    expect(router.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ]);
  });
});
