import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  Router,
  UrlTree,
  convertToParamMap,
  ResolveFn,
} from '@angular/router';
import { PAGES_ROUTING_PATHS as COMMON_PAGES_ROUTING_PATHS } from '@hmcts/opal-frontend-common/pages/routing/constants';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { finesReportsBusinessUnitsResolver } from './fines-reports-business-units.resolver';

describe('finesReportsBusinessUnitsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;
  const mockRouter = {
    createUrlTree: vi.fn().mockName('Router.createUrlTree'),
  };

  const executeResolver: ResolveFn<IOpalFinesBusinessUnitRefData | RedirectCommand> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsBusinessUnitsResolver(...resolverParameters));

  const runResolver = async (
    reportTypeId: string,
    parentRoutePath?: string,
  ): Promise<IOpalFinesBusinessUnitRefData | RedirectCommand> => {
    const route = {
      paramMap: convertToParamMap({ reportTypeId }),
      parent: parentRoutePath
        ? {
            paramMap: convertToParamMap({}),
            parent: null,
            routeConfig: { path: parentRoutePath },
          }
        : null,
    } as ActivatedRouteSnapshot;

    return firstValueFrom(
      executeResolver(route, {} as never) as Observable<IOpalFinesBusinessUnitRefData | RedirectCommand>,
    );
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getReport: vi.fn().mockName('OpalFines.getReport'),
      getBusinessUnits: vi.fn().mockName('OpalFines.getBusinessUnits'),
      getBusinessUnitsByPermission: vi.fn().mockName('OpalFines.getBusinessUnitsByPermission'),
    };
    mockOpalFinesService.getBusinessUnits.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockRouter.createUrlTree.mockReset();
    mockRouter.createUrlTree.mockReturnValue({} as UrlTree);

    TestBed.configureTestingModule({
      providers: [
        { provide: OpalFines, useValue: mockOpalFinesService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  it('should resolve business units using the report metadata permission', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        report_id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        report_title: 'Operational reports (by enforcement)',
        report_permission: 'OPERATIONAL_REPORT_BY_ENFORCEMENT',
      }),
    );

    const result = await runResolver(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('OPERATIONAL_REPORT_BY_ENFORCEMENT');
    expect(mockOpalFinesService.getBusinessUnits).not.toHaveBeenCalled();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should return to the summary list when manual creation is unavailable', async () => {
    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        report_id: reportTypeId,
        report_title: 'Operational reports (by enforcement)',
        can_manually_create: false,
        report_permission: 'OPERATIONAL_REPORT_BY_ENFORCEMENT',
      }),
    );

    const result = await runResolver(reportTypeId, FINES_REPORTS_ROUTING_PATHS.children.create);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.summaryList}`,
    ]);
    expect(mockOpalFinesService.getBusinessUnits).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should resolve business units for the summary list when manual creation is unavailable', async () => {
    const reportTypeId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        report_id: reportTypeId,
        report_title: 'Operational reports (by enforcement)',
        can_manually_create: false,
        report_permission: 'OPERATIONAL_REPORT_BY_ENFORCEMENT',
      }),
    );

    const result = await runResolver(reportTypeId, FINES_REPORTS_ROUTING_PATHS.children.summaryList);

    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('OPERATIONAL_REPORT_BY_ENFORCEMENT');
  });

  it('should redirect to Access denied when the report metadata has no permission', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        report_id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        report_title: 'Operational reports (by enforcement)',
      }),
    );

    const result = await runResolver(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(result).toBeInstanceOf(RedirectCommand);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([`/${COMMON_PAGES_ROUTING_PATHS.children.accessDenied}`]);
    expect(mockOpalFinesService.getBusinessUnits).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should fall back to all business units when the report route is not configured', async () => {
    const result = await runResolver('unknown-report');

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should return no business units without making a request for Your reports', async () => {
    const result = await runResolver(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnits).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(result).toEqual({
      count: 0,
      refData: [],
    });
  });
});
