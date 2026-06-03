import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { GlobalStoreType } from '@hmcts/opal-frontend-common/stores/global/types';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type FeatureFlagReleaseName } from '@app/flows/fines/types/feature-flag-release-name.type';
import { resolveFeatureFlagReleaseState } from './resolve-feature-flag-release-state.helper';

describe('resolveFeatureFlagReleaseState', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const releaseFlags: readonly FeatureFlagReleaseName[] = ['release-1a', 'release-1b'];
  let globalStore: GlobalStoreType;

  const runHelper = () =>
    TestBed.runInInjectionContext(() => resolveFeatureFlagReleaseState(releaseFlags, route, state));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LaunchDarklyService,
          useValue: {
            initializeLaunchDarklyFlags: vi.fn(),
            initializeLaunchDarklyClient: vi.fn(),
          },
        },
      ],
    });

    globalStore = TestBed.inject(GlobalStore);
  });

  it('should preserve injection context while resolving multiple release flags', async () => {
    globalStore.setFeatureFlags({ 'release-1a': true, 'release-1b': true });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': true,
    });
  });

  it('should preserve the disabled state for a later release flag', async () => {
    globalStore.setFeatureFlags({ 'release-1a': true, 'release-1b': false });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': false,
    });
  });
});
