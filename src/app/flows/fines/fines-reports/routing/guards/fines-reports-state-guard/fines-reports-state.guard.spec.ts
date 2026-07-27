import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, convertToParamMap } from '@angular/router';
import { FINES_PERMISSIONS } from '@app/constants/fines-permissions.constant';
import { createSpyObj } from '@app/testing/create-spy-obj.helper';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { OpalUserService } from '@hmcts/opal-frontend-common/services/opal-user-service';
import { PermissionsService } from '@hmcts/opal-frontend-common/services/permissions-service';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, type Mock } from 'vitest';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { finesReportsStateGuard } from './fines-reports-state.guard';

type OpalFinesServiceSpy = {
  getReport: Mock;
  getBusinessUnitsByPermission: Mock;
};

type RunGuardOptions = {
  nestedCreateRoute?: boolean;
};

describe('finesReportsStateGuard', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRouter: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockPermissionsService: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalUserService: any;
  let mockOpalFinesService: OpalFinesServiceSpy;
  let finesReportsStore: InstanceType<typeof FinesReportsStore>;

  const runGuard = async (
    reportTypeId: string | null,
    data: Record<string, unknown> = {},
    { nestedCreateRoute = false }: RunGuardOptions = {},
  ) => {
    const reportParamMap = convertToParamMap(reportTypeId ? { reportTypeId } : {});
    const route = (
      nestedCreateRoute
        ? {
            data,
            paramMap: convertToParamMap({}),
            parent: {
              data: {},
              paramMap: convertToParamMap({}),
              parent: {
                data: {},
                paramMap: reportParamMap,
              },
            },
          }
        : {
            data,
            paramMap: reportParamMap,
          }
    ) as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => finesReportsStateGuard(route, state));

    return isObservable(result) ? firstValueFrom(result) : result;
  };

  beforeEach(() => {
    mockRouter = createSpyObj('Router', ['createUrlTree']);
    mockPermissionsService = createSpyObj('PermissionsService', ['getUniquePermissions']);
    mockOpalUserService = createSpyObj('OpalUserService', ['getLoggedInUserState']);
    mockOpalFinesService = createSpyObj('OpalFines', [
      'getReport',
      'getBusinessUnitsByPermission',
    ]) as OpalFinesServiceSpy;

    mockRouter.createUrlTree.mockReturnValue(new UrlTree());
    mockPermissionsService.getUniquePermissions.mockReturnValue([
      FINES_PERMISSIONS['operational-report-by-enforcement'],
      FINES_PERMISSIONS['operational-report-by-payments'],
    ]);
    mockOpalUserService.getLoggedInUserState.mockReturnValue(of({}));
    mockOpalFinesService.getReport.mockReturnValue(of(OPAL_FINES_REPORT_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: PermissionsService, useValue: mockPermissionsService },
        { provide: OpalUserService, useValue: mockOpalUserService },
        { provide: OpalFines, useValue: mockOpalFinesService },
        FinesReportsStore,
      ],
    });

    finesReportsStore = TestBed.inject(FinesReportsStore);
  });

  it('should allow your reports without checking static permissions or report metadata', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
  });

  it('should allow operational reports when the user has the configured static permission', async () => {
    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBe(true);
    expect(mockOpalUserService.getLoggedInUserState).toHaveBeenCalled();
    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
  });

  it('should deny static permission failures before loading report metadata or business units', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockPermissionsService.getUniquePermissions.mockReturnValue([]);

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should use report_permission when checking eligible business units', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({ ...OPAL_FINES_REPORT_MOCK, report_permission: 'REPORT_PERMISSION' }),
    );

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('REPORT_PERMISSION');
  });

  it('should fall back to permission when report_permission is absent', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({ ...OPAL_FINES_REPORT_MOCK, report_permission: undefined, permission: 'LEGACY_PERMISSION' }),
    );

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBe(true);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('LEGACY_PERMISSION');
  });

  it('should redirect to access denied when report metadata has neither permission field', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(
      of({ ...OPAL_FINES_REPORT_MOCK, report_permission: undefined, permission: undefined }),
    );

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect to access denied when no eligible business units are returned', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of({ refData: [] }));

    const result = await runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
  });

  it('should redirect your reports create routes to the summary list', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      { requiresCreateReport: true },
      { nestedCreateRoute: true },
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

  it('should redirect create routes when metadata says the report cannot be manually created', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    mockOpalFinesService.getReport.mockReturnValue(of({ ...OPAL_FINES_REPORT_MOCK, can_manually_create: false }));

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      { requiresCreateReport: true },
      { nestedCreateRoute: true },
    );

    expect(result).toBe(expectedUrlTree);
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should redirect business unit warning routes to selection when no business units are stored', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      { nestedCreateRoute: true },
    );

    expect(result).toBe(expectedUrlTree);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  });

  it('should allow business unit warning routes when selected business units belong to the report', async () => {
    finesReportsStore.setSelectedBusinessUnitIds(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      [61, 68],
    );

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      { nestedCreateRoute: true },
    );

    expect(result).toBe(true);
  });

  it('should redirect business unit warning routes when stored business units belong to a different report', async () => {
    const expectedUrlTree = new UrlTree();
    mockRouter.createUrlTree.mockReturnValue(expectedUrlTree);
    finesReportsStore.setSelectedBusinessUnitIds(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      [61, 68],
    );

    const result = await runGuard(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      { requiresCreateReport: true, requiresSelectedBusinessUnits: true },
      { nestedCreateRoute: true },
    );

    expect(result).toBe(expectedUrlTree);
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

  it('should propagate static permission lookup failures', async () => {
    mockOpalUserService.getLoggedInUserState.mockReturnValue(throwError(() => new Error('permission lookup failed')));

    await expect(
      runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments),
    ).rejects.toThrow('permission lookup failed');
  });

  it('should propagate report metadata lookup failures', async () => {
    mockOpalFinesService.getReport.mockReturnValue(throwError(() => new Error('report lookup failed')));

    await expect(
      runGuard(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments),
    ).rejects.toThrow('report lookup failed');
  });
});
