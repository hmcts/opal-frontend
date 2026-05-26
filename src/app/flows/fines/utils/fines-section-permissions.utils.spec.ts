import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { ACCOUNTS_PERMISSIONS } from '../constants/accounts-permissions.constant';
import { SEARCH_PERMISSIONS } from '../constants/search-permissions.constant';
import {
  canAccessFinesPrimaryNavigationSection,
  filterDashboardConfigByFeatureFlags,
  getAccessiblePrimaryNavigationItems,
  getDashboardLandingType,
  getFeatureFlagReleaseState,
  getUserPermissionIds,
  hasAnyPermission,
} from './fines-section-permissions.utils';
import { describe, expect, it } from 'vitest';
import { DASHBOARD_PAGE_CONFIGURATION_MAP } from '@app/pages/dashboard/constants/dashboard-config.constant';

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
    { key: 'accounts', value: 'Accounts' },
    { key: 'reports', value: 'Reports' },
    { key: 'search', value: 'Search' },
  ];

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

  describe('canAccessFinesPrimaryNavigationSection', () => {
    const release1aEnabled = { 'release-1a': true };
    const release1aDisabled = { 'release-1a': false };

    it('should allow unrestricted dashboard sections', () => {
      expect(canAccessFinesPrimaryNavigationSection('finance', null)).toBe(true);
    });

    it('should deny restricted sections when the user lacks permissions', () => {
      expect(canAccessFinesPrimaryNavigationSection('search', createUserStateWithPermissions([]))).toBe(false);
    });

    it('should allow Accounts with draft permissions when release-1a is enabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]),
          release1aEnabled,
        ),
      ).toBe(true);
    });

    it('should deny Accounts with draft-only permissions when release-1a is disabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]),
          release1aDisabled,
        ),
      ).toBe(false);
    });

    it('should allow Accounts with consolidation permissions when release-1a is disabled', () => {
      expect(
        canAccessFinesPrimaryNavigationSection(
          'accounts',
          createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[2]]),
          release1aDisabled,
        ),
      ).toBe(true);
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

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState, { 'release-1a': false })).toEqual([]);
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

    it('should skip Accounts landing for draft-only users when release-1a is disabled', () => {
      const navigationItemsWithFinance: readonly INavigationBarConfiguration[] = [
        { key: 'accounts', value: 'Accounts' },
        { key: 'finance', value: 'Finance' },
      ];

      expect(
        getDashboardLandingType(navigationItemsWithFinance, createUserStateWithPermissions([ACCOUNTS_PERMISSIONS[0]]), {
          'release-1a': false,
        }),
      ).toBe('finance');
    });
  });

  describe('getFeatureFlagReleaseState', () => {
    it('should map raw feature flags into a release feature flag state', () => {
      expect(getFeatureFlagReleaseState({ 'release-1a': true })).toEqual({ 'release-1a': true });
      expect(getFeatureFlagReleaseState({ 'release-1a': false })).toEqual({ 'release-1a': false });
      expect(getFeatureFlagReleaseState({})).toEqual({ 'release-1a': false });
    });
  });

  describe('filterDashboardConfigByFeatureFlags', () => {
    it('should keep feature flag dashboard groups when the matching release is enabled', () => {
      expect(
        filterDashboardConfigByFeatureFlags(DASHBOARD_PAGE_CONFIGURATION_MAP.accounts, { 'release-1a': true }),
      ).toEqual(DASHBOARD_PAGE_CONFIGURATION_MAP.accounts);
    });

    it('should remove feature flag dashboard groups when the matching release is disabled', () => {
      expect(
        filterDashboardConfigByFeatureFlags(DASHBOARD_PAGE_CONFIGURATION_MAP.accounts, {
          'release-1a': false,
        }).groups.map((group) => group.id),
      ).not.toContain('draft-accounts');
    });
  });
});
