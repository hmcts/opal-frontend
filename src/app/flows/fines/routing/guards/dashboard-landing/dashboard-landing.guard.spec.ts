import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { dashboardLandingGuard } from './dashboard-landing.guard';
import { ACCOUNTS_PERMISSIONS } from '@app/flows/fines/constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from '@app/flows/fines/constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from '@app/flows/fines/constants/search-permissions.constant';

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

describe('dashboardLandingGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGlobalStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLaunchDarklyService: any;

  const runGuard = async () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result$ = TestBed.runInInjectionContext(() => dashboardLandingGuard(route, state));
    return firstValueFrom(result$ as Observable<boolean | UrlTree>);
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockOpalUserService = createSpyObj('OpalUserService', ['getLoggedInUserState']);
    mockGlobalStore = {
      featureFlags: vi.fn().mockReturnValue({ 'release-1a': true }),
    };
    mockLaunchDarklyService = createSpyObj('LaunchDarklyService', ['initializeLaunchDarklyFlags']);

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockOpalUserService.getLoggedInUserState.mockReturnValue(of(createUserStateWithPermissions([])));
    mockLaunchDarklyService.initializeLaunchDarklyFlags.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalUserService, useValue: mockOpalUserService },
        { provide: GlobalStore, useValue: mockGlobalStore },
        { provide: LaunchDarklyService, useValue: mockLaunchDarklyService },
      ],
    });
  });

  it('should route to Search when user has a search permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([SEARCH_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.search,
    ]);
  });

  it('should route to Accounts when Search is unavailable but Accounts is permitted', async () => {
    const expectedUrlTree = new UrlTree();
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ]);
  });

  it('should route to Finance when release-1a is disabled and the user only has draft accounts permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({ 'release-1a': false });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ]);
  });

  it('should wait for LaunchDarkly flags before routing draft accounts users', async () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ]);
  });

  it('should route to Reports when Search and Accounts are unavailable but Reports is permitted', async () => {
    const expectedUrlTree = new UrlTree();
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([REPORTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  });

  it('should route to Finance when the user lacks all restricted primary-navigation permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ]);
  });

  it('should route to Finance when user-state lookup fails', async () => {
    const expectedUrlTree = new UrlTree();
    mockOpalUserService.getLoggedInUserState.mockReturnValue(throwError(() => new Error('lookup failed')));
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.finance,
    ]);
  });
});
