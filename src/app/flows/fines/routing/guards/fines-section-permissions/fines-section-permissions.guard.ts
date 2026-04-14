import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS } from '@app/flows/fines/constants/fines-primary-navigation-section-permissions.constant';
import { getUserPermissionIds, hasAnyPermission } from '@app/flows/fines/utils/fines-section-permissions.utils';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { DashboardPageType } from '@app/pages/dashboard/types/dashboard.type';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { catchError, map, Observable, of } from 'rxjs';

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
  const sectionKey = getSectionKey(route);
  const requiredPermissionIds = sectionKey ? FINES_PRIMARY_NAVIGATION_SECTION_PERMISSIONS[sectionKey] : undefined;

  if (!requiredPermissionIds?.length) {
    return true;
  }

  return opalUserService.getLoggedInUserState().pipe(
    map((userState) =>
      hasAnyPermission(requiredPermissionIds, getUserPermissionIds(userState))
        ? true
        : router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]),
    ),
    catchError(() => of(false)),
  );
};
