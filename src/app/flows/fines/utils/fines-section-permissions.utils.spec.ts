import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { ACCOUNTS_PERMISSIONS } from '../constants/accounts-permissions.constant';
import { REPORTS_PERMISSIONS } from '../constants/reports-permissions.constant';
import { SEARCH_PERMISSIONS } from '../constants/search-permissions.constant';
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
  const release1cReportingEnabled = { 'release-1c-enforcement-operational-reporting': true };
  const release1cReportingDisabled = { 'release-1c-enforcement-operational-reporting': false };

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
    it('should allow unrestricted dashboard sections', () => {
      expect(canAccessFinesPrimaryNavigationSection('finance', null)).toBe(true);
    });

    it('should deny restricted sections when the user lacks permissions', () => {
      expect(canAccessFinesPrimaryNavigationSection('search', createUserStateWithPermissions([]))).toBe(false);
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
  });

  describe('getFeatureFlagReleaseState', () => {
    it('should map raw feature flags into a release feature flag state', () => {
      expect(getFeatureFlagReleaseState({ 'release-1a': true })).toEqual({
        'release-1a': true,
        'release-1c-enforcement-operational-reporting': false,
      });
      expect(
        getFeatureFlagReleaseState({
          'release-1c-enforcement-operational-reporting': true,
        }),
      ).toEqual({
        'release-1a': false,
        'release-1c-enforcement-operational-reporting': true,
      });
      expect(getFeatureFlagReleaseState({})).toEqual({
        'release-1a': false,
        'release-1c-enforcement-operational-reporting': false,
      });
    });
  });

  describe('getRequiredPermissionIdsForSection', () => {
    it('should return Reports permissions when release-1c enforcement operational reporting is enabled', () => {
      expect(getRequiredPermissionIdsForSection('reports', release1cReportingEnabled)).toEqual(REPORTS_PERMISSIONS);
    });

    it('should remove Reports permissions when release-1c enforcement operational reporting is disabled', () => {
      expect(getRequiredPermissionIdsForSection('reports', release1cReportingDisabled)).toEqual([]);
    });
  });

  describe('filterDashboardConfigByFeatureFlags', () => {
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
