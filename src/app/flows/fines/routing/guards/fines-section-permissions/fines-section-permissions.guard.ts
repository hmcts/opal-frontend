import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
  getRequiredPermissionIdsForSection,
  getUserPermissionIds,
  hasAnyPermission,
} from '@app/flows/fines/utils/fines-section-permissions.utils';
import {
  RELEASE_1A_FEATURE_FLAG,
  RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG,
  RELEASE_1C_WRITE_OFF_FEATURE_FLAG,
} from '@app/flows/fines/constants/release-feature-flags.constant';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { type FeatureFlagReleaseState } from '@app/flows/fines/types/feature-flag-release-state.type';
import { firstValueFrom } from 'rxjs';

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

const resolveAccountsFeatureFlagReleaseState = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<FeatureFlagReleaseState> => {
  const [release1aEnabled, release1cWriteOffEnabled] = await Promise.all([
    resolveFeatureFlagGuard(RELEASE_1A_FEATURE_FLAG, route, state),
    resolveFeatureFlagGuard(RELEASE_1C_WRITE_OFF_FEATURE_FLAG, route, state),
  ]);

  return {
    [RELEASE_1A_FEATURE_FLAG]: release1aEnabled,
    [RELEASE_1C_WRITE_OFF_FEATURE_FLAG]: release1cWriteOffEnabled,
  };
};

const resolveReportsFeatureFlagReleaseState = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<FeatureFlagReleaseState> => {
  const [release1cEnforcementOperationalReportingEnabled] = await Promise.all([
    resolveFeatureFlagGuard(RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG, route, state),
  ]);

  return {
    [RELEASE_1C_ENFORCEMENT_OPERATIONAL_REPORTING_FEATURE_FLAG]: release1cEnforcementOperationalReportingEnabled,
  };
};

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

  const featureFlagReleaseState =
    sectionKey === 'accounts'
      ? await resolveAccountsFeatureFlagReleaseState(route, state)
      : sectionKey === 'reports'
        ? await resolveReportsFeatureFlagReleaseState(route, state)
        : {};
  const getAccessDeniedUrlTree = () => router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);

  const checkSectionPermissions = async (
    currentFeatureFlagReleaseState: FeatureFlagReleaseState,
  ): Promise<boolean | UrlTree> => {
    const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, currentFeatureFlagReleaseState);

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

  return checkSectionPermissions(featureFlagReleaseState);
};
