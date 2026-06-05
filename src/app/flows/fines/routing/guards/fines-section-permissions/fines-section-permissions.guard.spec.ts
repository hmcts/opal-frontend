import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ACCOUNTS_PERMISSIONS } from '@app/flows/fines/constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from '@app/flows/fines/constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from '@app/flows/fines/constants/search-permissions.constant';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1B_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
} from '@app/flows/fines/constants/release-feature-flags.constant';

const resolveFeatureFlagGuardMock = vi.fn();
const DEFAULT_RELEASE_FEATURE_FLAGS = {
  [RELEASE_1A_FEATURE_FLAG]: true,
  [RELEASE_1B_FEATURE_FLAG]: true,
  [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
  [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: true,
};

const mockFeatureFlags = (featureFlags: Record<string, boolean>) => {
  resolveFeatureFlagGuardMock.mockImplementation((featureFlagName: string) =>
    Promise.resolve(featureFlags[featureFlagName] ?? false),
  );
};

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
  let finesSectionPermissionsGuard: (typeof import('./fines-section-permissions.guard'))['finesSectionPermissionsGuard'];

  const runGuard = async ({ sectionKey, dashboardType }: { sectionKey?: string; dashboardType?: string | null }) => {
    const route = {
      data: sectionKey ? { sectionKey } : {},
      paramMap: convertToParamMap(dashboardType ? { dashboardType } : {}),
    } as ActivatedRouteSnapshot;

    return TestBed.runInInjectionContext(() => finesSectionPermissionsGuard(route, {} as RouterStateSnapshot));
  };

  beforeEach(async () => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockOpalUserService = createSpyObj('OpalUserService', ['getLoggedInUserState']);
    resolveFeatureFlagGuardMock.mockReset();

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockOpalUserService.getLoggedInUserState.mockReturnValue(of(createUserStateWithPermissions([])));
    mockFeatureFlags(DEFAULT_RELEASE_FEATURE_FLAGS);

    vi.resetModules();
    vi.doMock('@hmcts/opal-frontend-common/guards/feature-flag', () => ({
      resolveFeatureFlagGuard: resolveFeatureFlagGuardMock,
    }));

    ({ finesSectionPermissionsGuard } = await import('./fines-section-permissions.guard'));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalUserService, useValue: mockOpalUserService },
      ],
    });
  });

  it('should allow Search when the user has a search permission in another business unit', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([SEARCH_PERMISSIONS[0]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith('release-1b', expect.any(Object), expect.any(Object));
  });

  it('should redirect Search to access denied when the user lacks all search permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect Search to access denied when release-1b is disabled and the user has search permissions', async () => {
    const expectedUrlTree = new UrlTree();
    resolveFeatureFlagGuardMock.mockResolvedValue(false);
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([SEARCH_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.search });

    expect(result).toBe(expectedUrlTree);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith('release-1b', expect.any(Object), expect.any(Object));
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow Accounts when release-1a is disabled and the user has consolidation permission', async () => {
    mockFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1A_FEATURE_FLAG]: false,
    });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
  });

  it('should redirect Accounts when release-1c-write-off is disabled and the user only has consolidation permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
    });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow consolidation section access when release-1c-write-off is enabled and the user has consolidation permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1A_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should allow Accounts when release-1a is enabled and the user has a draft accounts permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
  });

  it('should redirect Accounts when release-1c-write-off is disabled and the user only has consolidation permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
    });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow consolidation section access when release-1c-write-off is enabled and the user has consolidation permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1A_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should redirect Accounts when the user only has draft accounts permission and release-1a is disabled', async () => {
    const expectedUrlTree = new UrlTree();
    mockFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1A_FEATURE_FLAG]: false,
    });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1A_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should resolve the Accounts release feature flags before allowing draft accounts permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1A_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should resolve the Accounts release feature flags before allowing consolidation permission', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1A_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should redirect Accounts to access denied when the user lacks all accounts permissions', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect Accounts without looking up user permissions when disabled release flags exclude every account permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockFeatureFlags({
      [RELEASE_1A_FEATURE_FLAG]: false,
      [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
    });
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.accounts });

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should allow Reports when the user has at least one report permission', async () => {
    mockFeatureFlags(DEFAULT_RELEASE_FEATURE_FLAGS);
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([REPORTS_PERMISSIONS[1]])),
    );

    const result = await runGuard({ sectionKey: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(true);
  });

  it('should resolve the release-1c enforcement operational reporting feature flag before allowing Reports', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([REPORTS_PERMISSIONS[0]])),
    );

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(true);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith(
      RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
      expect.any(Object),
      expect.any(Object),
    );
  });

  it('should redirect Reports when release-1c enforcement operational reporting is disabled', async () => {
    const expectedUrlTree = new UrlTree();
    mockFeatureFlags({
      ...DEFAULT_RELEASE_FEATURE_FLAGS,
      [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false,
    });
    mockOpalUserService.getLoggedInUserState.mockReturnValue(
      of(createUserStateWithPermissions([REPORTS_PERMISSIONS[0]])),
    );
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard({ dashboardType: FINES_DASHBOARD_ROUTING_PATHS.children.reports });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
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
