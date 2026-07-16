import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';
import { fetchReportInstanceResolver } from './resolvers/fetch-report-instance/fetch-report-instance.resolver';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(reportRoute?.canActivate).toContain(finesReportsStateGuard);
    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should load the summary list route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );

    expect(summaryListRoute).toEqual({
      path: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      loadComponent: expect.any(Function),
      resolve: {
        title: finesReportsTitleResolver,
      },
    });
  });

  it('should load the report summary route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const reportSummaryRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.reportSummary,
    );

    expect(reportSummaryRoute).toEqual({
      path: FINES_REPORTS_ROUTING_PATHS.children.reportSummary,
      loadComponent: expect.any(Function),
      data: {
        title: FINES_REPORTS_ROUTING_TITLES.children.reportSummary,
      },
      resolve: {
        title: TitleResolver,
        reportSummary: fetchReportInstanceResolver,
      },
    });
  });
});
