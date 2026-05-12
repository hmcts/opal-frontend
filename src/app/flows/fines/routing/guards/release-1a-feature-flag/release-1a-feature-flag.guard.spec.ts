import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { GlobalStore } from '@hmcts/opal-frontend-common/stores/global';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { release1aFeatureFlagGuard } from './release-1a-feature-flag.guard';

describe('release1aFeatureFlagGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGlobalStore: any;

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      release1aFeatureFlagGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockGlobalStore = {
      featureFlags: vi.fn().mockReturnValue({ 'release-1a': true }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: GlobalStore, useValue: mockGlobalStore },
      ],
    });
  });

  it('should allow the route when release-1a is enabled', () => {
    const result = runGuard();

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to access denied when release-1a is disabled', () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({ 'release-1a': false });
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to access denied when release-1a is missing', () => {
    const expectedUrlTree = new UrlTree();
    mockGlobalStore.featureFlags.mockReturnValue({});
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });
});
