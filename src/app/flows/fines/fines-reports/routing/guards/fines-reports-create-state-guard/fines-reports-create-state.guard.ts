import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION } from '../../../fines-reports-summary-list/constants/fines-reports-summary-list-report-configuration.constant';
import { FinesReportsStore } from '../../../stores/fines-reports.store';
import { FINES_ROUTING_PATHS } from '@app/flows/fines/routing/constants/fines-routing-paths.constant';
import { FINES_DASHBOARD_ROUTING_PATHS } from '@app/flows/fines/constants/fines-dashboard-routing-paths.constant';
import { FINES_REPORTS_ROUTING_PATHS } from '../../constants/fines-reports-routing-paths.constant';
import { FINES_REPORTS_CREATE_ROUTING_PATHS } from '../../constants/fines-reports-create-routing-paths.constant';
import { OpalFines } from '@services/fines/opal-fines-service/opal-fines.service';

// Create pages sit beneath the report route, so the report id may belong to an ancestor rather than the child route.
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

/**
 * Checks that a create-report child route has the required report and business-unit selection state.
 */
export const finesReportsCreateStateGuard: CanActivateChildFn = (route) => {
  const router = inject(Router);
  const finesReportsStore = inject(FinesReportsStore);
  const opalFinesService = inject(OpalFines);
  const reportTypeId = getReportTypeId(route);
  const report = FINES_REPORT_SUMMARY_LIST_REPORT_CONFIGURATION.find((config) => config.id === reportTypeId);

  // The parent access guard normally handles this, but fail safely if this guard is used without a valid report route.
  if (!report) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.root,
      FINES_DASHBOARD_ROUTING_PATHS.children.reports,
    ]);
  }

  // Frontend-only reports cannot enter the create journey, so return to their summary list.
  if (!report.requiresReportMetadata) {
    return router.createUrlTree([
      '/',
      FINES_ROUTING_PATHS.root,
      FINES_ROUTING_PATHS.children.reports.root,
      report.id,
      FINES_REPORTS_ROUTING_PATHS.children.summaryList,
    ]);
  }

  const requiresSelectedBusinessUnits = route.data['requiresSelectedBusinessUnits'] === true;

  // The report metadata determines whether manual creation is available for this operational report.
  return opalFinesService.getReport(report.id).pipe(
    map((reportMetadata) => {
      if (!reportMetadata.can_manually_create) {
        return router.createUrlTree([
          '/',
          FINES_ROUTING_PATHS.root,
          FINES_ROUTING_PATHS.children.reports.root,
          report.id,
          FINES_REPORTS_ROUTING_PATHS.children.summaryList,
        ]);
      }

      // Later create pages require a selection made on the select-business-units page for this same report.
      if (requiresSelectedBusinessUnits && !finesReportsStore.hasSelectedBusinessUnitsForReport(report.id)) {
        return router.createUrlTree([
          `/${FINES_ROUTING_PATHS.root}/${FINES_ROUTING_PATHS.children.reports.root}/${report.id}/${FINES_REPORTS_ROUTING_PATHS.children.create}/${FINES_REPORTS_CREATE_ROUTING_PATHS.children.selectBusinessUnits}`,
        ]);
      }

      return true;
    }),
    // Do not allow a create route when the report metadata cannot be loaded.
    catchError(() => of(false)),
  );
};
