import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS } from '../constants/fines-primary-navigation-section-permissions.constant';

const DASHBOARD_LANDING_PRIORITY: DashboardPageType[] = ['search', 'accounts', 'reports'];
export const RELEASE_1A_FEATURE_FLAG = 'release-1a';

type FeatureFlags = Record<string, unknown>;

const RELEASE_1A_ACCOUNTS_PERMISSION_IDS: readonly number[] = [
  FINES_PERMISSIONS['create-and-manage-draft-accounts'],
  FINES_PERMISSIONS['check-and-validate-draft-accounts'],
];

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

export const isRelease1aFeatureFlagPopulated = (featureFlags?: FeatureFlags | null): boolean =>
  featureFlags?.[RELEASE_1A_FEATURE_FLAG] !== undefined;

export const isRelease1aFeatureEnabled = (featureFlags?: FeatureFlags | null): boolean =>
  featureFlags?.[RELEASE_1A_FEATURE_FLAG] === true;

export const getRequiredPermissionIdsForSection = (
  sectionKey: DashboardPageType,
  featureFlags?: FeatureFlags | null,
): readonly number[] | undefined => {
  const requiredPermissionIds = FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS[sectionKey];

  if (sectionKey !== 'accounts' || isRelease1aFeatureEnabled(featureFlags)) {
    return requiredPermissionIds;
  }

  return requiredPermissionIds?.filter((permissionId) => !RELEASE_1A_ACCOUNTS_PERMISSION_IDS.includes(permissionId));
};

export const canAccessFinesPrimaryNavigationSection = (
  sectionKey: DashboardPageType,
  userState?: IOpalUserState | null,
  featureFlags?: FeatureFlags | null,
): boolean => {
  const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, featureFlags);

  if (!requiredPermissionIds) {
    return true;
  }

  if (requiredPermissionIds.length === 0) {
    return false;
  }

  return hasAnyPermission(requiredPermissionIds, getUserPermissionIds(userState));
};

export const getAccessiblePrimaryNavigationItems = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlags?: FeatureFlags | null,
): INavigationBarConfiguration[] =>
  navigationItems.filter((navigationItem) =>
    canAccessFinesPrimaryNavigationSection(navigationItem.key, userState, featureFlags),
  );

export const getFirstAccessibleDashboardType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlags?: FeatureFlags | null,
): DashboardPageType =>
  getAccessiblePrimaryNavigationItems(navigationItems, userState, featureFlags)[0]?.key ?? DASHBOARD_PAGE_DEFAULT_TAB;

export const getDashboardLandingType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlags?: FeatureFlags | null,
): DashboardPageType => {
  const accessibleNavigationItems = getAccessiblePrimaryNavigationItems(navigationItems, userState, featureFlags);
  const accessibleNavigationKeys = new Set(accessibleNavigationItems.map((navigationItem) => navigationItem.key));

  return (
    DASHBOARD_LANDING_PRIORITY.find((dashboardType) => accessibleNavigationKeys.has(dashboardType)) ??
    accessibleNavigationItems[0]?.key ??
    DASHBOARD_PAGE_DEFAULT_TAB
  );
};
