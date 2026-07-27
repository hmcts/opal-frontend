import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(reportRoute?.canActivateChild).toEqual([finesReportsStateGuard]);
    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should expose the PO-2307 create report stub route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );

    expect(createRoute).toEqual(
      expect.objectContaining({
        path: FINES_REPORTS_ROUTING_PATHS.children.create,
        data: {
          title: FINES_REPORTS_ROUTING_TITLES.children.create,
        },
        resolve: {
          title: TitleResolver,
        },
      }),
    );
    expect(createRoute?.loadComponent).toEqual(expect.any(Function));
    expect(createRoute?.children).toBeUndefined();
  });

  it('should expose a report summary route for summary-list date and time links', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const reportSummaryRoute = reportRoute?.children?.find(
      (route) => route.path === `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
    );

    expect(reportSummaryRoute).toEqual(
      expect.objectContaining({
        path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
        data: {
          title: FINES_REPORTS_ROUTING_TITLES.children.reportSummary,
        },
        resolve: expect.objectContaining({
          title: TitleResolver,
        }),
      }),
    );
    expect(reportSummaryRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should resolve summary-list business units using report permissions', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );

    expect(summaryListRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
  });
});
