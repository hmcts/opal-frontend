import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { type FeatureFlagReleaseName } from '@app/flows/fines/types/feature-flag-release-name.type';

describe('resolveFeatureFlagReleaseState', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const releaseFlags: readonly FeatureFlagReleaseName[] = ['release-1a', 'release-1b'];
  let featureFlags: Record<string, boolean>;
  let launchDarklyService: {
    initializeLaunchDarklyFlags: ReturnType<typeof vi.fn>;
    initializeLaunchDarklyClient: ReturnType<typeof vi.fn>;
  };
  let resolveFeatureFlagReleaseState: (typeof import('./resolve-feature-flag-release-state.helper'))['resolveFeatureFlagReleaseState'];

  const mockFeatureFlags = (flags: Record<string, boolean>) => {
    featureFlags = flags;
  };

  const runHelper = () =>
    TestBed.runInInjectionContext(() => resolveFeatureFlagReleaseState(releaseFlags, route, state));

  beforeEach(async () => {
    vi.resetModules();
    vi.doUnmock('@hmcts/opal-frontend-common/guards/feature-flag');
    ({ resolveFeatureFlagReleaseState } = await import('./resolve-feature-flag-release-state.helper'));

    mockFeatureFlags({});
    launchDarklyService = {
      initializeLaunchDarklyFlags: vi.fn(),
      initializeLaunchDarklyClient: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: GlobalStore,
          useValue: {
            featureFlags: () => featureFlags,
          },
        },
        {
          provide: LaunchDarklyService,
          useValue: launchDarklyService,
        },
      ],
    });
  });

  it('should preserve injection context while resolving multiple release flags', async () => {
    mockFeatureFlags({ 'release-1a': true, 'release-1b': true });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': true,
    });

    expect(launchDarklyService.initializeLaunchDarklyFlags).not.toHaveBeenCalled();
    expect(launchDarklyService.initializeLaunchDarklyClient).not.toHaveBeenCalled();
  });

  it('should preserve the disabled state for a later release flag', async () => {
    mockFeatureFlags({ 'release-1a': true, 'release-1b': false });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': false,
    });
  });
});
