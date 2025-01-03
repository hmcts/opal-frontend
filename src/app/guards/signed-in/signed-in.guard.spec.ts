import { TestBed, fakeAsync } from '@angular/core/testing';
import { CanActivateFn, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';

import { signedInGuard } from './signed-in.guard';
import { AuthService } from '@services/auth-service/auth.service';
import { throwError, of } from 'rxjs';
import { getGuardWithDummyUrl } from '../helpers/get-guard-with-dummy-url';
import { runAuthGuardWithContext } from '../helpers/run-auth-guard-with-context';

describe('signedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => signedInGuard(...guardParameters));

  let mockAuthService: jasmine.SpyObj<AuthService> | null;
  let mockRouter: jasmine.SpyObj<Router> | null;

  const urlPath = '/sign-in';
  const expectedUrl = '/';

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj(signedInGuard, ['checkAuthenticated']);
    mockRouter = jasmine.createSpyObj(signedInGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter!.parseUrl.and.callFake((url: string) => {
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

  afterAll(() => {
    mockAuthService = null;
    mockRouter = null;
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false if the user is logged in and redirect to the default route', fakeAsync(async () => {
    if (!mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockIsLoggedInFalse();
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([expectedUrl]);
    expect(authenticated).toBeFalsy();
  }));

  it('should allow access to login if catches an error ', fakeAsync(async () => {
    if (!mockAuthService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockAuthService.checkAuthenticated.and.returnValue(throwError(() => 'Authentication error'));
    const authenticated = await runAuthGuardWithContext(getGuardWithDummyUrl(signedInGuard, urlPath));
    expect(authenticated).toBeTruthy();
  }));

  const mockIsLoggedInFalse = () => {
    if (!mockAuthService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockAuthService.checkAuthenticated.and.returnValue(of(false));
  };
});
