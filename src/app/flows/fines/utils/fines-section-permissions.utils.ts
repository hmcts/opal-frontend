import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS } from '../constants/fines-primary-navigation-section-permissions.constant';

const DASHBOARD_LANDING_PRIORITY: DashboardPageType[] = ['search', 'accounts', 'reports'];

export const getUserPermissionIds = (userState?: IOpalUserState | null): number[] => {
  const permissionIds = (userState?.business_unit_users ?? []).flatMap((businessUnitUser) =>
    businessUnitUser.permissions.map((permission) => permission.permission_id),
  );

  return [...new Set(permissionIds)];
};

export const hasAnyPermission = (
  requiredPermissionIds: readonly number[],
  userPermissionIds: readonly number[],
): boolean => requiredPermissionIds.some((permissionId) => userPermissionIds.includes(permissionId));

export const canAccessFinesPrimaryNavigationSection = (
  sectionKey: DashboardPageType,
  userState?: IOpalUserState | null,
): boolean => {
  const requiredPermissionIds = FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS[sectionKey];

  if (!requiredPermissionIds?.length) {
    return true;
  }

  return hasAnyPermission(requiredPermissionIds, getUserPermissionIds(userState));
};

export const getAccessiblePrimaryNavigationItems = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
): INavigationBarConfiguration[] =>
  navigationItems.filter((navigationItem) => canAccessFinesPrimaryNavigationSection(navigationItem.key, userState));

export const getFirstAccessibleDashboardType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
): DashboardPageType =>
  getAccessiblePrimaryNavigationItems(navigationItems, userState)[0]?.key ?? DASHBOARD_PAGE_DEFAULT_TAB;

export const getDashboardLandingType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
): DashboardPageType => {
  const accessibleNavigationItems = getAccessiblePrimaryNavigationItems(navigationItems, userState);
  const accessibleNavigationKeys = new Set(accessibleNavigationItems.map((navigationItem) => navigationItem.key));

  return (
    DASHBOARD_LANDING_PRIORITY.find((dashboardType) => accessibleNavigationKeys.has(dashboardType)) ??
    accessibleNavigationItems[0]?.key ??
    DASHBOARD_PAGE_DEFAULT_TAB
  );
};
