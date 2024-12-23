import { TestBed, fakeAsync } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { routePermissionsGuard } from './route-permissions.guard';
import { PermissionsService } from '@services/permissions-service/permissions.service';
import { SessionService } from '@services/session-service/session.service';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SESSION_USER_STATE_MOCK } from '@services/session-service/mocks/session-user-state.mock';
import { Observable, of, throwError } from 'rxjs';
import { handleObservableResult } from '@guards/helpers/handle-observable-result';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { FINES_ROUTING_PATHS } from '@routing/fines/constants/fines-routing-paths.constant';
import { FINES_ROUTING_PERMISSIONS } from '@routing/fines/constants/fines-routing-permissions.constant';
import { RoutingPaths } from '@routing/enums/routing-paths';
import { IFinesRoutingPermissions } from '@routing/fines/interfaces/fines-routing-permissions.interface';

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
  let mockPermissionsService: jasmine.SpyObj<PermissionsService> | null;
  let mockSessionService: jasmine.SpyObj<SessionService> | null;
  let mockRouter: jasmine.SpyObj<Router> | null;

  const urlPath = FINES_ROUTING_PATHS.children.mac.root;

  beforeEach(() => {
    mockPermissionsService = jasmine.createSpyObj(routePermissionsGuard, ['getUniquePermissions']);

    mockSessionService = jasmine.createSpyObj(routePermissionsGuard, ['getUserState']);
    mockSessionService!.getUserState.and.returnValue(of(SESSION_USER_STATE_MOCK));

    mockRouter = jasmine.createSpyObj(routePermissionsGuard, ['navigate', 'createUrlTree', 'parseUrl']);
    mockRouter!.parseUrl.and.callFake((url: string) => {
      const urlTree = new UrlTree();
      const urlSegment = new UrlSegment(url, {});
      urlTree.root = new UrlSegmentGroup([urlSegment], {});
      return urlTree;
    });

    TestBed.configureTestingModule({
      imports: [],
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  afterAll(() => {
    mockPermissionsService = null;
    mockSessionService = null;
    mockRouter = null;
    TestBed.resetTestingModule();
  });

  it('should return true if user has permission id', fakeAsync(async () => {
    if (!mockPermissionsService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockPermissionsService.getUniquePermissions.and.returnValue([
      FINES_ROUTING_PERMISSIONS[FINES_ROUTING_PATHS.children.mac.root as keyof IFinesRoutingPermissions],
    ]);

    const guard = await runRoutePermissionGuard(
      routePermissionsGuard,
      FINES_ROUTING_PERMISSIONS[FINES_ROUTING_PATHS.children.mac.root as keyof IFinesRoutingPermissions],
      urlPath,
    );
    expect(guard).toBeTruthy();
  }));

  it('should re-route if no access', fakeAsync(async () => {
    if (!mockPermissionsService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockPermissionsService.getUniquePermissions.and.returnValue([999]);
    await runRoutePermissionGuard(
      routePermissionsGuard,
      FINES_ROUTING_PERMISSIONS[FINES_ROUTING_PATHS.children.mac.root as keyof IFinesRoutingPermissions],
      urlPath,
    );
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  }));

  it('should re-route no unique permission ids ', fakeAsync(async () => {
    if (!mockPermissionsService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(
      routePermissionsGuard,
      FINES_ROUTING_PERMISSIONS[FINES_ROUTING_PATHS.children.mac.root as keyof IFinesRoutingPermissions],
      urlPath,
    );
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  }));

  it('should re-route if no route permission ids ', fakeAsync(async () => {
    if (!mockPermissionsService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, null, urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  }));

  it('should re-route if route permission id does not exist', fakeAsync(async () => {
    if (!mockPermissionsService || !mockRouter) {
      fail('Required properties not properly initialised');
      return;
    }

    mockPermissionsService.getUniquePermissions.and.returnValue([]);

    await runRoutePermissionGuard(routePermissionsGuard, 999999999, urlPath);
    expect(mockRouter.createUrlTree).toHaveBeenCalledOnceWith([`/${RoutingPaths.accessDenied}`]);
  }));

  it('should allow access to login if catches an error ', fakeAsync(async () => {
    if (!mockSessionService) {
      fail('Required properties not properly initialised');
      return;
    }

    mockSessionService.getUserState.and.returnValue(throwError(() => 'Error'));
    const guard = await runRoutePermissionGuard(
      routePermissionsGuard,
      FINES_ROUTING_PERMISSIONS[FINES_ROUTING_PATHS.children.mac.root as keyof IFinesRoutingPermissions],
      urlPath,
    );
    expect(guard).toBeFalsy();
  }));
});
