import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS } from '../fines-reports-summary-list/routing/constants/fines-reports-summary-list-routing-paths.constant';
import {
  getFinesReportsRouteConfiguration,
  getFinesReportsRouteReportTypeId,
} from './fines-reports-route.utils';

describe('fines-reports-route.utils', () => {
  const buildRoute = (
    params: Record<string, string> = {},
    parentParams?: Record<string, string>,
  ): ActivatedRouteSnapshot =>
    ({
      paramMap: convertToParamMap(params),
      parent: parentParams
        ? {
            paramMap: convertToParamMap(parentParams),
          }
        : null,
    }) as ActivatedRouteSnapshot;

  it('should read the report type id from the current or parent route', () => {
    expect(getFinesReportsRouteReportTypeId(buildRoute({ reportTypeId: 'report-type-id' }))).toBe('report-type-id');
    expect(getFinesReportsRouteReportTypeId(buildRoute({ reportId: 'report-id' }))).toBe('report-id');
    expect(getFinesReportsRouteReportTypeId(buildRoute({}, { reportTypeId: 'parent-report-type-id' }))).toBe(
      'parent-report-type-id',
    );
    expect(getFinesReportsRouteReportTypeId(buildRoute({}, { reportId: 'parent-report-id' }))).toBe(
      'parent-report-id',
    );
    expect(getFinesReportsRouteReportTypeId(buildRoute())).toBeNull();
  });

  it('should return the configured report route metadata', () => {
    const route = buildRoute({
      reportTypeId: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
    });

    expect(getFinesReportsRouteConfiguration(route)).toEqual(
      expect.objectContaining({
        id: FINES_REPORTS_SUMMARY_LIST_ROUTING_PATHS.children.operationalReportsByEnforcement,
        heading: 'Operational reports (by enforcement)',
      }),
    );
  });

  it('should return null when no report route configuration matches', () => {
    expect(getFinesReportsRouteConfiguration(buildRoute({ reportTypeId: 'unknown-report' }))).toBeNull();
  });
});
