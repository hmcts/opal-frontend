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
import { PermissionsService, SessionService } from '@services';
import { ROUTE_PERMISSIONS } from '@constants';
import { RoutingPaths } from '@enums';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { USER_STATE_MOCK } from '@mocks';
import { Observable, of } from 'rxjs';
import { handleObservableResult } from '../helpers';

async function runRoutePermissionGuard(
  guard: typeof routePermissionsGuard,
  guardParameters: number | null,
  urlPath: string,
) {
  const dummyRoute = new ActivatedRouteSnapshot();
  dummyRoute.url = [new UrlSegment(urlPath, {})];

  dummyRoute.data = { routePermissionId: guardParameters };

  const dummyState: RouterStateSnapshot = { url: urlPath, root: new ActivatedRouteSnapshot() };
  const result = TestBed.runInInjectionContext(() => guard(dummyRoute, dummyState));
  const authenticated = result instanceof Observable ? await handleObservableResult(result) : result;
  return authenticated;
}

describe('routePermissionsGuard', () => {
  let mockPermissionsService: jasmine.SpyObj<PermissionsService>;
  let mockSessionService: jasmine.SpyObj<SessionService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const urlPath = RoutingPaths.accountEnquirySearch;

  beforeEach(() => {
    mockPermissionsService = jasmine.createSpyObj(routePermissionsGuard, ['getUniquePermissions']);

    mockSessionService = jasmine.createSpyObj(routePermissionsGuard, ['getUserState']);
    mockSessionService.getUserState.and.returnValue(of(USER_STATE_MOCK));

    mockRouter = jasmine.createSpyObj(routePermissionsGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    });
  });

  it('should return true if user has permission id', () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry]]);
    expect(
      runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry], urlPath),
    ).toBeTruthy();
  });

  it('should re-route if no access', () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([999]);
    runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry], urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  });

  it('should re-route no unique permission ids ', () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    runRoutePermissionGuard(routePermissionsGuard, ROUTE_PERMISSIONS[RoutingPaths.accountEnquiry], urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  });

  it('should return true if no route permission ids ', () => {
    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    runRoutePermissionGuard(routePermissionsGuard, null, urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  });
});
