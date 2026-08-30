import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';

const getReportTypeId = (route: ActivatedRouteSnapshot): string | null => {
  let currentRoute: ActivatedRouteSnapshot | null = route;

  while (currentRoute) {
    const reportTypeId = currentRoute.paramMap.get('reportTypeId');

    if (reportTypeId) {
      return reportTypeId;
    }

    currentRoute = currentRoute.parent;
  }

  return null;
};

export const finesReportsCreateStateGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const reportTypeId = getReportTypeId(route);

  if (!reportTypeId) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  if (
    route.data['requiresSelectedBusinessUnits'] === true &&
    !finesReportsStore.hasSelectedBusinessUnitsForReport(reportTypeId)
  ) {
    return router.createUrlTree([
      `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${reportTypeId}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
    ]);
  }

  return true;
};
