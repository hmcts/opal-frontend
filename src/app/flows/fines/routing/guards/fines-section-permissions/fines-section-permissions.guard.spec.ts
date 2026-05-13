import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { ACCOUNTS_PERMISSIONS } from '@app/flows/fines/constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from '@app/flows/fines/constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from '@app/flows/fines/constants/search-permissions.constant';
import { finesSectionPermissionsGuard } from './fines-section-permissions.guard';

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

describe('finesSectionPermissionsGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGlobalStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLaunchDarklyService: any;

  const runGuard = async ({ sectionKey, dashboardType }: { sectionKey?: string; dashboardType?: string | null }) => {
    const route = {
      data: sectionKey ? { sectionKey } : {},
      paramMap: convertToParamMap(dashboardType ? { dashboardType } : {}),
    } as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => finesSectionPermissionsGuard(route, {} as RouterStateSnapshot));

    return isObservable(result) ? firstValueFrom(result) : result;
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

  it('should allow Search when the user has a search permission in another business unit', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([SEARCH_PERMISSIONS[0]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search });

    expect(result).toBe(true);
  });

  it('should redirect Search to access denied when the user lacks all search permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow Accounts when release-1a is disabled and the user has consolidation permission', async () => {
    mockGlobalStore.featureFlags.mockReturnValue({ 'release-1a': false });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
  });

  it('should allow Accounts when release-1a is enabled and the user has a draft accounts permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
  });

  it('should redirect Accounts when release-1a is disabled and the user only has draft accounts permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({ 'release-1a': false });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should wait for LaunchDarkly flags before allowing draft accounts permission', async () => {
    mockGlobalStore.featureFlags.mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalled();
  });

  it('should redirect Accounts to access denied when the user lacks all accounts permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow Reports when the user has at least one report permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([REPORTS_PERMISSIONS[1]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(true);
  });

  it('should redirect Reports to access denied when the user lacks all report permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow unrestricted dashboard sections without looking up user permissions', async () => {
    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.finance });

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
  });

  it('should allow unknown dashboard types without looking up user permissions', async () => {
    const result = await runGuard({ dashboardType: 'unknown-dashboard-type' });

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
  });

  it('should return false when the user-state lookup fails', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(throwError(() => new Error('lookup failed')));

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(false);
  });
});
