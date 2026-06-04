import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';
import { TitleResolver } from '@hmcts/opal-frontend-common/resolvers/title';
import { fetchBusinessUnitsResolver } from '@routing/fines/resolvers/fetch-business-units-resolver/fetch-business-units.resolver';
import { FINES_REPORTS_ROUTING_TITLES } from './constants/fines-reports-routing-titles.constant';
import { finesReportsStateGuard } from './guards/fines-reports-state-guard/fines-reports-state.guard';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(reportRoute?.canActivateChild).toEqual([finesReportsStateGuard]);
    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should load the select business units route', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const selectBusinessUnitsRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual({
      path: FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
      loadComponent: expect.any(Function),
      data: {
        title: FINES_REPORTS_ROUTING_TITLES.children.selectBusinessUnits,
        requiresCreateReport: true,
      },
      resolve: {
        title: TitleResolver,
        businessUnits: fetchBusinessUnitsResolver,
      },
    });
  });
});
