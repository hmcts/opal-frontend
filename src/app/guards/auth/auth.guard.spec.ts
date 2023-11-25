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

import { AuthService } from '@services';

import { authGuard } from './auth.guard';
import { Observable, of, throwError } from 'rxjs';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/test-page';
  const expectedUrl = 'sign-in';

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(authGuard, ['checkAuthenticated']);
    mockRouter = jasmine.createSpyObj(authGuard, ['navigate', 'createUrlTree', 'parseUrl']);
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

  it('should return false if the user is not logged in ', fakeAsync(async () => {
    mockIsLoggedInFalse();
    const authenticated = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(urlPath));
    expect(authenticated).toBeFalsy();
  }));

  it('should return true if the user is logged in ', fakeAsync(async () => {
    mockIsLoggedInTrue();
    const authenticated = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(urlPath));
    expect(authenticated).toBeTruthy();
  }));

  it('should redirect to login with originalUrl and loggedOut url parameters if catches an error ', fakeAsync(async () => {
    mockAuthService.checkAuthenticated.and.returnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getAuthGuardWithDummyUrl(urlPath));
    expect(mockRouter.navigate).toHaveBeenCalledOnceWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  }));

  function getAuthGuardWithDummyUrl(
    urlPath: string,
  ): () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
    return () => authGuard(dummyRoute, dummyState);
  }

  async function runAuthGuardWithContext(
    authGuard: () => boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>,
  ): Promise<boolean | UrlTree> {
    const result = TestBed.runInInjectionContext(authGuard);
    const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
    return authenticated;
  }

  function handleObservableResult(result: Observable<boolean | UrlTree>): Promise<boolean | UrlTree> {
    return new Promise<boolean | UrlTree>((resolve) => {
      result.subscribe((value) => {
        resolve(value);
      });
    });
  }

  const mockIsLoggedInTrue = () => {
    mockAuthService.checkAuthenticated.and.returnValue(of(true));
  };

  const mockIsLoggedInFalse = () => {
    mockAuthService.checkAuthenticated.and.returnValue(of(false));
  };
});
