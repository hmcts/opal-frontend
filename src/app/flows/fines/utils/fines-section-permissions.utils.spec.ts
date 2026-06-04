import { describe, expect, it } from 'vitest';
import { type INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_CONFIGURATION_MAP } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { ACCOUNTS_PERMISSIONS } from '../constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from '../constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from '../constants/search-permissions.constant';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
} from '../constants/release-feature-flags.constant';
import {
  canAccessFinesPrimaryNavigationSection,
  filterDashboardConfigByFeatureFlags,
  getAccessiblePrimaryNavigationItems,
  getDashboardLandingType,
  getFeatureFlagReleaseState,
  getFirstAccessibleDashboardType,
  getRequiredPermissionIdsForSection,
  getUserPermissionIds,
  hasAnyPermission,
} from './fines-section-permissions.utils';

const createUserStateWithPermissions = (permissionIds: readonly number[]): IOpalUserState => {
  const userState = structuredClone(OPAL_USER_STATE_MOCK);
  const [firstBusinessUnit, secondBusinessUnit] = userState.business_unit_users;

  userState.business_unit_users = [
    {
      ...firstBusinessUnit,
      permissions: permissionIds.map((permissionId) => ({
        permission_id: permissionId,
        permission_name: `Permission ${permissionId}`,
      })),
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

describe('fines-section-permissions.utils', () => {
  const navigationItems: readonly INavigationBarConfiguration[] = [
    { key: 'search', value: 'Search' },
    { key: 'accounts', value: 'Accounts' },
    { key: 'reports', value: 'Reports' },
  ];

  const allReleaseFlagsEnabled = {
    [RELEASE_1A_FEATURE_FLAG]: true,
    [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
    [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: true,
  };
  const release1aEnabled = { [RELEASE_1A_FEATURE_FLAG]: true };
  const release1aDisabled = { [RELEASE_1A_FEATURE_FLAG]: false };
  const release1aEnabledWithWriteOffDisabled = {
    [RELEASE_1A_FEATURE_FLAG]: true,
    [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
  };
  const release1aDisabledWithWriteOffEnabled = {
    [RELEASE_1A_FEATURE_FLAG]: false,
    [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
  };
  const release1aAndWriteOffEnabled = {
    [RELEASE_1A_FEATURE_FLAG]: true,
    [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
  };
  const release1cWriteOffEnabled = { [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true };
  const release1cWriteOffDisabled = { [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false };
  const release1cReportingEnabled = { [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: true };
  const release1cReportingDisabled = { [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false };

  describe('getUserPermissionIds', () => {
    it('should deduplicate permission ids across business units', () => {
      const userState = createUserStateWithPermissions([SEARCH_PERMISSIONS[0], ACCOUNTS_PERMISSIONS[0]]);

      expect(getUserPermissionIds(userState)).toEqual([SEARCH_PERMISSIONS[0], ACCOUNTS_PERMISSIONS[0]]);
    });

    it('should return an empty array when user state is missing', () => {
      expect(getUserPermissionIds(null)).toEqual([]);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true when any required permission is present', () => {
      expect(hasAnyPermission([SEARCH_PERMISSIONS[0], ACCOUNTS_PERMISSIONS[0]], [999, ACCOUNTS_PERMISSIONS[0]])).toBe(
        true,
      );
    });

    it('should return false when none of the required permissions are present', () => {
      expect(hasAnyPermission([SEARCH_PERMISSIONS[0]], [ACCOUNTS_PERMISSIONS[0]])).toBe(false);
    });
  });

  describe('getFeatureFlagReleaseState', () => {
    it('should map raw feature flags into a release feature flag state', () => {
      expect(getFeatureFlagReleaseState(release1aEnabled)).toEqual({
        [RELEASE_1A_FEATURE_FLAG]: true,
        [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
        [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false,
      });

      expect(getFeatureFlagReleaseState(release1cWriteOffEnabled)).toEqual({
        [RELEASE_1A_FEATURE_FLAG]: false,
        [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: true,
        [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false,
      });

      expect(getFeatureFlagReleaseState(release1cReportingEnabled)).toEqual({
        [RELEASE_1A_FEATURE_FLAG]: false,
        [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
        [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: true,
      });

      expect(getFeatureFlagReleaseState({})).toEqual({
        [RELEASE_1A_FEATURE_FLAG]: false,
        [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: false,
        [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: false,
      });
    });
  });

  describe('getRequiredPermissionIdsForSection', () => {
    it('should return all Accounts permissions when release-1a and release-1c-write-off are enabled', () => {
      expect(getRequiredPermissionIdsForSection('accounts', release1aAndWriteOffEnabled)).toEqual(
        ACCOUNTS_PERMISSIONS,
      );
    });

    it('should keep draft Accounts permissions when release-1a is enabled and release-1c-write-off is disabled', () => {
      expect(getRequiredPermissionIdsForSection('accounts', release1aEnabledWithWriteOffDisabled)).toEqual([
        ACCOUNTS_PERMISSIONS[0],
        ACCOUNTS_PERMISSIONS[1],
      ]);
    });

    it('should keep consolidation Accounts permissions when release-1a is disabled and release-1c-write-off is enabled', () => {
      expect(getRequiredPermissionIdsForSection('accounts', release1aDisabledWithWriteOffEnabled)).toEqual([
        ACCOUNTS_PERMISSIONS[2],
      ]);
    });

    it('should return Reports permissions when release-1c enforcement operational reporting is enabled', () => {
      expect(getRequiredPermissionIdsForSection('reports', release1cReportingEnabled)).toEqual(REPORTS_PERMISSIONS);
    });

    it('should remove Reports permissions when release-1c enforcement operational reporting is disabled', () => {
      expect(getRequiredPermissionIdsForSection('reports', release1cReportingDisabled)).toEqual([]);
    });
  });

  describe('canAccessFinesPrimaryNavigationSection', () => {
    it('should allow unrestricted dashboard sections', () => {
      expect(canAccessFinesPrimaryNavigationSection('finance', null)).toBe(true);
    });

    it('should deny restricted sections when the user lacks permissions', () => {
      expect(canAccessFinesPrimaryNavigationSection('search', createUserStateWithPermissions([]))).toBe(false);
    });

    it('should allow Accounts with draft permissions when all release flags are enabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]),
          allReleaseFlagsEnabled,
        ),
      ).toBe(true);
    });

    it('should deny Accounts with draft-only permissions when release-1a is disabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]),
          release1aDisabledWithWriteOffEnabled,
        ),
      ).toBe(false);
    });

    it('should allow Accounts with consolidation permissions when release-1c-write-off is enabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]),
          release1aDisabledWithWriteOffEnabled,
        ),
      ).toBe(true);
    });

    it('should deny Accounts with consolidation-only permissions when release-1c-write-off is disabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]),
          release1aEnabledWithWriteOffDisabled,
        ),
      ).toBe(false);
    });

    it('should allow Reports when release-1c enforcement operational reporting is enabled and the user has a report permission', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'reports',
          createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]),
          release1cReportingEnabled,
        ),
      ).toBe(true);
    });

    it('should deny Reports when release-1c enforcement operational reporting is disabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'reports',
          createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]),
          release1cReportingDisabled,
        ),
      ).toBe(false);
    });
  });

  describe('getAccessiblePrimaryNavigationItems', () => {
    it('should filter navigation items down to the sections the user can access', () => {
      const userState = createUserStateWithPermissions([SEARCH_PERMISSIONS[0]]);

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState)).toEqual([
        { key: 'search', value: 'Search' },
      ]);
    });

    it('should remove Accounts for draft-only users when release-1a is disabled', () => {
      const userState = createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]);

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState, release1aDisabledWithWriteOffEnabled)).toEqual([]);
    });

    it('should remove Accounts for consolidation-only users when release-1c-write-off is disabled', () => {
      const userState = createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]);

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState, release1aEnabledWithWriteOffDisabled)).toEqual([]);
    });

    it('should remove Reports when release-1c enforcement operational reporting is disabled', () => {
      const userState = createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]);

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState, release1cReportingDisabled)).toEqual([]);
    });

    it('should skip Reports when release-1c enforcement operational reporting is disabled', () => {
      const userState = createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]);

      expect(getFirstAccessibleDashboardType(navigationItems, userState, release1cReportingDisabled)).toBe(
        DASHBOARD_PAGE_DEFAULT_TAB,
      );
    });
  });

  describe('getDashboardLandingType', () => {
    it('should prefer the configured landing priority over navigation order', () => {
      const userState = createUserStateWithPermissions([SEARCH_PERMISSIONS[0], ACCOUNTS_PERMISSIONS[0]]);

      expect(getDashboardLandingType(navigationItems, userState)).toBe('search');
    });

    it('should fall back to the first accessible navigation item when no priority section is available', () => {
      const financeItems: readonly INavigationBarConfiguration[] = [{ key: 'finance', value: 'Finance' }];

      expect(getDashboardLandingType(financeItems, null)).toBe('finance');
    });

    it('should fall back to the default dashboard tab when there are no accessible items', () => {
      expect(getDashboardLandingType([], createUserStateWithPermissions([]))).toBe(DASHBOARD_PAGE_DEFAULT_TAB);
    });

    it('should land on Finance instead of Reports when release-1c enforcement operational reporting is disabled', () => {
      const navigationItemsWithFinance: readonly INavigationBarConfiguration[] = [
        { key: 'reports', value: 'Reports' },
        { key: 'finance', value: 'Finance' },
      ];

      expect(
        getDashboardLandingType(
          navigationItemsWithFinance,
          createUserStateWithPermissions([REPORTS_PERMISSIONS[0]]),
          release1cReportingDisabled,
        ),
      ).toBe('finance');
    });

    it('should skip Accounts landing for draft-only users when release-1a is disabled', () => {
      const navigationItemsWithFinance: readonly INavigationBarConfiguration[] = [
        { key: 'accounts', value: 'Accounts' },
        { key: 'finance', value: 'Finance' },
      ];

      expect(
        getDashboardLandingType(
          navigationItemsWithFinance,
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]),
          release1aDisabledWithWriteOffEnabled,
        ),
      ).toBe('finance');
    });

    it('should skip Accounts landing for consolidation-only users when release-1c-write-off is disabled', () => {
      const navigationItemsWithFinance: readonly INavigationBarConfiguration[] = [
        { key: 'accounts', value: 'Accounts' },
        { key: 'finance', value: 'Finance' },
      ];

      expect(
        getDashboardLandingType(
          navigationItemsWithFinance,
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]),
          release1aEnabledWithWriteOffDisabled,
        ),
      ).toBe('finance');
    });
  });

  describe('filterDashboardConfigByFeatureFlags', () => {
    it('should keep feature flag dashboard groups when the matching releases are enabled', () => {
      expect(filterDashboardConfigByFeatureFlags(DASHBOARD_PAGE_CONFIGURATION_MAP.accounts, allReleaseFlagsEnabled)).toEqual(
        DASHBOARD_PAGE_CONFIGURATION_MAP.accounts,
      );
    });

    it('should remove draft Accounts dashboard groups when release-1a is disabled', () => {
      const filteredConfig = filterDashboardConfigByFeatureFlags(
        DASHBOARD_PAGE_CONFIGURATION_MAP.accounts,
        release1aDisabledWithWriteOffEnabled,
      );

      expect(filteredConfig.groups.map((group) => group.id)).not.toContain('draft-accounts');
    });

    it('should remove account management dashboard groups when release-1c-write-off is disabled', () => {
      const filteredConfig = filterDashboardConfigByFeatureFlags(
        DASHBOARD_PAGE_CONFIGURATION_MAP.accounts,
        release1aEnabledWithWriteOffDisabled,
      );

      expect(filteredConfig.groups.map((group) => group.id)).not.toContain('account-management');
    });

    it('should keep Reports dashboard content when release-1c enforcement operational reporting is enabled', () => {
      expect(
        filterDashboardConfigByFeatureFlags(DASHBOARD_PAGE_CONFIGURATION_MAP.reports, release1cReportingEnabled),
      ).toEqual(DASHBOARD_PAGE_CONFIGURATION_MAP.reports);
    });

    it('should remove Reports dashboard content when release-1c enforcement operational reporting is disabled', () => {
      expect(
        filterDashboardConfigByFeatureFlags(DASHBOARD_PAGE_CONFIGURATION_MAP.reports, release1cReportingDisabled),
      ).toEqual({
        ...DASHBOARD_PAGE_CONFIGURATION_MAP.reports,
        highlights: [],
        groups: [],
      });
    });
  });
});
