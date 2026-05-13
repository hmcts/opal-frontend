import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import {
  isRelease1aFeatureEnabled,
  isRelease1aFeatureFlagPopulated,
} from '@app/flows/fines/utils/fines-section-permissions.utils';

const getGuardResult = (isRelease1aEnabled: boolean, router: Router): boolean | UrlTree =>
  isRelease1aEnabled ? true : router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);

export const release1aFeatureFlagGuard: CanActivateFn = () => {
  const globalStore = inject(GlobalStore);
  const launchDarklyService = inject(LaunchDarklyService);
  const router = inject(Router);

  if (isRelease1aFeatureFlagPopulated(globalStore.featureFlags())) {
    return getGuardResult(isRelease1aFeatureEnabled(globalStore.featureFlags()), router);
  }

  return launchDarklyService
    .initializeLaunchDarklyFlags()
    .then(() => getGuardResult(isRelease1aFeatureEnabled(globalStore.featureFlags()), router))
    .catch(() => router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]));
};
