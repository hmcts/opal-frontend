import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { catchError, map, of } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

const getDefaultDashboardType = (permissionIds: number[]): string => {
  /**
   * Search is the default landing area after successful login.
   * The Search route is permission-guarded (`search-and-view-accounts`), and OPAL Fines currently assumes all users receive this permission.
   * If that assumption changes, this login redirect decision should be revisited to avoid routing users to Access Denied.
   */
  if (permissionIds.includes(FINES_PERMISSIONS['search-and-view-accounts'])) {
    return FINES_DASHBOARD_ROUTING_PATHS.children.search;
  }

  return FINES_DASHBOARD_ROUTING_PATHS.children.accounts;
};

const buildDashboardUrlTree = (router: Router, dashboardType: string): UrlTree =>
  router.createUrlTree(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType]);

/**
 * Resolves the first dashboard tab shown when entering `/fines/dashboard`.
 * Search remains the default for users with the search permission.
 * Users without that permission are directed to Accounts to avoid access-denied on landing.
 */
export const dashboardLandingGuard: CanActivateFn = () => {
  const opalUserService = inject(OpalUserService);
  const permissionsService = inject(PermissionsService);
  const router = inject(Router);

  return opalUserService.getLoggedInUserState().pipe(
    map((userState) => {
      const permissionIds = permissionsService.getUniquePermissions(userState);
      const dashboardType = getDefaultDashboardType(permissionIds);
      return buildDashboardUrlTree(router, dashboardType);
    }),
    catchError(() => of(buildDashboardUrlTree(router, FINES_DASHBOARD_ROUTING_PATHS.children.accounts))),
  );
};
