import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { finesReportsCreateStateGuard } from './fines-reports-create-state.guard';

type OpalFinesServiceSpy = {
  getReport: Mock;
};

type RouterSpy = {
  createUrlTree: Mock;
};

describe('finesReportsCreateStateGuard', () => {
  let mockRouter: RouterSpy;
  let mockOpalFinesService: OpalFinesServiceSpy;
  let finesReportsStore: InstanceType<typeof FinesReportsStore>;

  const runGuard = async (reportTypeId: string | null, data: Record<string, unknown> = {}) => {
    const reportRoute = {
      paramMap: convertToParamMap(reportTypeId ? { reportTypeId } : {}),
    } as ActivatedRouteSnapshot;
    const createRoute = {
      paramMap: convertToParamMap({}),
      parent: reportRoute,
    } as ActivatedRouteSnapshot;
    const route = {
      data,
      paramMap: convertToParamMap({}),
      parent: createRoute,
    } as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsCreateStateGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']) as RouterSpy;
    mockOpalFinesService = createSpyObj('OpalFines', ['getReport']) as OpalFinesServiceSpy;

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockOpalFinesService.getReport.mockReturnValue(of(OPAL_FINES_REPORT_MOCK));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFinesService },
        FinesReportsStore,
      ],
    });

    finesReportsStore = TestBed.inject(FinesReportsStore);
  });

  it('redirects frontend-only reports to their summary list', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  });

  it('redirects to the summary list when manual report creation is unavailable', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(of({ ...OPAL_FINES_REPORT_MOCK, can_manually_create: false }));

    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
    const result = await runGuard(reportTypeId);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      reportTypeId,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  });

  it('redirects to select business units when a later create page has no selection', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;

    const result = await runGuard(reportTypeId, { requiresSelectedBusinessUnits: true });

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  });

  it('allows a later create page when business units have been selected for the same report', async () => {
    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments;
    finesReportsStore.setSelectedBusinessUnitIds(reportTypeId, [61, 68]);

    const result = await runGuard(reportTypeId, { requiresSelectedBusinessUnits: true });

    expect(result).toBe(true);
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

  it('returns false when report metadata cannot be loaded', async () => {
    mockOpalFinesService.getReport.mockReturnValue(throwError(() => new Error('lookup failed')));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(false);
  });
});
