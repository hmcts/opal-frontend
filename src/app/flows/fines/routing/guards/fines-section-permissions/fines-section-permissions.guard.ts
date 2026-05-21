import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {
  getRequiredPermissionIdsForSection,
  getUserPermissionIds,
  hasAnyPermission,
  RELEASE_1A_FEATURE_FLAG,
} from '@app/flows/fines/utils/fines-section-permissions.utils';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
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

  const checkSectionPermissions = async (isRelease1aEnabled: boolean): Promise<boolean | UrlTree> => {
    const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, isRelease1aEnabled);

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

  const isRelease1aEnabled =
    sectionKey === 'accounts' ? await resolveFeatureFlagGuard(RELEASE_1A_FEATURE_FLAG, route, state) : false;

  return checkSectionPermissions(isRelease1aEnabled);
};
