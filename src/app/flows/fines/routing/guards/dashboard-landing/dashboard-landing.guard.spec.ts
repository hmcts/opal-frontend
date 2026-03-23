import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FINES_PERMISSIONS } from '@constants/fines-permissions.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { beforeEach, describe, expect, it } from 'vitest';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { dashboardLandingGuard } from './dashboard-landing.guard';

describe('dashboardLandingGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPermissionsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;

  const runGuard = async () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result$ = TestBed.runInInjectionContext(() => dashboardLandingGuard(route, state));
    return firstValueFrom(result$ as Observable<boolean | UrlTree>);
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockPermissionsService = createSpyObj('PermissionsService', ['getUniquePermissions']);
    mockOpalUserService = createSpyObj('OpalUserService', ['getLoggedInUserState']);

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockOpalUserService.getLoggedInUserState.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PermissionsService, useValue: mockPermissionsService },
        { provide: OpalUserService, useValue: mockOpalUserService },
      ],
    });
  });

  it('should route to Search when user has search-and-view-accounts permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockPermissionsService.getUniquePermissions.mockReturnValue([FINES_PERMISSIONS['search-and-view-accounts']]);
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.search,
    ]);
  });

  it('should route to Accounts when user does not have search permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockPermissionsService.getUniquePermissions.mockReturnValue([
      FINES_PERMISSIONS['create-and-manage-draft-accounts'],
    ]);
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ]);
  });

  it('should route to Accounts when user-state lookup fails', async () => {
    const expectedUrlTree = new UrlTree();
    mockOpalUserService.getLoggedInUserState.mockReturnValue(throwError(() => new Error('lookup failed')));
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.accounts,
    ]);
  });
});
