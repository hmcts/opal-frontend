import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { OPAL_FINES_REPORT_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report.mock';
import { fetchReportResolver } from './fetch-report.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';

describe('fetchReportResolver', () => {
  const API_BACKED_REPORT_ID = 'api_backed_report';
  const executeResolver: ResolveFn<IOpalFinesReport | null> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchReportResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  const buildRoute = (reportId: string | null, parentReportId?: string) => {
    const parentRoute = parentReportId ? { paramMap: convertToParamMap({ reportId: parentReportId }) } : undefined;

    return {
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
      parent: parentRoute,
    } as ActivatedRouteSnapshot;
  };

  const withApiBackedReportConfig = async (testFn: () => Promise<void>) => {
    FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.push({
      id: API_BACKED_REPORT_ID,
      heading: 'API backed report',
      title: 'API backed report',
      permissionIds: [1],
    });

    try {
      await testFn();
    } finally {
      FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.pop();
    }
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getReport: vi.fn().mockReturnValue(of(OPAL_FINES_REPORT_MOCK)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should temporarily skip the report API for operational reports until backend permissions are supported', async () => {
    const route = buildRoute(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement);

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesReport | null>);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should use the parent route report id when applying the operational report API bypass', async () => {
    const route = buildRoute(null, FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesReport | null>);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should resolve report metadata for an API-backed report id', async () => {
    await withApiBackedReportConfig(async () => {
      const route = buildRoute(API_BACKED_REPORT_ID);

      const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesReport | null>);

      expect(mockOpalFinesService.getReport).toHaveBeenCalledWith(API_BACKED_REPORT_ID);
      expect(result).toEqual(OPAL_FINES_REPORT_MOCK);
    });
  });

  it('should not call the report API for reports that do not support create report', async () => {
    const route = buildRoute(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports);

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesReport | null>);

    expect(mockOpalFinesService.getReport).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should fall back to null when the report API fails', async () => {
    await withApiBackedReportConfig(async () => {
      mockOpalFinesService.getReport.mockReturnValue(throwError(() => new Error('report lookup failed')));
      const route = buildRoute(API_BACKED_REPORT_ID);

      const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<IOpalFinesReport | null>);

      expect(result).toBeNull();
    });
  });
});
