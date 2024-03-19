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

import { routePermissionsGuard } from './route-permissions.guard';
import { AuthService, UserStateService } from '@services';
import { getGuardWithDummyUrl } from '../helpers';

fdescribe('routePermissionsGuard', () => {
  // const executeGuard: CanActivateFn = (...guardParameters) =>
  //   TestBed.runInInjectionContext(() => routePermissionsGuard(...guardParameters));
  let mockUSerStateService: jasmine.SpyObj<UserStateService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = '/account-details/search';

  beforeEach(() => {
    mockUSerStateService = jasmine.createSpyObj(routePermissionsGuard, ['getUserUniquePermissions']);
    mockRouter = jasmine.createSpyObj(routePermissionsGuard, ['navigate', 'createUrlTree', 'parseUrl']);
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
          provide: UserStateService,
          useValue: mockUSerStateService,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.runInInjectionContext(() => routePermissionsGuard(54))).toBeTruthy();
  });

  it('should return true if no route permission ids ', () => {
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };

    expect(TestBed.runInInjectionContext(() => routePermissionsGuard(null)(dummyRoute, dummyState))).toBeTruthy();
  });

  it('should return true if no unique permission ids ', () => {
    const dummyRoute = new ActivatedRouteSnapshot();
    dummyRoute.url = [new UrlSegment(urlPath, {})];
    const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };

    expect(TestBed.runInInjectionContext(() => routePermissionsGuard(54)(dummyRoute, dummyState))).toBeTruthy();
  });
});
