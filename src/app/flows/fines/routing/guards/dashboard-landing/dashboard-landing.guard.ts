import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { NAVIGATION_BAR_CONFIGURATION } from '@app/constants/navigation-bar-configuration.constant';
import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { firstValueFrom } from 'rxjs';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { getDashboardLandingType } from '@app/flows/fines/utils/fines-section-permissions.utils';
import { RELEASE_FEATURE_FLAGS } from '@app/flows/fines/constants/release-feature-flags.constant';
import { type FeatureFlagReleaseState } from '@app/flows/fines/types/feature-flag-release-state.type';
import { resolveFeatureFlagReleaseState } from '../helpers/resolve-feature-flag-release-state.helper';

const getDefaultDashboardType = (featureFlagReleaseState: FeatureFlagReleaseState) =>
  getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION, null, featureFlagReleaseState);

const buildDashboardUrlTree = (router: Router, dashboardType: string): UrlTree =>
  router.createUrlTree(['/', FINES_ROUTING_PATHS.root, FINES_DASHBOARD_ROUTING_PATHS.root, dashboardType]);

/**
 * Resolves the first accessible dashboard tab shown when entering `/fines/dashboard`.
 */
export const dashboardLandingGuard: CanActivateFn = async (route, state): Promise<UrlTree> => {
  const opalUserService = inject(OpalUserService);
  const router = inject(Router);
  const featureFlagReleaseState = await resolveFeatureFlagReleaseState(RELEASE_FEATURE_FLAGS, route, state);

  try {
    const userState = await firstValueFrom(opalUserService.getLoggedInUserState());

    return buildDashboardUrlTree(
      router,
      getDashboardLandingType(NAVIGATION_BAR_CONFIGURATION, userState, featureFlagReleaseState),
    );
  } catch {
    return buildDashboardUrlTree(router, getDefaultDashboardType(featureFlagReleaseState));
  }
};
