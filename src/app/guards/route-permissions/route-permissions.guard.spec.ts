import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { routePermissionsGuard } from './route-permissions.guard';
import { UserStateService } from '@services';
import { ROUTE_PERMISSIONS } from '@constants';
import { RoutingPaths } from '@enums';

function runRoutePermissionGuard(guard: typeof routePermissionsGuard, guardParameters: number | null, urlPath: string) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];
  const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
  return TestBed.runInInjectionContext(() => guard(guardParameters)(dummyRoute, dummyState));
}

describe('routePermissionsGuard', () => {
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
    expect(runRoutePermissionGuard(routePermissionsGuard, null, urlPath)).toBeTruthy();
  });

  it('should return true if no unique permission ids ', () => {
    mockUSerStateService.getUserUniquePermissions.and.returnValue([]);
    expect(runRoutePermissionGuard(routePermissionsGuard, 999, urlPath)).toBeTruthy();
  });

  it('should return true if user has permission id', () => {
    mockUSerStateService.getUserUniquePermissions.and.returnValue([ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry]]);
    expect(
      runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry], urlPath),
    ).toBeTruthy();
  });

  it('should re-route if no access', () => {
    mockUSerStateService.getUserUniquePermissions.and.returnValue([999]);
    runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry], urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith(['/access-denied']);
  });
});
