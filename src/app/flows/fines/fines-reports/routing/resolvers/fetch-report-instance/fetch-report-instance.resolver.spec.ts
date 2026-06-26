import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { OPAL_FINES_REPORT_INSTANCE_MOCK } from '@services/fines/opal-fines-service/mocks/opal-fines-report-instance.mock';
import { fetchReportInstanceResolver } from './fetch-report-instance.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

describe('fetchReportInstanceResolver', () => {
  const executeResolver: ResolveFn<unknown> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => fetchReportInstanceResolver(...resolverParameters));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFinesService: any;

  const buildRoute = (reportInstanceId: string | null, parentReportId?: string) => {
    const parentRoute = parentReportId ? { paramMap: convertToParamMap({ reportId: parentReportId }) } : undefined;

    return {
      paramMap: convertToParamMap(reportInstanceId ? { reportInstanceId } : {}),
      parent: parentRoute,
    } as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    mockOpalFinesService = {
      getReportInstance: vi.fn().mockReturnValue(of(OPAL_FINES_REPORT_INSTANCE_MOCK)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFinesService }],
    });
  });

  it('should resolve report summary data from the report instance API', async () => {
    const route = buildRoute(
      '12345',
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<unknown>);

    expect(mockOpalFinesService.getReportInstance).toHaveBeenCalledWith('12345');
    expect(result).not.toBeNull();
  });

  it('should fall back to null when the report instance API fails', async () => {
    mockOpalFinesService.getReportInstance.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 406, statusText: 'Not Acceptable' })),
    );
    const route = buildRoute('12345', FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments);

    const result = await firstValueFrom(executeResolver(route, {} as never) as Observable<unknown>);

    expect(result).toBeNull();
  });

  it('should fall back to null when the report instance id is missing', async () => {
    const result = await firstValueFrom(executeResolver(buildRoute(null), {} as never) as Observable<unknown>);

    expect(mockOpalFinesService.getReportInstance).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should fall back to null when the report instance id is not in the API format', async () => {
    const result = await firstValueFrom(
      executeResolver(buildRoute('report-instance-enforcement-001'), {} as never) as Observable<unknown>,
    );

    expect(mockOpalFinesService.getReportInstance).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
