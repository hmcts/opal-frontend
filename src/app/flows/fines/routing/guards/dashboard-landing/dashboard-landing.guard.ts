import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { NAVIGATION_BAR_CONFIGURATION } from '@app/constants/navigation-bar-configuration.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import {
  getDashboardLandingType,
  isRelease1aFeatureFlagPopulated,
} from '@app/flows/fines/utils/fines-section-permissions.utils';

const getDefaultDashboardType = (featureFlags: Record<string, unknown>) =>
  getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION, null, featureFlags);

const buildDashboardUrlTree = (router: Router, dashboardType: string): UrlTree =>
  router.createUrlTree(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType]);

/**
 * Resolves the first accessible dashboard tab shown when entering `/fines/dashboard`.
 */
export const dashboardLandingGuard: CanActivateFn = () => {
  const opalUserService = inject(OpalUserService);
  const globalStore = inject(GlobalStore);
  const launchDarklyService = inject(LaunchDarklyService);
  const router = inject(Router);
  const initializeFeatureFlagsIfNeeded = () =>
    isRelease1aFeatureFlagPopulated(globalStore.featureFlags())
      ? of(undefined)
      : from(launchDarklyService.initializeLaunchDarklyFlags()).pipe(catchError(() => of(undefined)));

  return initializeFeatureFlagsIfNeeded().pipe(
    switchMap(() => opalUserService.getLoggedInUserState()),
    map((userState) =>
      buildDashboardUrlTree(
        router,
        getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION, userState, globalStore.featureFlags()),
      ),
    ),
    catchError(() => of(buildDashboardUrlTree(router, getDefaultDashboardType(globalStore.featureFlags())))),
  );
};
