import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { NAVIGATION_BAR_CONFIGURATION } from '@app/constants/navigation-bar-configuration.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { catchError, map, of } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { getDashboardLandingType } from '@app/flows/fines/utils/fines-section-permissions.utils';

const getDefaultDashboardType = () => getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION);

const buildDashboardUrlTree = (router: Router, dashboardType: string): UrlTree =>
  router.createUrlTree(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType]);

/**
 * Resolves the first accessible dashboard tab shown when entering `/fines/dashboard`.
 */
export const dashboardLandingGuard: CanActivateFn = () => {
  const opalUserService = inject(OpalUserService);
  const router = inject(Router);

  return opalUserService.getLoggedInUserState().pipe(
    map((userState) => buildDashboardUrlTree(router, getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION, userState))),
    catchError(() => of(buildDashboardUrlTree(router, getDefaultDashboardType()))),
  );
};
