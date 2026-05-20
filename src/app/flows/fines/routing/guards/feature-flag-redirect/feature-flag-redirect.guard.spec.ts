import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { featureFlagGuard } from '@hmcts/opal-frontend-common/guards/feature-flag';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { featureFlagRedirectGuard } from './feature-flag-redirect.guard';

vi.mock('@hmcts/opal-frontend-common/guards/feature-flag', () => ({
  featureFlagGuard: vi.fn(),
}));

describe('featureFlagRedirectGuard', () => {
  let mockRouter: Router;
  let createUrlTreeMock: Mock;
  let featureFlagGuardMock: Mock;

  const runGuard = (guard: CanActivateFn) =>
    TestBed.runInInjectionContext(() => guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot));

  beforeEach(() => {
    const routerSpy = createSpyObj('Router', ['createUrlTree']);
    createUrlTreeMock = routerSpy['createUrlTree'];
    mockRouter = routerSpy as unknown as Router;
    featureFlagGuardMock = vi.mocked(featureFlagGuard) as Mock;
    featureFlagGuardMock.mockReturnValue(vi.fn().mockResolvedValue(true));

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('should return true when the feature flag guard allows access', async () => {
    const result = await runGuard(featureFlagRedirectGuard('release-1a'));

    expect(result).toBe(true);
    expect(featureFlagGuardMock).toHaveBeenCalledWith('release-1a');
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to access denied when the feature flag guard denies access', async () => {
    const expectedUrlTree = new UrlTree();
    featureFlagGuardMock.mockReturnValue(vi.fn().mockResolvedValue(false));
    createUrlTreeMock.mockReturnValue(expectedUrlTree);

    const result = await runGuard(featureFlagRedirectGuard('release-1a'));

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to the provided path when the feature flag guard denies access', async () => {
    const expectedUrlTree = new UrlTree();
    featureFlagGuardMock.mockReturnValue(vi.fn().mockResolvedValue(false));
    createUrlTreeMock.mockReturnValue(expectedUrlTree);

    const result = await runGuard(featureFlagRedirectGuard('release-1a', '/custom-denied'));

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/custom-denied']);
  });
});
