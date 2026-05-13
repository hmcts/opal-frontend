import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { LaunchDarklyService } from '@hmcts/opal-frontend-common/services/launch-darkly-service';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { release1aFeatureFlagGuard } from './release-1a-feature-flag.guard';

describe('release1aFeatureFlagGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGlobalStore: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLaunchDarklyService: any;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      release1aFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockGlobalStore = {
      featureFlags: vi.fn().mockReturnValue({ 'release-1a': true }),
    };
    mockLaunchDarklyService = createSpyObj('LaunchDarklyService', ['initializeLaunchDarklyFlags']);
    mockLaunchDarklyService.initializeLaunchDarklyFlags.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GlobalStore, useValue: mockGlobalStore },
        { provide: LaunchDarklyService, useValue: mockLaunchDarklyService },
      ],
    });
  });

  it('should allow the route when release-1a is enabled', () => {
    const result = runGuard();

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).not.toHaveBeenCalled();
  });

  it('should redirect to access denied when release-1a is disabled', () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({ 'release-1a': false });
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).not.toHaveBeenCalled();
  });

  it('should wait for LaunchDarkly flags when release-1a has not been populated', async () => {
    mockGlobalStore.featureFlags.mockReturnValueOnce({}).mockReturnValue({ 'release-1a': true });

    const result = await runGuard();

    expect(result).toBe(true);
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to access denied when release-1a is still missing after LaunchDarkly flags are initialized', async () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({});
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockLaunchDarklyService.initializeLaunchDarklyFlags).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to access denied when LaunchDarkly flag initialization fails', async () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({});
    mockLaunchDarklyService.initializeLaunchDarklyFlags.mockRejectedValue(new Error('LaunchDarkly failed'));
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });
});
