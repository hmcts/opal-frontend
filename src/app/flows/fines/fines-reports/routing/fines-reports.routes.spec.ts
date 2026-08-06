import { describe, expect, it } from 'vitest';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';
import { fetchReportInstanceResolver } from './resolvers/fetch-report-instance/fetch-report-instance.resolver';
import { finesReportsReportInstancesResolver } from './resolvers/fines-reports-report-instances/fines-reports-report-instances.resolver';
import { finesReportsReportMetadataResolver } from './resolvers/fines-reports-report-metadata/fines-reports-report-metadata.resolver';
import { finesReportsTitleResolver } from './resolvers/fines-reports-title/fines-reports-title.resolver';

describe('finesReports routes', () => {
  it('should protect the report route and redirect its empty child to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(reportRoute?.canActivate).toContain(finesReportsStateGuard);
    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should retain the PO-2307 create route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );

    expect(createRoute).toEqual(
      expect.objectContaining({
        path: FINES_REPORTS_ROUTING_PATHS.children.create,
        data: { title: FINES_REPORTS_ROUTING_TITLES.children.create },
        resolve: { title: TitleResolver },
      }),
    );
    expect(createRoute?.loadComponent).toEqual(expect.any(Function));
  });

  it('should resolve the PO-2306 report summary for the PO-2307 reportInstanceId route parameter', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const reportSummaryRoute = reportRoute?.children?.find(
      (route) => route.path === `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
    );

    expect(reportSummaryRoute).toEqual({
      path: `${FINES_REPORTS_ROUTING_PATHS.children.reportSummary}/:reportInstanceId`,
      loadComponent: expect.any(Function),
      data: { title: FINES_REPORTS_ROUTING_TITLES.children.reportSummary },
      resolve: {
        title: TitleResolver,
        reportSummary: fetchReportInstanceResolver,
      },
    });
  });

  it('should retain the PO-2307 summary-list resolvers', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );

    expect(summaryListRoute?.resolve).toEqual({
      title: finesReportsTitleResolver,
      businessUnits: finesReportsBusinessUnitsResolver,
      reportMetadata: finesReportsReportMetadataResolver,
      reportInstances: finesReportsReportInstancesResolver,
    });
  });
});
