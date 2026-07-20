import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from './constants/fines-reports-create-routing-paths.constant';
import { canDeactivateGuard } from '@hmcts/opal-frontend-common/guards/can-deactivate';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { authGuard } from '@hmcts/opal-frontend-common/guards/auth';
import { finesReportsAccessGuard } from './guards/fines-reports-access-guard/fines-reports-access.guard';
import { finesReportsCreateStateGuard } from './guards/fines-reports-create-state-guard/fines-reports-create-state.guard';
import { finesReportsReportHeadingResolver } from './resolvers/fines-reports-report-heading/fines-reports-report-heading.resolver';
import { fetchReportResolver } from './resolvers/fetch-report/fetch-report.resolver';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportTypeId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(reportRoute?.canActivate).toEqual([authGuard, finesReportsAccessGuard]);
    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should load the select business units route', () => {
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
      },
      resolve: {
        title: TitleResolver,
        report: fetchReportResolver,
        reportHeading: finesReportsReportHeadingResolver,
        businessUnits: fetchBusinessUnitsResolver,
      },
    });
    expect(createRoute?.canActivateChild).toEqual([finesReportsCreateStateGuard]);
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
        requiresSelectedBusinessUnits: true,
      },
      resolve: {
        title: TitleResolver,
      },
    });
  });
});
