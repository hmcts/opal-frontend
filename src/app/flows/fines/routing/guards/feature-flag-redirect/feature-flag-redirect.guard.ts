import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { RELEASE_1A_FEATURE_FLAG } from '@app/flows/fines/utils/fines-section-permissions.utils';
import { resolveFeatureFlagGuard } from '../helpers/resolve-feature-flag-guard';

export function featureFlagRedirectGuard(
  flagKey: string,
  redirectPath = `/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`,
): CanActivateFn {
  return async (route, state) => {
    const router = inject(Router);
    const canActivate = await resolveFeatureFlagGuard(flagKey, route, state);

    return canActivate ? true : router.createUrlTree([redirectPath]);
  };
}

export const release1aFeatureFlagGuard = featureFlagRedirectGuard(RELEASE_1A_FEATURE_FLAG);
