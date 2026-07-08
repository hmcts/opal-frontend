import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { finesReportsReportHeadingResolver } from './fines-reports-report-heading.resolver';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../../../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';

describe('finesReportsReportHeadingResolver', () => {
  const executeResolver: ResolveFn<string> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => finesReportsReportHeadingResolver(...resolverParameters));

  const buildRoute = (reportTypeId: string | null, parentReportTypeId?: string) => {
    const parentRoute = parentReportTypeId
      ? { paramMap: convertToParamMap({ reportTypeId: parentReportTypeId }) }
      : undefined;

    return {
      paramMap: convertToParamMap(reportTypeId ? { reportTypeId } : {}),
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
  ])('should resolve the report heading for %s', (reportTypeId, expectedHeading) => {
    const result = executeResolver(buildRoute(reportTypeId), {} as never);

    expect(result).toBe(expectedHeading);
  });

  it('should use the parent route report type id when the child route does not include one', () => {
    const result = executeResolver(
      buildRoute(null, FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByPayments),
      {} as never,
    );

    expect(result).toBe('Operational reports (by payments)');
  });

  it('should return an empty heading when the report type id is unknown', () => {
    const result = executeResolver(buildRoute('unknown-report-id'), {} as never);

    expect(result).toBe('');
  });
});
