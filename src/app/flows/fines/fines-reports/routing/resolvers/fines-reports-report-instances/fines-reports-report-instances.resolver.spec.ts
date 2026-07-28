import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn } from '@angular/router';
import { isObservable, lastValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReportInstancesResponse } from '@services/fines/opal-fines-service/interfaces/opal-fines-report-instances-response.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { FinesReportsSummaryListStore } from '../../../fines-reports-summary-list/stores/fines-reports-summary-list.store';
import { finesReportsReportInstancesResolver } from './fines-reports-report-instances.resolver';

describe('finesReportsReportInstancesResolver', () => {
  type ResolverResult = Awaited<ReturnType<typeof finesReportsReportInstancesResolver>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFines: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  const reportId = FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement;

  const executeResolver =
    () =>
    (...resolverParameters: Parameters<ResolveFn<unknown>>) =>
      TestBed.runInInjectionContext(() => finesReportsReportInstancesResolver(...resolverParameters));

  async function runResolver(route: ActivatedRouteSnapshot): Promise<ResolverResult> {
    const resolver = executeResolver();
    const result = resolver(route, {} as never);
    return isObservable(result)
      ? ((await lastValueFrom(result as never)) as ResolverResult)
      : (result as ResolverResult);
  }

  beforeEach(() => {
    mockOpalFines = {
      getReportInstances: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [FinesReportsSummaryListStore, { provide: OpalFines, useValue: mockOpalFines }],
    });

    store = TestBed.inject(FinesReportsSummaryListStore);
    store.resetFilters();
  });

  it('should request report instances with the selected business unit filter', async () => {
    const response: IOpalFinesReportInstancesResponse = {
      report_instances: [],
      count: 0,
    };
    mockOpalFines.getReportInstances.mockReturnValue(of(response));

    const route = {
      paramMap: convertToParamMap({ reportTypeId: reportId }),
      parent: null,
    } as ActivatedRouteSnapshot;

    store.setReportTypeId(reportId);
    store.setFilters({
      businessUnit: '67',
      dateFilter: 'last7Days',
      days: '',
      dateFrom: '',
      dateTo: '',
    });
    store.setAppliedQuery({
      fromDate: '2026-06-01',
      toDate: '2026-06-07',
      businessUnit: '67',
    });

    const result = await runResolver(route);

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: reportId,
        business_units: ['67'],
      }),
    );
    expect(result).toEqual(response);
  });

  it('should return empty report instances without making a request for Your reports', async () => {
    const route = {
      paramMap: convertToParamMap({
        reportTypeId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports,
      }),
      parent: null,
    } as ActivatedRouteSnapshot;

    const result = await runResolver(route);

    expect(mockOpalFines.getReportInstances).not.toHaveBeenCalled();
    expect(result).toEqual({
      report_instances: [],
      count: 0,
    });
  });

  it('should request report instances with a null report id for unknown report routes', async () => {
    const response: IOpalFinesReportInstancesResponse = {
      report_instances: [],
      count: 0,
    };
    mockOpalFines.getReportInstances.mockReturnValue(of(response));

    const route = {
      paramMap: convertToParamMap({ reportTypeId: 'unknown-report' }),
      parent: null,
    } as ActivatedRouteSnapshot;

    const result = await runResolver(route);

    expect(mockOpalFines.getReportInstances).toHaveBeenCalledWith(
      expect.objectContaining({
        report_id: null,
      }),
    );
    expect(result).toEqual(response);
  });

  it('should return load error route data when the report instances request fails', async () => {
    mockOpalFines.getReportInstances.mockReturnValue(throwError(() => new Error('Report instances request failed')));

    const route = {
      paramMap: convertToParamMap({ reportTypeId: reportId }),
      parent: null,
    } as ActivatedRouteSnapshot;

    const result = await runResolver(route);

    expect(result).toEqual({
      report_instances: [],
      count: 0,
      loadError: true,
    });
  });
});
