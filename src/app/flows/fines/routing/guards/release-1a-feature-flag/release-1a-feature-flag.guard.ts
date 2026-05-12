import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

export const release1aFeatureFlagGuard: CanActivateFn = () => {
  const globalStore = inject(GlobalStore);
  const router = inject(Router);

  const isRelease1aEnabled = globalStore.featureFlags()['release-1a'];

  return isRelease1aEnabled ? true : router.createUrlTree([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
};
