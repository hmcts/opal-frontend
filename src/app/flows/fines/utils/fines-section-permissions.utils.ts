import { INavigationBarConfiguration } from '@app/interfaces/navigation-bar-configuration.interface';
import { DASHBOARD_PAGE_DEFAULT_TAB } from '@app/pages/dashboard/constants/dashboard-config-default-tab.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { IOpalUserState } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';
import { FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS } from '../constants/fines-primary-navigation-section-permissions.constant';
import { type IDashboardPageConfiguration } from '@hmcts/opal-frontend-common/pages/dashboard-page/interfaces';
import { FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS } from '../constants/feature-flag-release-dashboard-groups.constant';
import { FEATURE_FLAG_RELEASE_DASHBOARD_HIGHLIGHTS } from '../constants/feature-flag-release-dashboard-highlights.constant';
import { FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS } from '../constants/feature-flag-section-permission-exclusions.constant';
import { RELEASE_FEATURE_FLAGS } from '../constants/release-feature-flags.constant';
import { type FeatureFlagReleaseName } from '../types/feature-flag-release-name.type';
import { type FeatureFlagReleaseState } from '../types/feature-flag-release-state.type';

const DASHBOARD_LANDING_PRIORITY: DashboardPageType[] = ['search', 'accounts', 'reports'];

type FeatureFlags = Record<string, unknown>;

/**
 * Collects the values associated with release flags that are currently disabled.
 *
 * @typeParam T - The item type stored under each release flag key.
 * @param featureFlagValues - Values grouped by release flag name.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The values for all disabled release flags, flattened into a single list.
 */
const getDisabledFeatureFlagValues = <T>(
  featureFlagValues: Partial<Record<FeatureFlagReleaseName, readonly T[]>>,
  featureFlagReleaseState: FeatureFlagReleaseState,
): readonly T[] =>
  (Object.keys(featureFlagValues) as FeatureFlagReleaseName[]).flatMap((featureFlagReleaseName) =>
    featureFlagReleaseState[featureFlagReleaseName] ? [] : (featureFlagValues[featureFlagReleaseName] ?? []),
  );

/**
 * Returns the unique permission IDs assigned to the logged-in user across their business units.
 *
 * @param userState - The logged-in user's state, including business units and permissions.
 * @returns A deduplicated list of permission IDs, or an empty array when no user state is available.
 */
export const getUserPermissionIds = (userState?: IOpalUserState | null): number[] => {
  const permissionIds = (userState?.business_unit_users ?? []).flatMap((businessUnitUser) =>
    businessUnitUser.permissions.map((permission) => permission.permission_id),
  );

  return [...new Set(permissionIds)];
};

/**
 * Checks whether the user has at least one of the permission IDs required for a section or action.
 *
 * @param requiredPermissionIds - The permission IDs needed to access the section or action.
 * @param userPermissionIds - The permission IDs assigned to the user.
 * @returns True when the user has at least one required permission; otherwise false.
 */
export const hasAnyPermission = (
  requiredPermissionIds: readonly number[],
  userPermissionIds: readonly number[],
): boolean => requiredPermissionIds.some((permissionId) => userPermissionIds.includes(permissionId));

/**
 * Converts raw feature flag values into the release flag state used by fines permission helpers.
 *
 * @param featureFlags - The raw feature flag values from the global store.
 * @returns The release flag state used to apply release-specific permission and dashboard rules.
 */
export const getFeatureFlagReleaseState = (featureFlags?: FeatureFlags | null): FeatureFlagReleaseState => {
  const featureFlagReleaseState: FeatureFlagReleaseState = {};

  for (const releaseFeatureFlag of RELEASE_FEATURE_FLAGS) {
    featureFlagReleaseState[releaseFeatureFlag] = featureFlags?.[releaseFeatureFlag] === true;
  }

  return featureFlagReleaseState;
};

/**
 * Returns the permission IDs required for a dashboard section, excluding permissions for disabled release flags.
 *
 * @param sectionKey - The dashboard section being checked.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The permission IDs required for the section, or undefined when the section has no permission restriction.
 */
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

/**
 * Checks whether the user can access a fines primary navigation section after permissions and release flags are applied.
 *
 * @param sectionKey - The primary navigation section being checked.
 * @param userState - The logged-in user's state, including business units and permissions.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns True when the section is unrestricted or the user has a required permission; otherwise false.
 */
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

/**
 * Filters the fines primary navigation to only the sections the user can access.
 *
 * @param navigationItems - The full list of fines primary navigation items.
 * @param userState - The logged-in user's state, including business units and permissions.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The navigation items available to the user.
 */
export const getAccessiblePrimaryNavigationItems = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): INavigationBarConfiguration[] =>
  navigationItems.filter((navigationItem) =>
    canAccessFinesPrimaryNavigationSection(navigationItem.key, userState, featureFlagReleaseState),
  );

/**
 * Returns the first dashboard type the user can access, or the default tab when none are available.
 *
 * @param navigationItems - The full list of fines primary navigation items.
 * @param userState - The logged-in user's state, including business units and permissions.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The first accessible dashboard type, or the default dashboard tab when no accessible section exists.
 */
export const getFirstAccessibleDashboardType = (
  navigationItems: readonly INavigationBarConfiguration[],
  userState?: IOpalUserState | null,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): DashboardPageType =>
  getAccessiblePrimaryNavigationItems(navigationItems, userState, featureFlagReleaseState)[0]?.key ??
  DASHBOARD_PAGE_DEFAULT_TAB;

/**
 * Resolves the dashboard tab to land on, using accessible sections and the configured landing priority.
 *
 * @param navigationItems - The full list of fines primary navigation items.
 * @param userState - The logged-in user's state, including business units and permissions.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The dashboard tab the user should land on.
 */
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

/**
 * Removes dashboard groups that belong to disabled release flags.
 *
 * @param config - The dashboard page configuration to filter.
 * @param featureFlagReleaseState - The current enabled or disabled state of release feature flags.
 * @returns The original dashboard configuration, or a copy with disabled release groups removed.
 */
export const filterDashboardConfigByFeatureFlags = (
  config: IDashboardPageConfiguration,
  featureFlagReleaseState: FeatureFlagReleaseState = {},
): IDashboardPageConfiguration => {
  const disabledDashboardHighlightIds = getDisabledFeatureFlagValues(
    FEATURE_FLAG_RELEASE_DASHBOARD_HIGHLIGHTS,
    featureFlagReleaseState,
  );
  const disabledDashboardGroupIds = getDisabledFeatureFlagValues(
    FEATURE_FLAG_RELEASE_DASHBOARD_GROUPS,
    featureFlagReleaseState,
  );

  if (!disabledDashboardHighlightIds.length && !disabledDashboardGroupIds.length) {
    return config;
  }

  const highlights = config.highlights.filter((highlight) => !disabledDashboardHighlightIds.includes(highlight.id));
  const groups = config.groups.filter((group) => !disabledDashboardGroupIds.includes(group.id));

  return highlights.length === config.highlights.length && groups.length === config.groups.length
    ? config
    : { ...config, highlights, groups };
};
