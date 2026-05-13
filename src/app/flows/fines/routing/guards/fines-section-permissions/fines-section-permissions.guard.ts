import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import {
  getRequiredPermissionIdsForSection,
  getUserPermissionIds,
  hasAnyPermission,
  isRelease1aFeatureFlagPopulated,
} from '@app/flows/fines/utils/fines-section-permissions.utils';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

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

export const finesSectionPermissionsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const opalUserService = inject(OpalUserService);
  const globalStore = inject(GlobalStore);
  const launchDarklyService = inject(LaunchDarklyService);
  const sectionKey = getSectionKey(route);

  if (!sectionKey) {
    return true;
  }

  const getAccessDeniedUrlTree = () => router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);

  const checkSectionPermissions = (): Observable<boolean | UrlTree> => {
    const requiredPermissionIds = getRequiredPermissionIdsForSection(sectionKey, globalStore.featureFlags());

    if (!requiredPermissionIds) {
      return of(true);
    }

    if (requiredPermissionIds.length === 0) {
      return of(getAccessDeniedUrlTree());
    }

    return opalUserService.getLoggedInUserState().pipe(
      map((userState) =>
        hasAnyPermission(requiredPermissionIds, getUserPermissionIds(userState)) ? true : getAccessDeniedUrlTree(),
      ),
      catchError(() => of(false)),
    );
  };

  if (sectionKey !== 'accounts' || isRelease1aFeatureFlagPopulated(globalStore.featureFlags())) {
    return checkSectionPermissions();
  }

  return from(launchDarklyService.initializeLaunchDarklyFlags()).pipe(
    catchError(() => of(undefined)),
    switchMap(() => checkSectionPermissions()),
  );
};
