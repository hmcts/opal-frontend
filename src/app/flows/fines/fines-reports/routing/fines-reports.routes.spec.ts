import { describe, expect, it } from 'vitest';
import { routing } from './fines-reports.routes';
import { FINES_REPORTS_ROUTING_PATHS } from './constants/fines-reports-routing-paths.constant';

describe('finesReports routes', () => {
  it('should redirect bare report routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const defaultChildRoute = reportRoute?.children?.find((route) => route.path === '');

    expect(defaultChildRoute).toEqual({
      path: '',
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });

  it('should temporarily redirect select business units routes to the summary list', () => {
    const reportRoute = routing.find((route) => route.path === ':reportId');
    const selectBusinessUnitsRoute = reportRoute?.children?.find(
      (route) => route.path === FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
    );

    expect(selectBusinessUnitsRoute).toEqual({
      path: FINES_REPORTS_ROUTING_PATHS.children.selectBusinessUnits,
      redirectTo: FINES_REPORTS_ROUTING_PATHS.children.summaryList,
      pathMatch: 'full',
    });
  });
});
