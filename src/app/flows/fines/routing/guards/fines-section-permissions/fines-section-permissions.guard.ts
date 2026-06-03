import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
  getRequiredPermissionIdsForSection,
  getUserPermissionIds,
  hasAnyPermission,
} from '@app/flows/fines/utils/fines-section-permissions.utils';
import { FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS } from '@app/flows/fines/constants/feature-flag-section-permission-exclusions.constant';
import { type FeatureFlagReleaseName } from '@app/flows/fines/types/feature-flag-release-name.type';
import { type FeatureFlagReleaseState } from '@app/flows/fines/types/feature-flag-release-state.type';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { firstValueFrom } from 'rxjs';
import { resolveFeatureFlagReleaseState } from '../helpers/resolve-feature-flag-release-state.helper';

const getSectionKey = (route: ActivatedRouteSnapshot): DashboardPageType | null => {
  const routeSectionKey = route.data['sectionKey'];

  if (typeof routeSectionKey === 'string' && isDashboardPageType(routeSectionKey)) {
    return routeSectionKey;
  }

  const dashboardType = route.paramMap.get('dashboardType');

  if (dashboardType && isDashboardPageType(dashboardType)) {
    return dashboardType;
  }

  return null;
};

const getSectionReleaseFeatureFlags = (sectionKey: DashboardPageType): FeatureFlagReleaseName[] =>
  Object.keys(FEATURE_FLAG_SECTION_PERMISSION_EXCLUSIONS[sectionKey] ?? {}) as FeatureFlagReleaseName[];

export const finesSectionPermissionsGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const opalUserService = inject(OpalUserService);
  const sectionKey = getSectionKey(route);

  if (!sectionKey) {
    return true;
  }

  const getAccessDeniedUrlTree = () => router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);

  const checkSectionPermissions = async (
    featureFlagReleaseState: FeatureFlagReleaseState,
  ): Promise<boolean | UrlTree> => {
    const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, featureFlagReleaseState);

    if (!requiredPermissionIds) {
      return true;
    }

    if (requiredPermissionIds.length === 0) {
      return getAccessDeniedUrlTree();
    }

    try {
      const userState = await firstValueFrom(opalUserService.getLoggedInUserState());

      return hasAnyPermission(requiredPermissionIds, getUserPermissionIds(userState)) ? true : getAccessDeniedUrlTree();
    } catch {
      return false;
    }
  };

  const featureFlagReleaseState = await resolveFeatureFlagReleaseState(
    getSectionReleaseFeatureFlags(sectionKey),
    route,
    state,
  );

  return checkSectionPermissions(featureFlagReleaseState);
};
