import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should expose a create report stub route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );

    expect(createRoute).toEqual(
      expect.objectContaining({
        path: FINES_REPORTS_ROUTING_PATHS.children.create,
        resolve: expect.objectContaining({
          title: expect.any(Function),
        }),
      }),
    );
    expect(createRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should expose a report summary stub route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const reportSummaryRoute = reportRoute?.children?.find(
      (route) => route.path === `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
    );

    expect(reportSummaryRoute).toEqual(
      expect.objectContaining({
        path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
        resolve: expect.objectContaining({
          title: expect.any(Function),
        }),
      }),
    );
    expect(reportSummaryRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should resolve summary list business units using report permissions', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );

    expect(summaryListRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
  });
});
