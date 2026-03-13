import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { isDashboardPageType } from '@app/pages/dashboard/constants/dashboard-config.constant';
import { FINES_ROUTING_PATHS } from '../../constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

/**
 * Ensures only supported dashboard route params are allowed. Unknown types
 * are redirected to `/fines/dashboard` so dashboard landing logic can
 * resolve an appropriate permitted tab.
 */
export const dashboardTypeGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const dashboardType = route.paramMap.get('dashboardType');

  if (dashboardType && isDashboardPageType(dashboardType)) {
    return true;
  }

  return inject(Router).createUrlTree(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root]);
};
