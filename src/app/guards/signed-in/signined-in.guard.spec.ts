import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { signinedInGuard } from './signined-in.guard';
import { AuthService } from '@services';
import { throwError, Observable, of } from 'rxjs';
import { runAuthGuardWithContext } from '../utils';

describe('signinedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => signinedInGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/sign-in';
  const expectedUrl = '/';

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(signinedInGuard, ['checkAuthenticated']);
    mockRouter = jasmine.createSpyObj(signinedInGuard, ['navigate', 'createUrlTree', 'parseUrl']);
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
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false if the user is logged in and redirect to the default route', fakeAsync(async () => {
    mockIsLoggedInFalse();
    const authenticated = await runAuthGuardWithContext(getSignedInGuardWithDummyUrl(urlPath));
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  }));

  it('should allow access to login if catches an error ', fakeAsync(async () => {
    mockAuthService.checkAuthenticated.and.returnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getSignedInGuardWithDummyUrl(urlPath));
    expect(authenticated).toBeTruthy();
  }));

  function getSignedInGuardWithDummyUrl(
    urlPath: string,
  ): () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
    return () => signinedInGuard(dummyRoute, dummyState);
  }

  const mockIsLoggedInFalse = () => {
    mockAuthService.checkAuthenticated.and.returnValue(of(false));
  };
});
