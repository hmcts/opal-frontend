import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, ResolveFn } from '@angular/router';
import { isObservable, lastValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';
import { IOpalFinesReport } from '@services/fines/opal-fines-service/interfaces/opal-fines-report.interface';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import { finesReportsReportMetadataResolver } from './fines-reports-report-metadata.resolver';

describe('finesReportsReportMetadataResolver', () => {
  type ResolverResult = Awaited<ReturnType<typeof finesReportsReportMetadataResolver>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockOpalFines: any;

  const executeResolver =
    () =>
    (...resolverParameters: Parameters<ResolveFn<unknown>>) =>
      TestBed.runInInjectionContext(() => finesReportsReportMetadataResolver(...resolverParameters));

  async function runResolver(route: ActivatedRouteSnapshot): Promise<ResolverResult> {
    const resolver = executeResolver();
    const result = resolver(route, {} as never);
    return isObservable(result)
      ? ((await lastValueFrom(result as never)) as ResolverResult)
      : (result as ResolverResult);
  }

  const buildRoute = (reportTypeId: string): ActivatedRouteSnapshot =>
    ({
      paramMap: convertToParamMap({ reportTypeId }),
      parent: null,
    }) as ActivatedRouteSnapshot;

  beforeEach(() => {
    mockOpalFines = {
      getReport: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: OpalFines, useValue: mockOpalFines }],
    });
  });

  it('should request report metadata for configured operational reports', async () => {
    const response: IOpalFinesReport = {
      report_id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      report_title: 'Operational reports (by enforcement)',
      can_manually_create: true,
    };
    mockOpalFines.getReport.mockReturnValue(of(response));

    const result = await runResolver(
      buildRoute(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement),
    );

    expect(mockOpalFines.getReport).toHaveBeenCalledWith(
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    );
    expect(result).toEqual(response);
  });

  it('should return null for your reports and unknown report routes', async () => {
    expect(await runResolver(buildRoute(FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.yourReports))).toBeNull();
    expect(await runResolver(buildRoute('unknown-report'))).toBeNull();
    expect(mockOpalFines.getReport).not.toHaveBeenCalled();
  });
});
