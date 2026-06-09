import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { finesReportsReportHeadingResolver } from './fines-reports-report-heading.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

describe('finesReportsReportHeadingResolver', () => {
  const executeResolver: ResolveFn<string> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsReportHeadingResolver(...resolverParameters));

  const buildRoute = (reportId: string | null, parentReportId?: string) => {
    const parentRoute = parentReportId ? { paramMap: convertToParamMap({ reportId: parentReportId }) } : undefined;

    return {
      paramMap: convertToParamMap(reportId ? { reportId } : {}),
      parent: parentRoute,
    } as ActivatedRouteSnapshot;
  };

  it.each([
    [
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
      'Operational reports (by enforcement)',
    ],
    [
      FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments,
      'Operational reports (by payments)',
    ],
  ])('should resolve the report heading for %s', (reportId, expectedHeading) => {
    const result = executeResolver(buildRoute(reportId), {} as never);

    expect(result).toBe(expectedHeading);
  });

  it('should use the parent route report id when the child route does not include one', () => {
    const result = executeResolver(
      buildRoute(null, FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments),
      {} as never,
    );

    expect(result).toBe('Operational reports (by payments)');
  });

  it('should return an empty heading when the report id is unknown', () => {
    const result = executeResolver(buildRoute('unknown-report-id'), {} as never);

    expect(result).toBe('');
  });
});
