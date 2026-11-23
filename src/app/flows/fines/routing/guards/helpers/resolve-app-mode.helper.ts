import { inject } from '@angular/core';
import { APP_MODE_FEATURE_FLAG } from '@app/flows/fines/constants/environment-feature-flags.constant';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';

/**
 * Resolves the application mode after loading feature flags when needed.
 * Missing, invalid, or unavailable flags retain the existing legacy integration.
 * @returns The configured application mode, defaulting to legacy.
 */
export const resolveAppMode = async (): Promise<'legacy' | 'opal'> => {
  const globalStore = inject(GlobalStore);
  const launchDarklyService = inject(LaunchDarklyService);
  const getAppMode = (): unknown => (globalStore.featureFlags() as Record<string, unknown>)[APP_MODE_FEATURE_FLAG];
  const appMode = getAppMode();

  if (appMode !== undefined) {
    return appMode === 'opal' ? 'opal' : 'legacy';
  }

  try {
    await launchDarklyService.initializeLaunchDarklyFlags();

    if (getAppMode() === undefined) {
      launchDarklyService.initializeLaunchDarklyClient();
      await launchDarklyService.initializeLaunchDarklyFlags();
    }

    return getAppMode() === 'opal' ? 'opal' : 'legacy';
  } catch {
    return 'legacy';
  }
};
