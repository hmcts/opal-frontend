import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { finesReportsCreateStateGuard } from './fines-reports-create-state.guard';

describe('finesReportsCreateStateGuard', () => {
  const reportTypeId = 'operational_report_enforcement';
  const report: IOpalFinesReport = {
    report_id: reportTypeId,
    report_title: 'Operational reports (by enforcement)',
    can_manually_create: true,
    report_permission: 'operational-report-by-enforcement',
  };
  const businessUnits: IOpalFinesBusinessUnitRefData = {
    count: 1,
    refData: [OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK.refData[0]],
  };
  const mockRouter = createSpyObj('Router', ['createUrlTree']);
  const mockOpalFines = createSpyObj('OpalFines', ['getReport', 'getBusinessUnitsByPermission']);
  const mockCreateUrlTree = mockRouter['createUrlTree'];
  const mockGetReport = mockOpalFines['getReport'];
  const mockGetBusinessUnitsByPermission = mockOpalFines['getBusinessUnitsByPermission'];

  const runGuard = async (requiresSelectedBusinessUnits = false, routeReportTypeId: string | null = reportTypeId) => {
    const parent = {
      paramMap: convertToParamMap(routeReportTypeId ? { reportTypeId: routeReportTypeId } : {}),
      parent: null,
    } as unknown as ActivatedRouteSnapshot;
    const route = {
      data: { requiresSelectedBusinessUnits },
      paramMap: convertToParamMap({}),
      parent,
    } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsCreateStateGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateUrlTree.mockReturnValue(new UrlTree());
    mockGetReport.mockReturnValue(of(report));
    mockGetBusinessUnitsByPermission.mockReturnValue(of(businessUnits));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OpalFines, useValue: mockOpalFines },
        FinesReportsStore,
      ],
    });
  });

  it('should allow an eligible user into Select business units', async () => {
    const result = await runGuard();

    expect(result).toBe(true);
    expect(mockGetBusinessUnitsByPermission).toHaveBeenCalledWith(report.report_permission);
  });

  it('should return to the summary list when the report cannot be created manually', async () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);
    mockGetReport.mockReturnValue(of({ ...report, can_manually_create: false }));

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`,
    ]);
    expect(mockGetBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should redirect to access denied when report metadata has no permission', async () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);
    mockGetReport.mockReturnValue(of({ ...report, report_permission: undefined }));

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to access denied when no eligible business units are available', async () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);
    mockGetBusinessUnitsByPermission.mockReturnValue(of({ count: 0, refData: [] }));

    const result = await runGuard();

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect warning and parameters routes without a stored selection to Select business units', async () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(true);

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  });

  it('should allow warning and parameters routes with a stored selection', async () => {
    TestBed.inject(FinesReportsStore).setSelectedBusinessUnitIds(reportTypeId, [61]);

    const result = await runGuard(true);

    expect(result).toBe(true);
  });

  it('should redirect a route with no report type id to the reports dashboard', async () => {
    const expectedUrlTree = new UrlTree();
    mockCreateUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(false, null);

    expect(result).toBe(expectedUrlTree);
    expect(mockCreateUrlTree).toHaveBeenCalledWith([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  });
});
