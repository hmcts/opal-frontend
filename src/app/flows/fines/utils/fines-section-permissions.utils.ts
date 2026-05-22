import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS } from '../constants/fines-primary-navigation-section-permissions.constant';
import { type IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';

const DASHBOARD_LANDING_PRIORITY: DashboardPageType[] = ['search', 'accounts', 'reports'];
export const RELEASE_1A_FEATURE_FLAG = 'release-1a' as const;

type FeatureFlags = Record<string, unknown>;
export interface IFeatureFlagReleaseState {
  [RELEASE_1A_FEATURE_FLAG]: boolean;
}

export type FeatureFlagReleaseState = Partial<IFeatureFlagReleaseState>;

export interface IFeatureFlagReleasePermissions {
  [RELEASE_1A_FEATURE_FLAG]: readonly number[];
}

export interface IFeatureFlagReleaseDashboardGroups {
  [RELEASE_1A_FEATURE_FLAG]: readonly string[];
}

type FeatureFlagReleaseName = keyof IFeatureFlagReleaseState;
type FeatureFlagReleasePermissionsBySection = Partial<
  Record<DashboardPageType, Partial<Record<FeatureFlagReleaseName, readonly number[]>>>
>;

export const FEATURE_FLAG_RELEASE_PERMISSIONS: IFeatureFlagReleasePermissions = {
  [RELEASE_1A_FEATURE_FLAG]: [
    FINES_PERMISSIONS['create-and-manage-draft-accounts'],
    FINES_PERMISSIONS['check-and-validate-draft-accounts'],
  ],
};

export const FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS: IFeatureFlagReleaseDashboardGroups = {
  [RELEASE_1A_FEATURE_FLAG]: ['draft-accounts'],
};

const FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS: FeatureFlagReleasePermissionsBySection = {
  accounts: {
    [RELEASE_1A_FEATURE_FLAG]: FEATURE_FLAG_RELEASE_PERMISSIONS[RELEASE_1A_FEATURE_FLAG],
  },
};

const getDisabledFeatureFlagValues = <T>(
  featureFlagValues: Partial<Record<FeatureFlagReleaseName, readonly T[]>>,
  featureFlagReleaseState: FeatureFlagReleaseState,
): readonly T[] =>
  (Object.keys(featureFlagValues) as FeatureFlagReleaseName[]).flatMap((featureFlagReleaseName) =>
    featureFlagReleaseState[featureFlagReleaseName] ? [] : (featureFlagValues[featureFlagReleaseName] ?? []),
  );

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

export const getFeatureFlagReleaseState = (featureFlags?: FeatureFlags | null): FeatureFlagReleaseState => ({
  [RELEASE_1A_FEATURE_FLAG]: featureFlags?.[RELEASE_1A_FEATURE_FLAG] === true,
});

export const getRequiredPermissionIdsForSection = (
  sectionKey: DashboardPageType,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): readonly number[] | undefined => {
  const requiredPermissionIds = FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS[sectionKey];

  if (!requiredPermissionIds) {
    return undefined;
  }

  const disabledFeatureFlagPermissionIds = getDisabledFeatureFlagValues(
    FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS[sectionKey] ?? {},
    featureFlagReleaseState,
  );

  if (!disabledFeatureFlagPermissionIds.length) {
    return requiredPermissionIds;
  }

  return requiredPermissionIds.filter((permissionId) => !disabledFeatureFlagPermissionIds.includes(permissionId));
};

export const canAccessFinesPrimaryNavigationSection = (
  sectionKey: DashboardPageType,
  userState?: IOpalUserState | null,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): boolean => {
  const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, featureFlagReleaseState);

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
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): INavigationBarConfiguration[] =>
  navigationItems.filter((navigationItem) =>
    canAccessFinesPrimaryNavigationSection(navigationItem.key, userState, featureFlagReleaseState),
  );

export const getFirstAccessibleDashboardType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): DashboardPageType =>
  getAccessiblePrimaryNavigationItems(navigationItems, userState, featureFlagReleaseState)[0]?.key ??
  DASHBOARD_PAGE_DEFAULT_TAB;

export const getDashboardLandingType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): DashboardPageType => {
  const accessibleNavigationItems = getAccessiblePrimaryNavigationItems(
    navigationItems,
    userState,
    featureFlagReleaseState,
  );
  const accessibleNavigationKeys = new Set(accessibleNavigationItems.map((navigationItem) => navigationItem.key));

  return (
    DASHBOARD_LANDING_PRIORITY.find((dashboardType) => accessibleNavigationKeys.has(dashboardType)) ??
    accessibleNavigationItems[0]?.key ??
    DASHBOARD_PAGE_DEFAULT_TAB
  );
};

export const filterDashboardConfigByFeatureFlags = (
  config: IDashboardPageConfiguration,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): IDashboardPageConfiguration => {
  const disabledDashboardGroupIds = getDisabledFeatureFlagValues(
    FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS,
    featureFlagReleaseState,
  );

  if (!disabledDashboardGroupIds.length) {
    return config;
  }

  const groups = config.groups.filter((group) => !disabledDashboardGroupIds.includes(group.id));

  return groups.length === config.groups.length ? config : { ...config, groups };
};
