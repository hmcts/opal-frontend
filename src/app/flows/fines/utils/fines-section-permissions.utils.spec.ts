import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { OPAL_USER_STATE_MOCK } from '@hmcts/opal-frontend-common/services/opal-user-service/mocks';
import { ACCOUNTS_PERMISSIONS } from '../constants/accounts-permissions.constant';
import { SEARCH_PERMISSIONS } from '../constants/search-permissions.constant';
import {
  canAccessFinesPrimaryNavigationSection,
  getAccessiblePrimaryNavigationItems,
  getDashboardLandingType,
  getFirstAccessibleDashboardType,
  getUserPermissionIds,
  hasAnyPermission,
} from './fines-section-permissions.utils';
import { describe, expect, it } from 'vitest';

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
    it('should allow unrestricted dashboard sections', () => {
      expect(canAccessFinesPrimaryNavigationSection('finance', null)).toBe(true);
    });

    it('should deny restricted sections when the user lacks permissions', () => {
      expect(canAccessFinesPrimaryNavigationSection('search', createUserStateWithPermissions([]))).toBe(false);
    });
  });

  describe('getAccessiblePrimaryNavigationItems', () => {
    it('should filter navigation items down to the sections the user can access', () => {
      const userState = createUserStateWithPermissions([SEARCH_PERMISSIONS[0]]);

      expect(getAccessiblePrimaryNavigationItems(navigationItems, userState)).toEqual([
        { key: 'search', value: 'Search' },
      ]);
    });
  });

  describe('getFirstAccessibleDashboardType', () => {
    it('should return the first accessible navigation key', () => {
      const userState = createUserStateWithPermissions([SEARCH_PERMISSIONS[0]]);

      expect(getFirstAccessibleDashboardType(navigationItems, userState)).toBe('search');
    });

    it('should fall back to the default dashboard tab when nothing is accessible', () => {
      expect(getFirstAccessibleDashboardType(navigationItems, createUserStateWithPermissions([]))).toBe(
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
  });
});
