import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { fetchBusinessUnitsResolver } from './fetch-business-units.resolver';
import { firstValueFrom, Observable, of } from 'rxjs';
import { IOpalFinesBusinessUnitRefData } from '@services/fines/opal-fines-service/interfaces/opal-fines-business-unit-ref-data.interface';
import { OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-business-unit-ref-data.mock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '@app/flows/fines/fines-reports/fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';

describe('fetchBusinessUnitsResolver', () => {
  const executeResolver: ResolveFn<IOpalFinesBusinessUnitRefData> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchBusinessUnitsResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  beforeEach(() => {
    mockOpalFinesService = {
      getBusinessUnits: vi.fn().mockName('OpalFines.getBusinessUnits'),
      getBusinessUnitsByPermission: vi.fn().mockName('OpalFines.getBusinessUnitsByPermission'),
      getReport: vi.fn().mockName('OpalFines.getReport'),
    };
    mockOpalFinesService.getBusinessUnits.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockOpalFinesService.getBusinessUnitsByPermission.mockReturnValue(of(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK));
    mockOpalFinesService.getReport.mockReturnValue(of(OPAL_FINES_REPORT_MOCK));

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should call getBusinessUnits with the correct permission from route data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'PERMISSION_XYZ' } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('PERMISSION_XYZ');
  });

  it('should resolve business units data from the service', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: { permission: 'TEST_PERMISSION' } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should call getBusinessUnits without args when no permission is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = { data: {} }; // no permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith();
  });

  it('should fetch report metadata and use the report permission to filter business units', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: {},
      parent: {
        paramMap: {
          get: () => FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );

    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
    expect(mockOpalFinesService.getBusinessUnits).not.toHaveBeenCalled();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should fetch all business units when report metadata has no permission', async () => {
    mockOpalFinesService.getReport.mockReturnValue(
      of({
        ...OPAL_FINES_REPORT_MOCK,
        permission: null,
      }),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: {},
      parent: {
        paramMap: {
          get: () => FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );

    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should fetch report metadata using a report type id on the current route', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: {},
      paramMap: {
        get: () => FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await firstValueFrom(executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>);

    expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
    );
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith(OPAL_FINES_REPORT_MOCK.permission);
  });

  it('should fetch all business units when no permission or report type id is provided', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: {},
      paramMap: {
        get: () => null,
      },
      parent: {
        paramMap: {
          get: () => null,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    const result = await firstValueFrom(
      executeResolver(route, mockRouterStateSnapshot) as Observable<IOpalFinesBusinessUnitRefData>,
    );

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnits).toHaveBeenCalledWith();
    expect(result).toEqual(OPAL_FINES_BUSINESS_UNIT_REF_DATA_MOCK);
  });

  it('should prefer route data permission over report metadata permission', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const route: any = {
      data: { permission: 'ROUTE_PERMISSION' },
      parent: {
        paramMap: {
          get: () => FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockRouterStateSnapshot: any = {
      toString: vi.fn().mockName('RouterStateSnapshot.toString'),
    };

    await executeResolver(route, mockRouterStateSnapshot);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(mockOpalFinesService.getBusinessUnitsByPermission).toHaveBeenCalledWith('ROUTE_PERMISSION');
  });
});
