import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { beforeEach, describe, expect, it, type Mock } from 'vitest';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { finesReportsStateGuard } from './fines-reports-state.guard';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';

type OpalFinesServiceSpy = {
  getReport: Mock;
  getBusinessUnitsByPermission: Mock;
};

describe('finesReportsStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  let mockOpalFinesService: OpalFinesServiceSpy;
  let finesReportsStore: InstanceType<typeof FinesReportsStore>;

  const runGuard = async (
    reportTypeId: string | null,
    data: Record<string, unknown> = {},
    reportTypeIdFromParent = false,
  ) => {
    const route = {
      data,
      paramMap: convertToParamMap(!reportTypeIdFromParent && reportTypeId ? { reportTypeId } : {}),
      parent: reportTypeIdFromParent
        ? {
            paramMap: convertToParamMap(reportTypeId ? { reportTypeId } : {}),
          }
        : undefined,
    } as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsStateGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
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
        FinesReportsStore,
      ],
    });

    finesReportsStore = TestBed.inject(FinesReportsStore);
  });

  it('should allow your reports without loading report metadata', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
  });

  it('should allow operational reports when report metadata returns eligible business units', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
  });

  it('should allow operational report child routes when report metadata returns eligible business units', async () => {
    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      { requiresCreateReport: true },
      true,
    );

    expect(result).toBe(true);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
  });

  it('should redirect non-create reports to the summary list when the route requires report creation', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      { requiresCreateReport: true },
      true,
    );

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

  it('should redirect report parameter routes back to business unit selection when no selected business units are stored', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      true,
    );

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments}/${FINES_REPORTS_ROUTING_PATHS.children.create}/select-business-unit`,
    ]);
  });

  it('should allow report parameter routes when selected business units are already stored', async () => {
    finesReportsStore.setSelectedBusinessUnitIds(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      [61, 68],
    );

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      true,
    );

    expect(result).toBe(true);
  });

  it('should redirect report parameter routes when stored business units belong to a different report', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    finesReportsStore.setSelectedBusinessUnitIds(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      [61, 68],
    );

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      true,
    );

    expect(result).toBe(expectedUrlTree);
  });

  it('should redirect to access denied when report metadata has no permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(of({ ...OPAL_FINES_REPORT_MOCK, permission: null }));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to access denied before showing the report journey when no eligible business units are returned', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of({ refData: [] }));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect create routes to the summary list when metadata says the report cannot be manually created', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(of({ ...OPAL_FINES_REPORT_MOCK, can_manually_create: false }));

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      { requiresCreateReport: true },
      true,
    );

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should redirect missing report type ids to the reports dashboard', async () => {
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

  it('should redirect invalid report type ids to the reports dashboard', async () => {
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

  it('should return false when the report lookup fails', async () => {
    mockOpalFinesService.getReport.mockReturnValue(throwError(() => new Error('lookup failed')));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(false);
  });
});
