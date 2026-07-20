import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { finesReportsAccessGuard } from './fines-reports-access.guard';

type OpalFinesServiceSpy = {
  getReport: Mock;
  getBusinessUnitsByPermission: Mock;
};

type RouterSpy = {
  createUrlTree: Mock;
};

describe('finesReportsAccessGuard', () => {
  let mockRouter: RouterSpy;
  let mockOpalFinesService: OpalFinesServiceSpy;

  const runGuard = async (reportTypeId: string | null) => {
    const route = {
      paramMap: convertToParamMap(reportTypeId ? { reportTypeId } : {}),
    } as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsAccessGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']) as RouterSpy;
    mockOpalFinesService = createSpyObj('OpalFines', [
      'getReport',
      'getBusinessUnitsByPermission',
    ]) as OpalFinesServiceSpy;

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockOpalFinesService.getReport.mockReturnValue(of(OPAL_FINES_REPORT_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFinesService },
      ],
    });
  });

  it('allows your reports without loading report metadata', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
  });

  it('allows an operational report when metadata returns eligible business units', async () => {
    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;

    const result = await runGuard(reportTypeId);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(reportTypeId);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
  });

  it('redirects to access denied when report metadata has no permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(of({ ...OPAL_FINES_REPORT_MOCK, permission: null }));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('redirects to access denied when no eligible business units are returned', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of({ refData: [] }));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('redirects missing report type ids to the reports dashboard', async () => {
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

  it('redirects invalid report type ids to the reports dashboard', async () => {
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

  it('returns false when report metadata cannot be loaded', async () => {
    mockOpalFinesService.getReport.mockReturnValue(throwError(() => new Error('lookup failed')));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(false);
  });
});
