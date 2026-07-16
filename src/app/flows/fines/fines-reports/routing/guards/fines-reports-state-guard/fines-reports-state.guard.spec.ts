import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { beforeEach, describe, expect, it } from 'vitest';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { finesReportsStateGuard } from './fines-reports-state.guard';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';

describe('finesReportsStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPermissionsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;

  const runGuard = async (reportId: string | null) => {
    const route = {
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
    } as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsStateGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockPermissionsService = createSpyObj('PermissionsService', ['getUniquePermissions']);
    mockOpalUserService = createSpyObj('OpalUserService', ['getLoggedInUserState']);

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockPermissionsService.getUniquePermissions.mockReturnValue([]);
    mockOpalUserService.getLoggedInUserState.mockReturnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PermissionsService, useValue: mockPermissionsService },
        { provide: OpalUserService, useValue: mockOpalUserService },
      ],
    });
  });

  it('should capture the selected your reports id without checking permissions', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
  });

  it('should allow operational reports when the user has the required permission', async () => {
    mockPermissionsService.getUniquePermissions.mockReturnValue([
      FINES_PERMISSIONS['operational-report-by-enforcement'],
    ]);

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).toHaveBeenCalled();
  });

  it('should redirect to access denied when the user lacks the required permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect missing report ids to the reports dashboard', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(null);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  });

  it('should redirect invalid report ids to the reports dashboard', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard('invalid-report-id');

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  });

  it('should return false when the permissions lookup fails', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(throwError(() => new Error('lookup failed')));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(false);
  });
});
