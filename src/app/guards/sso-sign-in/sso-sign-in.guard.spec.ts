import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { ssoSignInGuard } from './sso-sign-in.guard';

import { StateService } from '@services';
import { RoutingPaths } from '@enums';

function runSsoSignInGuard(guard: typeof ssoSignInGuard, guardParameters: boolean, urlPath: string) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];
  const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
  return TestBed.runInInjectionContext(() => guard(guardParameters)(dummyRoute, dummyState));
}

describe('ssoSignInGuard', () => {
  let mockStateService: jasmine.SpyObj<StateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockStateService = jasmine.createSpyObj(ssoSignInGuard, ['ssoEnabled']);
    mockRouter = jasmine.createSpyObj(ssoSignInGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: StateService,
          useValue: mockStateService,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.runInInjectionContext(() => ssoSignInGuard(true))).toBeTruthy();
  });

  it('should return true if sso enabled and sso route ', () => {
    mockStateService.ssoEnabled = true;
    expect(runSsoSignInGuard(ssoSignInGuard, true, `/${RoutingPaths.signIn}`)).toBeTruthy();
  });

  it('should return true if sso enabled and sso route ', () => {
    mockStateService.ssoEnabled = false;
    expect(runSsoSignInGuard(ssoSignInGuard, false, `/${RoutingPaths.signInStub}`)).toBeTruthy();
  });

  it('should re-route if no access', () => {
    mockStateService.ssoEnabled = false;
    runSsoSignInGuard(ssoSignInGuard, true, '/sign-in');
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.signInStub}`]);
  });

  it('should re-route if no access', () => {
    mockStateService.ssoEnabled = true;
    runSsoSignInGuard(ssoSignInGuard, false, '/sign-in-stub');
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.signIn}`]);
  });
});
