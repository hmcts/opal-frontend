import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { getFinesReportsRouteReportTypeId } from '../../../utils/fines-reports-route.utils';

/**
 * Requires a stored business unit selection for the report journey before allowing access.
 *
 * @param route - The target route snapshot identifying the report journey.
 * @returns True when access is allowed, or a URL tree to the reports dashboard or business unit selection.
 */
export const finesReportsCreateStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const reportTypeId = getFinesReportsRouteReportTypeId(route);

  if (!reportTypeId) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  if (!finesReportsStore.hasSelectedBusinessUnitsForReport(reportTypeId)) {
    return router.createUrlTree([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  }

  return true;
};
