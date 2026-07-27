import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from './constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';
import { finesReportsBusinessUnitsResolver } from './resolvers/fines-reports-business-units/fines-reports-business-units.resolver';
import { finesReportsReportHeadingResolver } from './resolvers/fines-reports-report-heading/fines-reports-report-heading.resolver';
import { fetchReportResolver } from './resolvers/fetch-report/fetch-report.resolver';

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

  it('should load the PO-2305 select business units route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const selectBusinessUnitsRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual({
      path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
      loadComponent: expect.any(Function),
      canDeactivate: [canDeactivateGuard],
      data: {
        title: FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits,
        requiresCreateReport: true,
      },
      resolve: {
        title: TitleResolver,
        report: fetchReportResolver,
        reportHeading: finesReportsReportHeadingResolver,
        businessUnits: finesReportsBusinessUnitsResolver,
      },
    });
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

  it('should load the business unit warning route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const businessUnitWarningRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning,
    );

    expect(businessUnitWarningRoute).toEqual({
      path: FINES_REPORTS_CREATE_ROUTING_PATHS.children.businessUnitWarning,
      loadComponent: expect.any(Function),
      data: {
        title: FINES_REPORTS_ROUTING_TITLES.children.businessUnitWarning,
        requiresCreateReport: true,
        requiresSelectedBusinessUnits: true,
      },
      resolve: {
        title: TitleResolver,
      },
    });
  });

  it('should resolve summary-list and Select business unit business units using report permissions', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const summaryListRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    );
    const createRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.create,
    );
    const selectBusinessUnitsRoute = createRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(summaryListRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
    expect(selectBusinessUnitsRoute?.resolve?.['businessUnits']).toBe(finesReportsBusinessUnitsResolver);
  });
});
