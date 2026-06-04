import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { type FeatureFlagReleaseName } from '@app/flows/fines/types/feature-flag-release-name.type';

const resolveFeatureFlagGuardMock = vi.fn();

describe('resolveFeatureFlagReleaseState', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const releaseFlags: readonly FeatureFlagReleaseName[] = ['release-1a', 'release-1b'];
  let featureFlags: Record<string, boolean>;
  let resolveFeatureFlagReleaseState: (typeof import('./resolve-feature-flag-release-state.helper'))['resolveFeatureFlagReleaseState'];

  const mockFeatureFlags = (flags: Record<string, boolean>) => {
    featureFlags = flags;
    resolveFeatureFlagGuardMock.mockImplementation((featureFlag: string) =>
      Promise.resolve(featureFlags[featureFlag] ?? false),
    );
  };

  const runHelper = () =>
    TestBed.runInInjectionContext(() => resolveFeatureFlagReleaseState(releaseFlags, route, state));

  beforeAll(async () => {
    vi.doMock('@hmcts/opal-frontend-common/guards/feature-flag', () => ({
      resolveFeatureFlagGuard: resolveFeatureFlagGuardMock,
    }));

    ({ resolveFeatureFlagReleaseState } = await import('./resolve-feature-flag-release-state.helper'));
  });

  beforeEach(() => {
    resolveFeatureFlagGuardMock.mockReset();
    mockFeatureFlags({});
    TestBed.configureTestingModule({});
  });

  it('should preserve injection context while resolving multiple release flags', async () => {
    mockFeatureFlags({ 'release-1a': true, 'release-1b': true });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': true,
    });

    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith('release-1a', route, state);
    expect(resolveFeatureFlagGuardMock).toHaveBeenCalledWith('release-1b', route, state);
  });

  it('should preserve the disabled state for a later release flag', async () => {
    mockFeatureFlags({ 'release-1a': true, 'release-1b': false });

    await expect(runHelper()).resolves.toEqual({
      'release-1a': true,
      'release-1b': false,
    });
  });
});
