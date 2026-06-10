import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { type FeatureFlagReleaseName } from '@app/flows/fines/types/feature-flag-release-name.type';
import { type FeatureFlagReleaseState } from '@app/flows/fines/types/feature-flag-release-state.type';
import { resolveFeatureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';

export const resolveFeatureFlagReleaseState = async (
  featureFlagReleaseNames: readonly FeatureFlagReleaseName[],
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<FeatureFlagReleaseState> => {
  const injector = inject(EnvironmentInjector);
  const featureFlagReleaseState: FeatureFlagReleaseState = {};

  for (const featureFlagReleaseName of featureFlagReleaseNames) {
    featureFlagReleaseState[featureFlagReleaseName] = await runInInjectionContext(injector, () =>
      resolveFeatureFlagGuard(featureFlagReleaseName, route, state),
    );
  }

  return featureFlagReleaseState;
};
