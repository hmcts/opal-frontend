import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn } from '@angular/router';
import { firstValueFrom, Observable, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { finesReportsBusinessUnitsResolver } from './fines-reports-business-units.resolver';

describe('finesReportsBusinessUnitsResolver', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  const executeResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsBusinessUnitsResolver(...resolverParameters));

  const runResolver = async (reportTypeId: string): Promise<IOpalFinesBusinessUnitRefData> => {
    const route = {
      paramMap: convertToParamMap({ reportTypeId }),
      parent: null,
    } as ActivatedRouteSnapshot;

    return firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesBusinessUnitRefData>);
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getReport: vi.fn().mockName('OpalFines.getReport'),
      getBusinessUnits: vi.fn().mockName('OpalFines.getBusinessUnits'),
      getBusinessUnitsByPermission: vi.fn().mockName('OpalFines.getBusinessUnitsByPermission'),
    };
    mockOpalFinesService.getBusinessUnits.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
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

  it('should fall back to all business units when the report metadata has no permission', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        report_id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        report_title: 'Operational reports (by enforcement)',
      }),
    );

    await runResolver(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
  });

  it('should resolve all business units for Your reports because it has no single report permission', async () => {
    await runResolver(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalled();
  });
});
